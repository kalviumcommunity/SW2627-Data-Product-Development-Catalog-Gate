import pandas as pd

from shared.schemas.rule_result import RuleResult


class CategoryLengthRule:
    def validate(self, df: pd.DataFrame) -> RuleResult:
        category = df["category"].fillna("").astype(str).str.strip()

        failed = (category != "") & (
            (category.str.len() < 1) | (category.str.len() > 200)
        )

        return RuleResult(
            passed=not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Category must be between 1 and 200 characters."
        )