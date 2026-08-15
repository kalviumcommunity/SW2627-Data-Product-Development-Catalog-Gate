# RLS Table-Level Policies

| Data                                  | Role            |                         SELECT |          INSERT |                        UPDATE |                        DELETE |
| ------------------------------------- | --------------- | -----------------------------: | --------------: | ----------------------------: | ----------------------------: |
| `tenants`                             | `vendor`        |                     Own tenant |               ❌ |                             ❌ |                             ❌ |
| `tenants`                             | `catalog_admin` |                     Own tenant |               ❌ |                             ❌ |                             ❌ |
| `tenants`                             | `super_admin`   |                **All tenants** |         **All** |                       **All** |                       **All** |
| `users`                               | `vendor`        |                       Own user |               ❌ |                  **Own user** |                             ❌ |
| `users`                               | `catalog_admin` |    **All users in own tenant** |               ❌ |   **All users in own tenant** |                             ❌ |
| `users`                               | `super_admin`   |                  **All users** |         **All** |                       **All** |                       **All** |
| `catalog_uploads`                     | `vendor`        |                **Own uploads** | **Own uploads** |                             ❌ |                             ❌ |
| `catalog_uploads`                     | `catalog_admin` |  **All uploads in own tenant** |               ❌ | **All uploads in own tenant** | **All uploads in own tenant** |
| `catalog_uploads`                     | `super_admin`   |                **All uploads** |         **All** |                       **All** |                       **All** |
| `reports`                             | `vendor`        |                **Own reports** |               ❌ |                             ❌ |                             ❌ |
| `reports`                             | `catalog_admin` |  **All reports in own tenant** |               ❌ |                             ❌ |                             ❌ |
| `reports`                             | `super_admin`   |                **All reports** |               ❌ |                             ❌ |                             ❌ |
| `dataset_profiles`                    | `vendor`        |        **Own report profiles** |               ❌ |                             ❌ |                             ❌ |
| `dataset_profiles`                    | `catalog_admin` | **All profiles in own tenant** |               ❌ |                             ❌ |                             ❌ |
| `dataset_profiles`                    | `super_admin`   |               **All profiles** |               ❌ |                             ❌ |                             ❌ |
| `storage.objects` (`catalog-uploads`) | `vendor`        |                  **Own files** |   **Own files** |                             ❌ |                             ❌ |
| `storage.objects` (`catalog-uploads`) | `catalog_admin` |    **All files in own tenant** |               ❌ |   **All files in own tenant** |   **All files in own tenant** |
| `storage.objects` (`catalog-uploads`) | `super_admin`   |                  **All files** |         **All** |                       **All** |                       **All** |


# 