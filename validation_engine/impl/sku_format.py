import pandas as pd
from shared.schemas.rule_result import RuleResult

class SKUFormatRule:
    PATTERN = r"^[A-Za-z0-9_-]{1,64}$"
    
    def validate(self, df: pd.DataFrame) -> RuleResult:
        # Replacing na with empty string before checking the format
        # We do not want chain failing
        sku = df["sku"].fillna("").astype(str)

        failed = ~sku.str.fullmatch(self.PATTERN)

        return RuleResult(
            passed= not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="SKU must be 1-64 characters and match ^[A-Za-z0-9_-]+$."
        )