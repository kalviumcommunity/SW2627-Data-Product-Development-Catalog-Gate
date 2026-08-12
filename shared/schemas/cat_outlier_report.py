from pydantic import BaseModel

class Outlier(BaseModel):
    sku: str
    value: float
    upper_bound: float
    lower_bound: float

class CategoryOutlierReport(BaseModel):
    category: str
    column: str
    outliers: list[Outlier]