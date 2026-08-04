import re

class ValidCurrencyRule:
    CURRENCY_PATTERN = re.compile(r'^[a-zA-Z]{3}$')

    def validate(self, product):
        currency = product.get("currency")

        if currency is None or str(currency).strip() == "":
            return {
                "passed": False,
                "message": "Currency must be specified."
            }

        cleaned = str(currency).strip()
        if not self.CURRENCY_PATTERN.match(cleaned):
            return {
                "passed": False,
                "message": f"Currency code '{currency}' is invalid. It must be a 3-letter currency code (e.g. USD, EUR, INR)."
            }

        return {
            "passed": True
        }
