from validation_engine.providers.fs_metadata.main import FSMetadataProvider

def main():
    provider = FSMetadataProvider()
    rules = provider.get_rules()
    print(rules)

if __name__ == '__main__':
    main()