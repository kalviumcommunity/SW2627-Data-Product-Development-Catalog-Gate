import pandas as pd

def normalize_strings(df: pd.DataFrame, 
                    columns: list[str], 
                    lowercase=True, 
                    strip=True, 
                    remove_special=False,
                    mapping=None):
    """Reusable text cleaning function."""
    result = df.copy()
    
    for column in columns:
        if strip:
            result[column] = result[column].str.strip()
        
        if lowercase:
            result[column] = result[column].str.lower()
        
        if remove_special:
            result[column] = result[column].replace('[^a-zA-Z0-9 ]', '', regex=True)
    
    if mapping:
        result[column] = result[column].map(mapping)
    
    return result
