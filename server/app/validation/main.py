product = {
    "sku": "BK-001",
    "title": "The Hobbit",
    "price": 499
}

from registry import rule_registry

required_rules = [{"key": "SKU_REQUIRED", "description": "SKU column is required"}]

for rule_info in required_rules:
    rule_key = rule_info["key"]
    rule_desc = rule_info["description"]
    rule = rule_registry[rule_key]
    result = rule.validate(product)

    print(f"{rule_desc} result is {result}")    
