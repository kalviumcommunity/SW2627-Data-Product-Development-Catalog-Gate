from urllib.parse import urlparse

class ValidImageUrlRule:
    def validate(self, product):
        image_url = product.get("image_url")

        if image_url is None or str(image_url).strip() == "":
            return {
                "passed": False,
                "message": "Image URL must be specified."
            }

        url_str = str(image_url).strip()
        try:
            result = urlparse(url_str)
            if not result.scheme or result.scheme.lower() not in ("http", "https"):
                return {
                    "passed": False,
                    "message": f"Image URL '{image_url}' is invalid. It must use HTTP or HTTPS scheme."
                }
            if not result.netloc:
                return {
                    "passed": False,
                    "message": f"Image URL '{image_url}' is missing a valid domain name."
                }
        except Exception:
            return {
                "passed": False,
                "message": f"Image URL '{image_url}' is not a valid URL format."
            }

        return {
            "passed": True
        }
