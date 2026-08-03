class RequiredSkuRule:
    def validate(self, product):
        sku = product.get("sku")

        if sku is None or str(sku).strip() == "":
            return {
                "passed": False,
                "message": "SKU is required."
            }

        return {
            "passed": True
        }