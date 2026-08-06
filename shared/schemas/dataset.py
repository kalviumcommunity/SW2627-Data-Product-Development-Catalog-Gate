from pydantic import BaseModel, ConfigDict
import pandas as pd

class Dataset(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    dataframe: pd.DataFrame
    filepath: str