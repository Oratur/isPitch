import asyncio
from typing import List, Tuple

from ....domain.models.analysis import Analysis
from ....domain.ports.output import AnalysisRepositoryPort
from ...mappers.analysis_document_mapper import AnalysisDocumentMapper
from ..documents.analysis_document import AnalysisDocument


class AnalysisRepositoryAdapter(AnalysisRepositoryPort):
    @classmethod
    async def save(self, analysis: Analysis) -> Analysis:
        analysis_document = AnalysisDocumentMapper.from_entity(analysis)
        await analysis_document.save()
        return AnalysisDocumentMapper.from_document(analysis_document)

    @classmethod
    async def find_by_id(self, analysis_id: str) -> Analysis:
        analysis_document = await AnalysisDocument.get(analysis_id)
        return AnalysisDocumentMapper.from_document(analysis_document)

    @classmethod
    async def find_by_user_id(
        self, user_id: str, page: int, page_size: int
    ) -> Tuple[List[Analysis], int]:
        skip = (page - 1) * page_size
        find_query = AnalysisDocument.find({'user_id': user_id})

        list_task = (
            find_query.sort(-AnalysisDocument.created_at)
            .skip(skip)
            .limit(page_size)
            .to_list()
        )
        count_task = find_query.count()

        analysis_documents, total_count = await asyncio.gather(
            list_task, count_task
        )

        mapped_analyses = [
            analysis
            for document in analysis_documents
            if (analysis := AnalysisDocumentMapper.from_document(document))
            is not None
        ]

        return mapped_analyses, total_count

    @classmethod
    async def find_all(self) -> list[Analysis]:
        analysis_documents = await AnalysisDocument.find_all().to_list()
        return [
            AnalysisDocumentMapper.from_document(document)
            for document in analysis_documents
        ]

    @classmethod
    async def delete_by_id(self, analysis_id: str):
        analysis_document = await AnalysisDocument.get(analysis_id)
        await analysis_document.delete()

    @classmethod
    async def find_recent_by_user_id(self, user_id: str) -> Analysis:
        find_query = AnalysisDocument.find({'user_id': user_id})

        analysis_document = await find_query.sort(
            -AnalysisDocument.created_at
        ).first_or_none()

        mapped_analyses = AnalysisDocumentMapper.from_document(analysis_document)

        return mapped_analyses
