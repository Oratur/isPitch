import asyncio
import logging

import redis.asyncio as aioredis

from src.analysis.application.dependencies import services as deps
from src.analysis.infrastructure.adapters.notification.redis_adapter import (
    RedisNotificationAdapter,
)
from src.analysis.infrastructure.persistance.documents.analysis_document import (
    AnalysisDocument,
)
from src.core.config import settings
from src.core.database import db

from ....core.celery_config import celery_app
from ...application.mappers.analysis_schema_mapper import AnalysisSchemaMapper
from ...domain.models.analysis import (
    Analysis,
    AnalysisStatus,
    AudioAnalysis,
    SpeechAnalysis,
)
from ...domain.models.events import SseEvent

logger = logging.getLogger(__name__)


@celery_app.task(name='run_analysis')
def run_analysis(analysis_id: str, audio_path: str, filename: str):
    transcription_port = deps.get_transcription_port()
    storage_port = deps.get_storage_port()
    speech_analysis_port = deps.get_speech_analysis_port()
    audio_analysis_port = deps.get_audio_analysis_port()
    analysis_repository = deps.get_analysis_repository()

    async def run_async_operations():
        redis_client = aioredis.from_url(settings.redis_url)
        await db.connect(document_models=[AnalysisDocument])
        notification_port = RedisNotificationAdapter(redis_client)

        async def publish(event: str, data: str):
            await notification_port.publish(
                analysis_id=analysis_id, event=event, data=data
            )

        async def transcribe_audio():
            await publish(SseEvent.STATUS_UPDATE, AnalysisStatus.TRANSCRIBING)
            transcription = transcription_port.transcribe(audio_path)
            logger.info(f'[{analysis_id}] Transcription completed')
            return transcription

        async def analyze_speech(transcription):
            await publish(
                SseEvent.STATUS_UPDATE, AnalysisStatus.ANALYZING_SPEECH
            )
            silence = speech_analysis_port.detect_silences(transcription)
            filler = speech_analysis_port.detect_fillerwords(transcription)
            logger.info(f'[{analysis_id}] Speech analysis completed')
            return SpeechAnalysis(
                silence_analysis=silence, fillerwords_analysis=filler
            )

        async def analyze_audio(transcription, speech_analysis):
            await publish(SseEvent.STATUS_UPDATE, AnalysisStatus.ANALYZING_AUDIO)
            speech_rate = audio_analysis_port.get_speech_rate(
                audio_path=audio_path,
                transcription=transcription.text,
                silence_duration=speech_analysis.silence_analysis.duration,
            )
            logger.info(f'[{analysis_id}] Audio analysis completed')
            return AudioAnalysis(speech_rate=speech_rate)

        async def cleanup():
            storage_port.cleanup_temporary_file(audio_path)
            await publish(SseEvent.STATUS_UPDATE, AnalysisStatus.DONE)
            logger.info(f'[{analysis_id}] Temporary audio file cleaned up.')

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

            analysis_schema = AnalysisSchemaMapper.from_model(result)
            result_json = analysis_schema.model_dump_json(by_alias=True)

            await publish(SseEvent.ANALYSIS_RESULT, result_json)
            await publish(SseEvent.STATUS_UPDATE, AnalysisStatus.COMPLETED)

        except Exception as e:
            logger.error(f'[{analysis_id}] Analysis failed: {e}', exc_info=True)
            await analysis_repository.save(
                Analysis(
                    id=analysis_id,
                    status=AnalysisStatus.FAILED,
                    filename=filename,
                )
            )
            await publish(SseEvent.STATUS_UPDATE, AnalysisStatus.FAILED)
        finally:
            await cleanup()
            await db.close()

    asyncio.run(run_async_operations())
