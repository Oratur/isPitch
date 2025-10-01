import asyncio
import logging

from src.analysis.application.dependencies import services as deps
from src.analysis.infrastructure.persistance.documents.analysis_document import (
    AnalysisDocument,
)
from src.core.database import db

from ....core.celery_config import celery_app
from ...domain.models.analysis import (
    Analysis,
    AnalysisStatus,
    AudioAnalysis,
    SpeechAnalysis,
)

logger = logging.getLogger(__name__)


@celery_app.task(name='run_analysis')
def run_analysis(analysis_id: str, audio_path: str, filename: str):
    transcription_port = deps.get_transcription_port()
    storage_port = deps.get_storage_port()
    speech_analysis_port = deps.get_speech_analysis_port()
    audio_analysis_port = deps.get_audio_analysis_port()
    analysis_repository = deps.get_analysis_repository()
    notification_port = deps.get_notification_port()

    async def publish_status(status):
        await notification_port.publish_status(analysis_id, status)

    async def transcribe_audio():
        await publish_status(AnalysisStatus.TRANSCRIBING)
        transcription = transcription_port.transcribe(audio_path)
        logger.info(f'[{analysis_id}] Transcription completed')
        return transcription

    async def analyze_speech(transcription):
        await publish_status(AnalysisStatus.ANALYZING_SPEECH)
        silence = speech_analysis_port.detect_silences(transcription)
        filler = speech_analysis_port.detect_fillerwords(transcription)
        logger.info(f'[{analysis_id}] Speech analysis completed')
        return SpeechAnalysis(
            silence_analysis=silence, fillerwords_analysis=filler
        )

    async def analyze_audio(transcription, speech_analysis):
        await publish_status(AnalysisStatus.ANALYZING_AUDIO)
        speech_rate = audio_analysis_port.get_speech_rate(
            audio_path=audio_path,
            transcription=transcription.text,
            silence_duration=speech_analysis.silence_analysis.duration,
        )
        logger.info(f'[{analysis_id}] Audio analysis completed')
        return AudioAnalysis(speech_rate=speech_rate)

    async def cleanup():
        storage_port.cleanup_temporary_file(audio_path)
        await publish_status(AnalysisStatus.DONE)
        logger.info(f'[{analysis_id}] Temporary audio file cleaned up.')

    async def run_async_operations():
        document_models = [AnalysisDocument]
        await db.connect(document_models=document_models)
        try:
            transcription = await transcribe_audio()
            speech_analysis = await analyze_speech(transcription)
            audio_analysis = await analyze_audio(transcription, speech_analysis)

            result = Analysis(
                id=analysis_id,
                status=AnalysisStatus.COMPLETED,
                filename=filename,
                transcription=transcription,
                speech_analysis=speech_analysis,
                audio_analysis=audio_analysis,
            )
            await analysis_repository.save(result)
            await publish_status(AnalysisStatus.COMPLETED)

        except Exception as e:
            logger.error(f'[{analysis_id}] Analysis failed: {e}', exc_info=True)
            await analysis_repository.save(
                Analysis(
                    id=analysis_id,
                    status=AnalysisStatus.FAILED,
                    filename=filename,
                )
            )
            await publish_status(AnalysisStatus.FAILED)
        finally:
            await cleanup()
            await db.close()

    asyncio.run(run_async_operations())
