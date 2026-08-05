from datetime import datetime, date

class ValidPublicationDateRule:
    def validate(self, product):
        pub_date = product.get("publication_date")

        if pub_date is None:
            return {
                "passed": False,
                "message": "Publication date must be specified."
            }

        if isinstance(pub_date, (date, datetime)):
            return {
                "passed": True
            }

        date_str = str(pub_date).strip()
        if date_str == "":
            return {
                "passed": False,
                "message": "Publication date must be specified."
            }

        formats = [
            "%Y-%m-%d",
            "%Y/%m/%d",
            "%d-%m-%Y",
            "%d/%m/%Y",
            "%b %d, %Y",
            "%B %d, %Y"
        ]

        for fmt in formats:
            try:
                datetime.strptime(date_str, fmt)
                return {
                    "passed": True
                }
            except ValueError:
                continue

        try:
            date.fromisoformat(date_str)
            return {
                "passed": True
            }
        except ValueError:
            pass

        return {
            "passed": False,
            "message": f"Publication date '{pub_date}' is not a valid date format. Use YYYY-MM-DD."
        }
