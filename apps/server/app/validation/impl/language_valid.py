import re

class ValidLanguageRule:
    ISO_CODE_PATTERN = re.compile(r'^[a-zA-Z]{2,3}$')

    def validate(self, product):
        language = product.get("language")

        if language is None or str(language).strip() == "":
            return {
                "passed": False,
                "message": "Language must be specified."
            }

        cleaned = str(language).strip()
        if not self.ISO_CODE_PATTERN.match(cleaned):
            return {
                "passed": False,
                "message": f"Language code '{language}' is invalid. It must be a valid 2 or 3 letter ISO language code."
            }

        return {
            "passed": True
        }
