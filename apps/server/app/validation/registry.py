from impl.sku_required import RequiredSkuRule
from impl.title_required import RequiredTitleRule
from impl.isbn_valid import ValidIsbnRule
from impl.category_valid import ValidCategoryRule
from impl.format_valid import ValidFormatRule
from impl.language_valid import ValidLanguageRule
from impl.price_valid import ValidPriceRule
from impl.currency_valid import ValidCurrencyRule
from impl.publication_date_valid import ValidPublicationDateRule
from impl.author_required import RequiredAuthorRule
from impl.publisher_required import RequiredPublisherRule
from impl.image_url_valid import ValidImageUrlRule
from impl.stock_quantity_valid import ValidStockQuantityRule
from impl.download_format_valid import ValidDownloadFormatRule

# Instantiate rule classes
required_sku_rule = RequiredSkuRule()
required_title_rule = RequiredTitleRule()
valid_isbn_rule = ValidIsbnRule()
valid_category_rule = ValidCategoryRule()
valid_format_rule = ValidFormatRule()
valid_language_rule = ValidLanguageRule()
valid_price_rule = ValidPriceRule()
valid_currency_rule = ValidCurrencyRule()
valid_publication_date_rule = ValidPublicationDateRule()
required_author_rule = RequiredAuthorRule()
required_publisher_rule = RequiredPublisherRule()
valid_image_url_rule = ValidImageUrlRule()
valid_stock_quantity_rule = ValidStockQuantityRule()
valid_download_format_rule = ValidDownloadFormatRule()

rule_registry = {
    "SKU_REQUIRED": required_sku_rule,
    "TITLE_REQUIRED": required_title_rule,
    "ISBN_VALID": valid_isbn_rule,
    "CATEGORY_VALID": valid_category_rule,
    "FORMAT_VALID": valid_format_rule,
    "LANGUAGE_VALID": valid_language_rule,
    "PRICE_VALID": valid_price_rule,
    "CURRENCY_VALID": valid_currency_rule,
    "PUBLICATION_DATE_VALID": valid_publication_date_rule,
    "AUTHOR_REQUIRED": required_author_rule,
    "PUBLISHER_REQUIRED": required_publisher_rule,
    "IMAGE_URL_VALID": valid_image_url_rule,
    "STOCK_QUANTITY_VALID": valid_stock_quantity_rule,
    "DOWNLOAD_FORMAT_VALID": valid_download_format_rule,
}