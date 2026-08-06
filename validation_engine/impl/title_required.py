import pandas as pd
from shared.schemas.rule_result import RuleResult

class RequiredTitleRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        failed = df["title"].isna() | (df["title"].astype(str).str.strip() == "")

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Title is required."
        )