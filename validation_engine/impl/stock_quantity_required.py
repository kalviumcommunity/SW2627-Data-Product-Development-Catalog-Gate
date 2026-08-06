import pandas as pd
from shared.schemas.rule_result import RuleResult

class RequiredStockQuantityRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        failed = df["stock_quantity"].isna()

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Stock quantity is required."
        )