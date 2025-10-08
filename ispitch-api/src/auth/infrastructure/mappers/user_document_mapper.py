from ...domain.models.user import User
from ..persistance.documents.user_document import UserDocument


class UserDocumentMapper:
    @staticmethod
    def from_document(document: UserDocument) -> User:
        if document is None:
            return None

        return User(
            id=str(document.id),
            email=document.email,
            name=document.name,
            hashed_password=document.hashed_password,
            active=document.active,
            created_at=document.created_at,
            updated_at=document.updated_at,
            last_login=document.last_login,
        )

    @staticmethod
    def from_entity(entity: User) -> UserDocument:
        if entity is None:
            return None

        return UserDocument(
            email=entity.email,
            name=entity.name,
            hashed_password=entity.hashed_password,
            active=entity.active,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
            last_login=entity.last_login,
        )
