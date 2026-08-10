from pydantic import BaseModel

class ColumnProfile(BaseModel):
    name: str
    dtype: str

    null_count: int
    null_percentage: float

    unique_count: int


class NumericalProfile(BaseModel):
    min: float | None
    max: float | None
    mean: float | None
    median: float | None


class Profile(BaseModel):
    row_count: int
    column_count: int

    duplicate_count: int
    duplicate_percentage: float

    columns: list[ColumnProfile]
    numerical: dict[str, NumericalProfile]