import pandas as pd
from pydantic import BaseModel

class Dataset(BaseModel):
    dataframe: pd.DataFrame
    filepath: str