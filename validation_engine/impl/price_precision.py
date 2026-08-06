import pandas as pd
from shared.schemas.rule_result import RuleResult

class PricePrecisionRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        failed = (
            df["price"]
            .astype(str)
            .str.extract(r"\.(\d+)$")[0]
            .fillna("")
            .str.len() > 2
        )

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Price must not exceed two decimal places."
        )