from datetime import datetime, timezone
from typing import Optional

from beanie import Document, Update, before_event
from pydantic import ConfigDict, EmailStr, Field
from pymongo import ASCENDING, IndexModel


class UserDocument(Document):
    model_config = ConfigDict(
        validate_assignment=True,
        str_strip_whitespace=True,
        populate_by_name=True,
    )

    email: EmailStr
    name: str = Field(min_length=3, max_length=255)
    hashed_password: str = Field(exclude=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    active: bool = True
    last_login: Optional[datetime] = None

    @before_event(Update)
    async def update_timestamp(self):
        """Updates the updated_at field before any update."""
        self.updated_at = datetime.now(timezone.utc)

    class Settings:
        name = 'users'
        indexes = [
            IndexModel([('email', ASCENDING)], name='email_index', unique=True)
        ]
