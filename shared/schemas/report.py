from datetime import datetime
from pydantic import BaseModel

from shared.schemas.rule_result_metadata import RuleResultMetadata
from shared.schemas.profile import Profile

class Report(BaseModel):
    # generated at
    generated_at: datetime
    # data profiling results
    profile: Profile

    # validation results
    total_rules: int
    total_failed_rules: int

    blocked: list[RuleResultMetadata]
    warning: list[RuleResultMetadata]
    

