import pandas as pd
from shared.schemas.rule_result import RuleResult

class CurrencyFormatRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        failed = ~df["currency"].fillna("").astype(str).str.fullmatch(r"^[A-Z]{3}$")

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Currency must be a valid ISO 4217 code."
        )