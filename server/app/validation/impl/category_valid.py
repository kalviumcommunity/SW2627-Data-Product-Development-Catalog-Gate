class ValidCategoryRule:
    def validate(self, product):
        category = product.get("category")

        if category is None or str(category).strip() == "":
            return {
                "passed": False,
                "message": "Category must be specified."
            }

        return {
            "passed": True
        }
