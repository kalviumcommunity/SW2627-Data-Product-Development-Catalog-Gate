# ^[^\x00-\x1F\x7F]{1,500}$

import pandas as pd
from shared.schemas.rule_result import RuleResult

class TitleFormatRule:
    PATTERN = r"^[^\x00-\x1F\x7F]{1,500}$"
    
    def validate(self, df: pd.DataFrame) -> RuleResult:
        # Replacing na with empty string before checking the format
        # We do not want chain failing
        title = df["title"].fillna("").astype(str)

        failed = ~title.str.fullmatch(self.PATTERN)

        return RuleResult(
            passed= not failed.any(),
            failed_rows=df.index[failed].tolist(),
            message="Title must be 1-500 characters and contain no control characters."
        )