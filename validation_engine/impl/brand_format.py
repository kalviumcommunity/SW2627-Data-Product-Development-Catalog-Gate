import pandas as pd
from shared.schemas.rule_result import RuleResult

class BrandLengthRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        failed = ~df["brand"].fillna("").astype(str).str.fullmatch(r"^.{1,200}$")

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Brand must be between 1 and 200 characters."
        )