class ValidStockQuantityRule:
    def validate(self, product):
        stock = product.get("stock_quantity")

        if stock is None:
            return {
                "passed": False,
                "message": "Stock quantity must be specified."
            }

        try:
            val = int(stock)
        except (ValueError, TypeError):
            return {
                "passed": False,
                "message": f"Stock quantity '{stock}' is not a valid integer."
            }

        if val < 0:
            return {
                "passed": False,
                "message": "Stock quantity cannot be negative."
            }

        return {
            "passed": True
        }
