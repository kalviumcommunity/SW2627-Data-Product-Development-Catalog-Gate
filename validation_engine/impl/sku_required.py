import pandas as pd
from shared.schemas.rule_result import RuleResult

class RequiredSkuRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        failed = df["sku"].isna() | (df["sku"].astype(str).str.strip() == "")

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="SKU is required."
        )