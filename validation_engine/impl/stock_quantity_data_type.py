import pandas as pd
from shared.schemas.rule_result import RuleResult

class StockQuantityDataTypeRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        qty = pd.to_numeric(df["stock_quantity"], errors="coerce")
        failed = qty.isna() | (qty % 1 != 0)

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Stock quantity must be an integer."
        )