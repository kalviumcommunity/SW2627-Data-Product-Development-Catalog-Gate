insert into validation_rules (key, description, severity)
values
    ('TITLE_REQUIRED', 'Product title must be present.', 'BLOCK'),
    ('ISBN_VALID', 'ISBN must be present and conform to a valid ISBN format.', 'BLOCK'),
    ('CATEGORY_VALID', 'Category must be specified.', 'BLOCK'),
    ('FORMAT_VALID', 'Format must be one of the supported book formats.', 'BLOCK'),
    ('LANGUAGE_VALID', 'Language must be specified using a supported language code.', 'BLOCK'),
    ('PRICE_VALID', 'Price must be greater than zero.', 'BLOCK'),
    ('CURRENCY_VALID', 'Currency must be specified.', 'BLOCK'),
    ('PUBLICATION_DATE_VALID', 'Publication date must be a valid date.', 'BLOCK'),
    ('AUTHOR_REQUIRED', 'Author must be specified.', 'BLOCK'),
    ('PUBLISHER_REQUIRED', 'Publisher must be specified.', 'BLOCK'),
    ('IMAGE_URL_VALID', 'Image URL must be a valid URL.', 'BLOCK'),
    ('STOCK_QUANTITY_VALID', 'Stock quantity cannot be negative.', 'BLOCK'),
    ('DOWNLOAD_FORMAT_VALID', 'Download format must be specified for digital books.', 'BLOCK');
