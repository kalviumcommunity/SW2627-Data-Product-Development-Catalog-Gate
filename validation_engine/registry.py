from validation_engine.impl import brand_format
from validation_engine.impl import brand_required
from validation_engine.impl import category_length
from validation_engine.impl import category_required
from validation_engine.impl import currency_format
from validation_engine.impl import currency_required
from validation_engine.impl import price_format
from validation_engine.impl import price_precision
from validation_engine.impl import price_range
from validation_engine.impl import price_required
from validation_engine.impl import sku_format
from validation_engine.impl import sku_required
from validation_engine.impl import stock_quantity_data_type
from validation_engine.impl import stock_quantity_range
from validation_engine.impl import stock_quantity_required
from validation_engine.impl import stock_quantity_sanity
from validation_engine.impl import title_format
from validation_engine.impl import title_required

registry = {
    "F1": sku_required.RequiredSkuRule(),
    "F2": sku_format.SKUFormatRule(),
    "F3": title_required.RequiredTitleRule(),
    "F4": title_format.TitleFormatRule(),
    "F5": category_required.RequiredCategoryRule(),
    "F6": category_length.CategoryLengthRule(),
    "F7": brand_required.RequiredBrandRule(),
    "F8": brand_format.BrandLengthRule(),
    "F9": price_required.RequiredPriceRule(),
    "F10": price_format.PriceDataTypeRule(),
    "F11": price_range.PriceRangeRule(),
    "F12": price_precision.PricePrecisionRule(),
    "F13": currency_required.RequiredCurrencyRule(),
    "F14": currency_format.CurrencyFormatRule(),
    "F15": stock_quantity_required.RequiredStockQuantityRule(),
    "F16": stock_quantity_data_type.StockQuantityDataTypeRule(),
    "F17": stock_quantity_range.StockQuantityRangeRule(),
    "F18": stock_quantity_sanity.StockQuantitySanityRule(),
}