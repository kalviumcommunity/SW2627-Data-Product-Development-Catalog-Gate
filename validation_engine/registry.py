from impl import brand_format
from impl import currency_format
from impl import sku_required
from impl import title_required
from impl import category_required
from impl import brand_required
from impl import price_required
from impl import price_format
from impl import price_range
from impl import price_precision
from impl import stock_quantity_required
from impl import stock_quantity_data_type
from impl import stock_quantity_range
from impl import stock_quantity_sanity
from impl import title_format
from impl import sku_format
from impl import currency_required

registry = {
   "F1": sku_required.RequiredSkuRule(),
   "F2": sku_format.SKUFormatRule(),
   "F3": title_required.RequiredTitleRule(),
   "F4": title_format.TitleFormatRule(),
   "F5": category_required.RequiredCategoryRule(),
   "F6": brand_required.RequiredBrandRule(),
   "F7": brand_format.BrandLengthRule(),
   "F8": price_required.RequiredPriceRule(),
   "F9": price_format.PriceDataTypeRule(),
   "F10": price_range.PriceRangeRule(),
   "F11": price_precision.PricePrecisionRule(),
   "F12": currency_required.RequiredCurrencyRule(),
   "F13": currency_format.CurrencyFormatRule(),
   "F14": stock_quantity_required.RequiredStockQuantityRule(),
   "F15": stock_quantity_data_type.StockQuantityDataTypeRule(),
   "F16": stock_quantity_range.StockQuantityRangeRule(),
   "F17": stock_quantity_sanity.StockQuantitySanityRule(),
}