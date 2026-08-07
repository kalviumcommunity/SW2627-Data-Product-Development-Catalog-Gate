from pydantic import BaseModel

from shared.schemas.validation_rule import ValidationRule
from shared.schemas.rule_result import RuleResult

class RuleResultMetadata(BaseModel):
    rule: ValidationRule
    result: RuleResult