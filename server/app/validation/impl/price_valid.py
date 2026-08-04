class ValidPriceRule:
    def validate(self, product):
        price = product.get("price")

        if price is None:
            return {
                "passed": False,
                "message": "Price must be specified."
            }

        try:
            val = float(price)
        except (ValueError, TypeError):
            return {
                "passed": False,
                "message": f"Price '{price}' is not a valid number."
            }

        if val <= 0:
            return {
                "passed": False,
                "message": "Price must be greater than zero."
            }

        return {
            "passed": True
        }
