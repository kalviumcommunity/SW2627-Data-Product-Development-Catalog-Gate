from shared.schemas.validation_rule import ValidationRule

from pathlib import Path
import json

class FSMetadataProvider:
    def get_rules(self) -> list[ValidationRule]:
        path = Path(__file__).parent / "metadata.json"
        
        with open(path, 'r') as f:
            data = json.load(f)

        rules = []
        for rule in data:
            rules.append(ValidationRule(
                key=rule["key"],
                description=rule["description"],
                severity=rule["severity"]
            ))

        return rules