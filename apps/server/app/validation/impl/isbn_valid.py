import re

class ValidIsbnRule:
    def validate(self, product):
        isbn = product.get("isbn")

        if isbn is None or str(isbn).strip() == "":
            return {
                "passed": False,
                "message": "ISBN is required."
            }

        # Clean spaces and hyphens
        cleaned = re.sub(r'[-\s]', '', str(isbn))

        if len(cleaned) == 10:
            # Check ISBN-10 format
            if not re.match(r'^\d{9}[\dXdx]$', cleaned):
                return {
                    "passed": False,
                    "message": "ISBN-10 format is invalid."
                }
            # Checksum
            total = 0
            for i in range(9):
                total += int(cleaned[i]) * (10 - i)
            last_char = cleaned[9].upper()
            total += 10 if last_char == 'X' else int(last_char)
            if total % 11 != 0:
                return {
                    "passed": False,
                    "message": "ISBN-10 checksum is invalid."
                }
        elif len(cleaned) == 13:
            # Check ISBN-13 format
            if not re.match(r'^\d{13}$', cleaned):
                return {
                    "passed": False,
                    "message": "ISBN-13 format is invalid."
                }
            # Checksum
            total = 0
            for i in range(13):
                total += int(cleaned[i]) * (1 if i % 2 == 0 else 3)
            if total % 10 != 0:
                return {
                    "passed": False,
                    "message": "ISBN-13 checksum is invalid."
                }
        else:
            return {
                "passed": False,
                "message": "ISBN must be either 10 or 13 characters long."
            }

        return {
            "passed": True
        }
