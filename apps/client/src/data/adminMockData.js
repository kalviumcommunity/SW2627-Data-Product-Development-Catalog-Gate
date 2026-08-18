// Mock data aligned with Supabase DB Migrations (tenants, users, catalog_uploads)

export const TENANTS_DATA = [
  {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0001",
    name: "Tia Supplies Enterprise",
    code: "TIA_SUPPLIES",
    created_at: "2024-01-15 08:30:00"
  },
  {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0002",
    name: "Stellar Logistics Corp",
    code: "STELLAR_LOG",
    created_at: "2024-02-01 10:15:00"
  },
  {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0003",
    name: "Apex Supply Co.",
    code: "APEX_SUPPLY",
    created_at: "2024-03-10 14:20:00"
  },
  {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0004",
    name: "Lumina Global Distribution",
    code: "LUMINA_GLOBAL",
    created_at: "2024-04-05 11:45:00"
  },
  {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0005",
    name: "Card Depot Retail",
    code: "CARD_DEPOT",
    created_at: "2024-05-12 09:00:00"
  }
];

export const USERS_DATA = [
  {
    id: "e4a2c1b0-1001-4f11-8001-900000000001",
    name: "Alex Rivera",
    email: "alex.rivera@cataloggate.com",
    role: "super_admin",
    phone: "+1 (555) 019-2831",
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0001",
    tenant_code: "TIA_SUPPLIES",
    created_at: "2024-01-10 09:00:00"
  },
  {
    id: "e4a2c1b0-1002-4f11-8002-900000000002",
    name: "Tian Chen",
    email: "tian.chen@tiasupplies.com",
    role: "vendor",
    phone: "+1 (555) 012-3456",
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0001",
    tenant_code: "TIA_SUPPLIES",
    created_at: "2024-01-15 09:15:00"
  },
  {
    id: "e4a2c1b0-1003-4f11-8003-900000000003",
    name: "Sarah Jenkins",
    email: "s.jenkins@stellarlogistics.com",
    role: "catalog_admin",
    phone: "+1 (555) 014-9821",
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0002",
    tenant_code: "STELLAR_LOG",
    created_at: "2024-02-02 11:30:00"
  },
  {
    id: "e4a2c1b0-1004-4f11-8004-900000000004",
    name: "James Carter",
    email: "j.carter@apexsupply.com",
    role: "vendor",
    phone: "+1 (555) 018-7744",
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0003",
    tenant_code: "APEX_SUPPLY",
    created_at: "2024-03-11 16:00:00"
  },
  {
    id: "e4a2c1b0-1005-4f11-8005-900000000005",
    name: "Elena Rostova",
    email: "elena@luminaglobal.com",
    role: "catalog_admin",
    phone: "+1 (555) 013-4411",
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0004",
    tenant_code: "LUMINA_GLOBAL",
    created_at: "2024-04-06 10:20:00"
  },
  {
    id: "e4a2c1b0-1006-4f11-8006-900000000006",
    name: "Marcus Vance",
    email: "m.vance@carddepot.com",
    role: "vendor",
    phone: "+1 (555) 016-2289",
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0005",
    tenant_code: "CARD_DEPOT",
    created_at: "2024-05-13 13:40:00"
  }
];

export const UPLOADS_DATA = [
  {
    id: "f83b9214-9021-4a01-b001-700000090214",
    batch_id: "#BT-90214",
    filepath: "catalogs/2024/Q3/Back_To_School_Stationery_Q3.csv",
    status: "COMPLETED",
    items_count: 12450,
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0001",
    tenant_code: "TIA_SUPPLIES",
    user_id: "e4a2c1b0-1002-4f11-8002-900000000002",
    created_at: "2024-10-24 09:12:00",
    updated_at: "2024-10-24 09:15:00"
  },
  {
    id: "f83b9213-9021-3a01-b001-700000090213",
    batch_id: "#BT-90213",
    filepath: "catalogs/2024/Q3/Office_Notebooks_Premium_v2.xlsx",
    status: "PROCESSING",
    items_count: 4821,
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0002",
    tenant_code: "STELLAR_LOG",
    user_id: "e4a2c1b0-1003-4f11-8003-900000000003",
    created_at: "2024-10-23 16:45:00",
    updated_at: "2024-10-23 16:46:00"
  },
  {
    id: "f83b9208-9020-8a01-b001-700000090208",
    batch_id: "#BT-90208",
    filepath: "catalogs/2024/Q3/Drawing_Art_Supplies_Catalog.xlsx",
    status: "FAILED",
    items_count: 850,
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0003",
    tenant_code: "APEX_SUPPLY",
    user_id: "e4a2c1b0-1004-4f11-8004-900000000004",
    created_at: "2024-10-22 11:30:00",
    updated_at: "2024-10-22 11:32:00"
  },
  {
    id: "f83b9195-9019-5a01-b001-700000090195",
    batch_id: "#BT-90195",
    filepath: "catalogs/2024/Q3/Corporate_Stationery_Wholesale.csv",
    status: "COMPLETED",
    items_count: 45100,
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0004",
    tenant_code: "LUMINA_GLOBAL",
    user_id: "e4a2c1b0-1005-4f11-8005-900000000005",
    created_at: "2024-10-21 14:20:00",
    updated_at: "2024-10-21 14:24:00"
  },
  {
    id: "f83b9188-9018-8a01-b001-700000090188",
    batch_id: "#BT-90188",
    filepath: "catalogs/2024/Q3/Bulk_Writing_Instruments_Catalog.csv",
    status: "COMPLETED",
    items_count: 2340,
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0001",
    tenant_code: "TIA_SUPPLIES",
    user_id: "e4a2c1b0-1002-4f11-8002-900000000002",
    created_at: "2024-10-18 10:05:00",
    updated_at: "2024-10-18 10:07:00"
  },
  {
    id: "f83b9182-9018-2a01-b001-700000090182",
    batch_id: "#BT-90182",
    filepath: "catalogs/2024/Q3/Craft_Supplies_Fall_2024.xlsx",
    status: "PENDING",
    items_count: 8900,
    tenant_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0005",
    tenant_code: "CARD_DEPOT",
    user_id: "e4a2c1b0-1006-4f11-8006-900000000006",
    created_at: "2024-10-15 15:22:00",
    updated_at: "2024-10-15 15:22:00"
  }
];

// Field definitions for ServiceNow-style Filter Component per Table
export const TABLE_SCHEMAS = {
  users: {
    label: "Users",
    fields: [
      { value: "name", label: "Name", type: "text" },
      { value: "email", label: "Email", type: "text" },
      {
        value: "role",
        label: "Role",
        type: "select",
        options: [
          { value: "super_admin", label: "super_admin" },
          { value: "catalog_admin", label: "catalog_admin" },
          { value: "vendor", label: "vendor" }
        ]
      },
      { value: "phone", label: "Phone", type: "text" },
      { value: "tenant_code", label: "Tenant Code", type: "text" }
    ],
    columns: [
      { key: "id", label: "User ID", isId: true },
      { key: "name", label: "Name", isPrimary: true },
      { key: "email", label: "Email" },
      { key: "role", label: "Role", isBadge: true },
      { key: "phone", label: "Phone" },
      { key: "tenant_code", label: "Tenant Code", isCode: true },
      { key: "created_at", label: "Created At", isDate: true }
    ]
  },
  tenants: {
    label: "Tenants",
    fields: [
      { value: "name", label: "Tenant Name", type: "text" },
      { value: "code", label: "Tenant Code", type: "text" }
    ],
    columns: [
      { key: "id", label: "Tenant ID", isId: true },
      { key: "name", label: "Tenant Name", isPrimary: true },
      { key: "code", label: "Tenant Code", isCode: true },
      { key: "created_at", label: "Created At", isDate: true }
    ]
  },
  uploads: {
    label: "Uploads",
    fields: [
      { value: "id", label: "Upload ID", type: "text" },
      { value: "filepath", label: "File Path", type: "text" },
      {
        value: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "COMPLETED", label: "COMPLETED" },
          { value: "PROCESSING", label: "PROCESSING" },
          { value: "PENDING", label: "PENDING" },
          { value: "FAILED", label: "FAILED" },
        ],
      },
      { value: "tenant_id", label: "Tenant ID", type: "text" },
      { value: "user_id", label: "User ID", type: "text" },
      { value: "items_count", label: "Row Count", type: "number" },
      { value: "failed_rules", label: "Failed Rules", type: "number" },
    ],
    columns: [
      { key: "id", label: "Upload ID", isLink: true },
      { key: "filename", label: "File Name", isPrimary: true },
      { key: "tenant_id", label: "Tenant ID", isCode: true },
      { key: "user_id", label: "User ID", isCode: true },
      { key: "items_count", label: "Rows", isNumber: true },
      { key: "failed_rules", label: "Failed Rules", isNumber: true },
      { key: "status", label: "Status", isBadge: true },
      { key: "created_at", label: "Upload Date", isDate: true },
    ],
  },
};

export const OPERATOR_CONFIG = {
  text: [
    { value: "contains", label: "contains" },
    { value: "starts_with", label: "starts with" },
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" }
  ],
  number: [
    { value: "gt", label: "is greater than (>)" },
    { value: "lt", label: "is less than (<)" },
    { value: "is", label: "is (=)" }
  ],
  select: [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" }
  ]
};

export function getRecordById(tableKey, id) {
  let dataset = [];
  if (tableKey === "users") dataset = USERS_DATA;
  if (tableKey === "tenants") dataset = TENANTS_DATA;
  if (tableKey === "uploads") dataset = UPLOADS_DATA;

  return dataset.find((item) => item.id === id || item.batch_id === id);
}
