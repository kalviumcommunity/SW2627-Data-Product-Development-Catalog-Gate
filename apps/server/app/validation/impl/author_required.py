class RequiredAuthorRule:
    def validate(self, product):
        author = product.get("author")

        if author is None or str(author).strip() == "":
            return {
                "passed": False,
                "message": "Author must be specified."
            }

        return {
            "passed": True
        }
