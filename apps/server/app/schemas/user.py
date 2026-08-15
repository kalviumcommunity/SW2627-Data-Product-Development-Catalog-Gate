from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UserRole(str, Enum):
    vendor = "vendor"
    catalog_admin = "catalog_admin"
    super_admin = "super_admin"

class UserProfileCreate(BaseModel):
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

class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    tenant_id: UUID
    role: UserRole
    name: str
    phone: str | None = None

class CurrentUser(BaseModel):
    id: UUID
    tenant_id: UUID
    role: UserRole
    access_token: str