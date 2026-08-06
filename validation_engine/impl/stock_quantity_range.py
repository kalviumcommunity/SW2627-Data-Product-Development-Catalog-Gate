import pandas as pd
from shared.schemas.rule_result import RuleResult

class StockQuantityRangeRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        qty = pd.to_numeric(df["stock_quantity"], errors="coerce")
        failed = qty < 0

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Stock quantity must be greater than or equal to 0."
        )