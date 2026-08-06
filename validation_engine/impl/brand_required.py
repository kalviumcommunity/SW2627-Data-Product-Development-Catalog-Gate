import pandas as pd
from shared.schemas.rule_result import RuleResult

class RequiredBrandRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        failed = df["brand"].isna() | (df["brand"].astype(str).str.strip() == "")

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Brand is required."
        )