class RequiredPublisherRule:
    def validate(self, product):
        publisher = product.get("publisher")

        if publisher is None or str(publisher).strip() == "":
            return {
                "passed": False,
                "message": "Publisher must be specified."
            }

        return {
            "passed": True
        }
