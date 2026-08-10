from shared.schemas.dataset import Dataset
from shared.schemas.rule_result import RuleResult
from shared.schemas.rule_result_metadata import RuleResultMetadata

from validation_engine.providers.fs_metadata.main import FSMetadataProvider
from validation_engine.registry import registry

class ValidationEngine:
    provider = FSMetadataProvider()

    def validate(self, dataset: Dataset) -> list[RuleResultMetadata]:
        rules = self.provider.get_rules()
        rules = [rule for rule in rules if rule.key.startswith("F")]
        results: list[RuleResultMetadata] = []
        df = dataset.dataframe
        for rule in rules:
            rule_impl = registry[rule.key] 
            rule_result = rule_impl.validate(df)
            rule_result_metadata = RuleResultMetadata(
                rule=rule,
                result=rule_result
            )
            results.append(rule_result_metadata)
            
        return results
