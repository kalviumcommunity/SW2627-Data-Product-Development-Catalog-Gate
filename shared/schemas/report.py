from datetime import datetime
from pydantic import BaseModel, Field

from shared.schemas.rule_result_metadata import RuleResultMetadata
from shared.schemas.profile import Profile

class Report(BaseModel):
    # generated at
    generated_at: datetime

    filepath: str | None = None
    ext: str | None = None
    encoding: str | None = None

    profile: Profile | None = None

    total_rules: int = 0
    total_failed_rules: int = 0

    blocked: list[RuleResultMetadata] = Field(default_factory=list)
    warning: list[RuleResultMetadata] = Field(default_factory=list)

    # only for pipeline errors, empty otherwise
    errors: list[str] = Field(default_factory=list)