from uuid import UUID
from pydantic import BaseModel, EmailStr, Field
from app.schemas.user import UserRole

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(
        ...,
        min_length=8,
        max_length=15
    )
    tenant_id: UUID
    role: UserRole
    name: str = Field(
        ...,
        min_length=2,
        max_length=30
    )
    phone: str | None = Field(
        default=None,
        max_length=10
    )

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str