from ....auth.domain.ports.input import AuthPort
from ....auth.domain.services.auth_service import AuthService
from ....auth.infrastructure.adapters.password_manager_adapter import PasswordManagerAdapter
from ....auth.infrastructure.adapters.token_manager_adapter import TokenManagerAdapter
from ....auth.infrastructure.persistance.adapters.user_repository_adapter import UserRepositoryAdapter


def get_auth_service() -> AuthPort:
    user_repository = UserRepositoryAdapter()
    password_manager = PasswordManagerAdapter()
    token_manager = TokenManagerAdapter()
    return AuthService(user_repository, password_manager, token_manager)
