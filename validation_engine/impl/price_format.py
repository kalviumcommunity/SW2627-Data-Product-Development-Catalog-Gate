import pandas as pd
from shared.schemas.rule_result import RuleResult

class PriceDataTypeRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        price = pd.to_numeric(df["price"], errors="coerce")
        failed = price.isna()

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Price must be a decimal number."
        )