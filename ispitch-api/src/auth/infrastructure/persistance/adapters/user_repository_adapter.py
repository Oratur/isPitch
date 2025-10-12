from ....domain.models.user import User
from ....domain.ports.output import UserRepositoryPort
from ...mappers.user_document_mapper import UserDocumentMapper
from ..documents.user_document import UserDocument


class UserRepositoryAdapter(UserRepositoryPort):
    @classmethod
    async def save(self, user: User) -> User:
        user_document = UserDocumentMapper.from_entity(user)
        await user_document.save()

        user_model = UserDocumentMapper.from_document(user_document)
        return user_model

    @classmethod
    async def find_by_email(self, email: str) -> User | None:
        user_document = await UserDocument.find_one(UserDocument.email == email)
        if not user_document:
            return None
        return UserDocumentMapper.from_document(user_document)
