from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional


@dataclass
class User:
    id: str
    email: str
    name: str
    hashed_password: str
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True
    last_login: Optional[datetime] = None

    # TODO: Verificar se esses métodos devem estar aqui 
    def mark_as_logged_in(self) -> None:
        """Atualiza o campo last_login para o horário atual."""
        self.last_login = datetime.now(timezone.utc)
    
    def deactivate(self) -> None:
        """Marca a conta do usuário como inativa."""
        if not self.active:
            raise ValueError("Usuário já está inativo.")
        
        self.active = False
        self.updated_at = datetime.now(timezone.utc)
    
    def activate(self) -> None:
        """Marca a conta do usuário como ativa."""
        if self.active:
            raise ValueError("Usuário já está ativo.")
        
        self.active = True
        self.updated_at = datetime.now(timezone.utc)