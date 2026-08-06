import pandas as pd
from shared.schemas.rule_result import RuleResult

class StockQuantitySanityRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        qty = pd.to_numeric(df["stock_quantity"], errors="coerce")
        failed = qty > 999_999_999

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Stock quantity must not exceed 999,999,999."
        )