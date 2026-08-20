import { NavLink } from "react-router-dom";

// Map to conditionally render the navbar for user for different roles
const NAV_ITEMS = {
  vendor: [
    {
      to: "/workspace",
      end: true,
      label: "Dashboard",
      icon: (
        <>
          <rect x="4" y="4" width="6" height="6" />
          <rect x="14" y="4" width="6" height="6" />
          <rect x="14" y="14" width="6" height="6" />
          <rect x="4" y="14" width="6" height="6" />
        </>
      ),
    },
    {
      to: "/workspace/upload",
      label: "Upload Catalog",
      icon: (
        <>
          <path d="M12 3v12" />
          <path d="m7 8 5-5 5 5" />
          <path d="M5 21h14" />
        </>
      ),
    },
    {
      to: "/workspace/history",
      label: "History",
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ),
    },
    {
      to: "/workspace/validation-rules",
      label: "Validation Rules",
      icon: (
        <>
          <path d="M4 9h16" />
          <path d="M4 15h16" />
          <path d="M9 3 7 21" />
          <path d="M15 3 13 21" />
        </>
      ),
    },
  ],

  catalog_admin: [
    {
      to: "/workspace",
      end: true,
      label: "Dashboard",
      icon: (
        <>
          <rect x="4" y="4" width="6" height="6" />
          <rect x="14" y="4" width="6" height="6" />
          <rect x="14" y="14" width="6" height="6" />
          <rect x="4" y="14" width="6" height="6" />
        </>
      ),
    },
    {
      to: "/workspace/ingestions",
      label: "Ingestions",
      icon: (
        <>
          <path d="M12 3v12" />
          <path d="m7 8 5-5 5 5" />
          <path d="M5 21h14" />
        </>
      ),
    },
    {
      to: "/workspace/vendors",
      label: "Vendors",
      icon: (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="4" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      ),
    },
    {
      to: "/workspace/validation-rules",
      label: "Validation Rules",
      icon: (
        <>
          <path d="M4 9h16" />
          <path d="M4 15h16" />
          <path d="M9 3 7 21" />
          <path d="M15 3 13 21" />
        </>
      ),
    },
  ],

  super_admin: [
    {
      to: "/workspace",
      end: true,
      label: "Dashboard",
      icon: (
        <>
          <rect x="4" y="4" width="6" height="6" />
          <rect x="14" y="4" width="6" height="6" />
          <rect x="14" y="14" width="6" height="6" />
          <rect x="4" y="14" width="6" height="6" />
        </>
      ),
    },
    {
      to: "/workspace/uploads",
      label: "Vendor Ingestion",
      icon: (
        <>
          <path d="M12 3v12" />
          <path d="m7 8 5-5 5 5" />
          <path d="M5 21h14" />
        </>
      ),
    },
    {
      to: "/workspace/users",
      label: "Vendors",
      icon: (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="4" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      ),
    },
    {
      to: "/workspace/validation-rules",
      label: "Validation Rules",
      icon: (
        <>
          <path d="M4 9h16" />
          <path d="M4 15h16" />
          <path d="M9 3 7 21" />
          <path d="M15 3 13 21" />
        </>
      ),
    },
  ],
};

export default function WorkspaceSidebar({ role }) {
  const items = NAV_ITEMS[role] || [];

  return (
    <aside className="w-[220px] shrink-0 min-h-screen bg-white border-r border-[#e2e8f0]">
      <nav className="pt-12 px-[18px]">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3",
                    "min-h-[40px] px-3",
                    "rounded-[7px]",
                    "text-[12px] font-semibold",
                    "uppercase tracking-[0.04em]",
                    "transition-colors duration-150",
                    isActive
                      ? "bg-[#f3f6ff] text-[#7aa0ff]"
                      : "text-[#1e293b] hover:bg-[#f8fafc]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-[18px] h-[18px] shrink-0 ${
                        isActive
                          ? "text-[#7aa0ff]"
                          : "text-[#475569]"
                      }`}
                    >
                      {item.icon}
                    </svg>

                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}