product = {
    "sku": "BK-001",
    "title": "The Hobbit",
    "price": 499
}

from registry import rule_registry

required_rules = [{"id": "R001", "description": "SKU column is required"}]
for rule in required_rules:
    rule_id = rule["id"]
    rule_desc = rule["description"]
    rule = rule_registry[rule_id]
    result = rule.validate(product)

    print(f"{rule_desc} result is {result}")    
