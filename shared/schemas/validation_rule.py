from pydantic import BaseModel, Field

from .severity import Severity

class ValidationRule(BaseModel):
    key: str = Field(..., min_length=2, max_length=50, pattern=r"^[A-Z][A-Z0-9_]*$")
    description: str = Field(..., min_length=1, max_length=255)
    severity: Severity
