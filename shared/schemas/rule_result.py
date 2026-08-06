from pydantic import BaseModel

class RuleResult(BaseModel):
    passed: bool
    failed_rows: list[int] # contains the row numbers for the failed rows. We can use to later fetch failed rows from the dataset.
    message: str