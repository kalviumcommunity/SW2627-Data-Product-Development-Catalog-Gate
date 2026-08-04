class ValidDownloadFormatRule:
    def validate(self, product):
        fmt = product.get("format")
        download_fmt = product.get("download_format")

        if fmt is not None and str(fmt).strip().lower() == "ebook":
            if download_fmt is None or str(download_fmt).strip() == "":
                return {
                    "passed": False,
                    "message": "Download format must be specified for eBooks (digital books)."
                }

        return {
            "passed": True
        }
