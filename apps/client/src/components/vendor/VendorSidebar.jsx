import { NavLink } from "react-router-dom";
import { VENDOR_PROFILE } from "../../data/vendorMockData";

const NAV_ITEMS = [
  {
    to: "/vendor",
    end: true,
    label: "Dashboard",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
  },
  {
    to: "/vendor/upload",
    label: "Upload Catalog",
    icon: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </>
    ),
  },
  {
    to: "/vendor/history",
    label: "History",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
  {
    to: "/vendor/validation-rules",
    label: "Validation Rules",
    icon: (
      <>
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
      </>
    ),
  },
];

export default function VendorSidebar() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="sidebar-menu-item">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-menu-link${isActive ? " active" : ""}`
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        {VENDOR_PROFILE.company} - Vendor
      </div>
    </aside>
  );
}
