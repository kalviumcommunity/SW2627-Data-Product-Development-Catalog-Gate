# **Books Category — Catalog Validation Rules (V1)**

**Severity Legend**  
BLOCK: Product cannot be ingested.  
WARN: Product is ingested but flagged for review.  
INFO: Informational only.

## **Field Rules**

| Rule/Condition | Description/Requirement | Severity |
| :---- | :---- | :---- |
| SKU Required | Every product must have a unique SKU identifier. | BLOCK |
| Title Required | Product title must be present. | BLOCK |
| ISBN Valid | ISBN must be present and conform to a valid ISBN format. | BLOCK |
| Category Valid | Category must be specified. | BLOCK |
| Format Valid | Format must be one of the supported book formats. | BLOCK |
| Language Valid | Language must be specified using a supported language code. | BLOCK |
| Price Valid | Price must be greater than zero. | BLOCK |
| Currency Valid | Currency must be specified. | BLOCK |
| Publication Date Valid | Publication date must be a valid date. | BLOCK |
| Author Required | Author must be specified. | BLOCK |
| Publisher Required | Publisher must be specified. | BLOCK |
| Image URL Valid | Image URL must be a valid URL. | BLOCK |
| Stock Quantity Valid | Stock quantity cannot be negative. | BLOCK |
| Download Format Valid | Download format must be specified for digital books. | BLOCK |

## **Cross-Field Rules**

| Rule/Condition | Description/Requirement | Severity |
| :---- | :---- | :---- |
| Sale Price ≤ Price | Sale price cannot exceed selling price. | BLOCK |
| MRP ≥ Selling Price | MRP cannot be less than the selling price. | BLOCK |
| Publication Date Not Future | Publication date cannot be in the future. | BLOCK |
| Shipping Information Complete | Physical books must include shipping attributes. | BLOCK |
| Digital Books Have No Shipping | eBooks should not contain physical shipping information. | WARN |

## **Conditional Rules (Books)**

| Rule/Condition | Description/Requirement | Severity |
| :---- | :---- | :---- |
| Category \= Books | ISBN is mandatory. | BLOCK |
| Category \= Books | Author is mandatory. | BLOCK |
| Category \= Books | Publisher is mandatory. | BLOCK |
| Category \= Books | Language is mandatory. | BLOCK |
| Category \= Books | Format is mandatory. | BLOCK |
| Format \= Paperback | Paperback price and stock must be provided. | BLOCK |
| Format \= Hardcover | Hardcover price and stock must be provided. | BLOCK |
| Format \= eBook | Download format must be specified. | BLOCK |
| Age Group \= Children | Recommended age must be provided. | BLOCK |

## **Dataset Rules**

| Rule/Condition | Description/Requirement | Severity |
| :---- | :---- | :---- |
| SKU Unique | SKU must be unique within the uploaded catalog. | BLOCK |
| Product Identifier Unique | Product identifier must not be duplicated. | BLOCK |
| ISBN Unique | ISBN must not be duplicated within the catalog. | BLOCK |
| Parent SKU Exists | Variant products must reference an existing parent SKU. | BLOCK |
| No Circular References | Variant relationships must not form cycles. | BLOCK |

## **Workflow Rules**

| Rule/Condition | Description/Requirement | Severity |
| :---- | :---- | :---- |
| Supported File Format | Upload must use a supported file format. | BLOCK |
| Maximum File Size | File must not exceed the configured size limit. | BLOCK |
| Maximum Row Count | Upload must not exceed the configured row limit. | BLOCK |
| Required Columns Present | Required columns must exist in the uploaded file. | BLOCK |
| No Duplicate Headers | Column names must be unique. | BLOCK |
| Supported File Encoding | File encoding must be supported. | BLOCK |

## **External Rules**

| Rule/Condition | Description/Requirement | Severity |
| :---- | :---- | :---- |
| Category Exists | Category must exist in the tenant's catalog. | BLOCK |
| Publisher Registered | Publisher must exist in the tenant's master data. | WARN |
| Currency Supported | Currency must be supported by the tenant. | BLOCK |
| Tax Code Valid | Tax code must exist in the tenant's master data. | BLOCK |
| Image Accessible | Product image must be reachable. | WARN |
| Supplier Exists | Supplier must exist in the tenant's master data. | BLOCK |
| Warehouse Exists | Warehouse must exist in the tenant's master data. | BLOCK |

## **Historical Rules (V2)**

| Rule/Condition | Description/Requirement | Severity |
| :---- | :---- | :---- |
| Significant Price Change | Detect unusually large price changes compared to previous uploads. | V2 |
| Inventory Anomaly | Detect sudden spikes or drops in inventory. | V2 |
| Product Attribute Drift | Detect unexpected changes in product metadata. | V2 |
| Potential Duplicate Products | Identify likely duplicate products using similarity analysis. | V2 |
| Catalog Regression Detection | Detect products that were previously valid but have become invalid. | V2 |

