from pydantic import BaseModel, ConfigDict
import pandas as pd

from shared.schemas.profile import Profile

class ProfiledDataset(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    dataframe: pd.DataFrame
    filepath: str

    profile: Profile
