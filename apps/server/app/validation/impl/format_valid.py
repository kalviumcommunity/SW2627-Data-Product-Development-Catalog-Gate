class ValidFormatRule:
    SUPPORTED_FORMATS = {"paperback", "hardcover", "ebook", "audiobook"}

    def validate(self, product):
        fmt = product.get("format")

        if fmt is None or str(fmt).strip() == "":
            return {
                "passed": False,
                "message": "Format must be specified."
            }

        cleaned_fmt = str(fmt).strip().lower()
        if cleaned_fmt not in self.SUPPORTED_FORMATS:
            return {
                "passed": False,
                "message": f"Format '{fmt}' is not supported. Supported formats are: Paperback, Hardcover, eBook, Audiobook."
            }

        return {
            "passed": True
        }
