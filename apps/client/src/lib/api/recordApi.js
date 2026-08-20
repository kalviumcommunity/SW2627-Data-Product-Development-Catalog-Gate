import { getCatalogUploadById } from "./catalogApi";
import { getUserById } from "./usersApi";
import { getTenantById } from "./tenantApi";

export async function getRecord(table, id) {
  switch (table) {
    case "catalog_uploads":
      return getCatalogUploadById(id);

    case "users":
      return getUserById(id);

    case "tenants":
      return getTenantById(id);

    default:
      throw new Error(`Unsupported table: ${table}`);
  }
}