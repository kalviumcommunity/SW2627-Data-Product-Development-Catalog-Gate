import pandas as pd
from shared.schemas.rule_result import RuleResult

class RequiredCategoryRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        failed = df["category"].isna() | (df["category"].astype(str).str.strip() == "")

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Category is required."
        )