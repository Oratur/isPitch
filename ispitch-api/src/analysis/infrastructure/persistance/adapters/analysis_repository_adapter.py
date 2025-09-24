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
