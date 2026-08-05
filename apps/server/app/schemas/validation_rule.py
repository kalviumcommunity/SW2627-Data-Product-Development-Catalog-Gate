from pydantic import BaseModel, Field
from uuid import UUID
from enum import Enum

class Severity(Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    BLOCK = "BLOCK"

class ValidationRule(BaseModel):
    id: UUID
    key: str = Field(..., min_length=3, max_length=50, pattern=r"^[A-Z][A-Z0-9_]*$")
    description: str = Field(..., min_length=1, max_length=255)
    severity: Severity
