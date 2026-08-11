import pandas as pd

def enforce_types(df: pd.DataFrame) -> pd.DataFrame:
    df_copy = df.copy()
    df_copy["price"] = pd.to_numeric(df_copy["price"], errors="coerce")
    df_copy["stock_quantity"] = pd.to_numeric(df_copy["stock_quantity"], errors="coerce")

    return df_copy