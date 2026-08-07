# CatalogGate

CatalogGate is a data quality validation engine for marketplace catalogs. It validates vendor product submissions before they are published, detects data quality issues, and generates actionable validation reports so incorrect catalog data never reaches customers.

## Features

- Field-level validation
- Cross-field validation
- Dataset-level validation
- Configurable validation rules
- Detailed validation reports
- Extensible validation engine for new product categories

## Project Structure

```
.
├── ingestion/          # Dataset loading and profiling
├── validation_engine/  # Validation rule execution
├── shared/schemas/          # Shared data models
├── main.py             # Entry point
├── requirements.txt
└── test.csv            # Sample dataset
```

## Prerequisites

- Python 3.11+
- pip

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/kalviumcommunity/SW2627-Data-Product-Development-Catalog-Gate.git
cd SW2627-Data-Product-Development-Catalog-Gate
```

### 2. Create a virtual environment

Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

## Running the Project

Validate a catalog file:

```bash
python main.py test.csv
```

Replace `test.csv` with the path to your own catalog.

Example:

```bash
python main.py data/vendor_catalog.csv
```

## Sample Output

```
✓ SKU is required.
✓ SKU must be 1-64 characters and match ^[A-Za-z0-9_-]+$.
✓ Title is required.
...
```

Validation results include:

- Passed validations
- Failed validations
- Affected rows
- Human-readable error messages



