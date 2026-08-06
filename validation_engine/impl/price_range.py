import pandas as pd
from shared.schemas.rule_result import RuleResult

class PriceRangeRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        price = pd.to_numeric(df["price"], errors="coerce")
        failed = (price <= 0) | (price > 9_999_999.99)

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Price must be between 0.01 and 9,999,999.99."
        )