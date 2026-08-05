class RequiredTitleRule:
    def validate(self, product):
        title = product.get("title")

        if title is None or str(title).strip() == "":
            return {
                "passed": False,
                "message": "Title is required."
            }

        return {
            "passed": True
        }
