import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleFromAccessToken } from "../lib/auth/jwt";
import WorkspaceSidebar from "../components/WorkspaceSidebar";
import WorkspaceFooter from "../components/WorkspaceFooter";

export default function Workspace() {
  const { user, accessToken } = useAuth();

  const role = getRoleFromAccessToken(accessToken);
  const roleLabel = getRoleLabel(role);

  return (
    <div className="min-h-screen flex antialiased">
      <WorkspaceSidebar role={role} />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex-shrink-0 px-8 pt-6">
          <div className="max-w-[1440px] w-full mx-auto">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
              <div
                className="text-slate-600 text-[0.95rem] font-bold ml-10"
                style={{
                  textShadow: "0 1px 2px rgba(122, 160, 255, 0.25)",
                }}
              >
                CATALOGGATE
              </div>

              {/* Profile */}
              <div className="flex items-center gap-2.5">
                <div className="text-right leading-tight">
                  <div className="text-[0.775rem] font-bold text-[#1e293b]">
                    {user?.email || "user@example.com"}
                  </div>

                  <div className="text-[0.65rem] font-semibold text-[#64748b] uppercase tracking-wider">
                    {roleLabel}
                  </div>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#7aa0ff]/20 shadow-xs"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Routed Page */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

        {/* Footer */}
        <WorkspaceFooter />
      </div>
    </div>
  );
}

function getRoleLabel(role) {
  if (!role) {
    return "User";
  }

  switch (role.toLowerCase()) {
    case "vendor":
      return "Vendor";

    case "catalog_admin":
      return "Catalog Admin";

    case "admin":
      return "Admin";

    case "super_admin":
      return "Super Admin";

    default:
      return role
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}