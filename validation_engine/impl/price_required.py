import pandas as pd
from shared.schemas.rule_result import RuleResult

class RequiredPriceRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        failed = df["price"].isna()

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Price is required."
        )