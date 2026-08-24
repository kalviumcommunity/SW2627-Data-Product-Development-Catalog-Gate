import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Workspace from "./pages/Workspace";
import Upload from "./components/Upload";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import History from "./components/History";
import Ingestions from "./components/Ingestions";
import Vendors from "./components/Vendors";
import Record from "./pages/Record";
import ValidationRules from "./pages/ValidationRules";
import { useAuth } from "./context/AuthContext";
import { getRoleFromAccessToken } from "./lib/auth/jwt";

/** Renders the correct dashboard based on the logged-in user's role. */
function RoleDashboard() {
  const { accessToken } = useAuth();
  const role = getRoleFromAccessToken(accessToken);

  const isAdmin =
    role === "catalog_admin" || role === "super_admin" || role === "admin";

  return isAdmin ? <AdminDashboard /> : <Dashboard />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<SuperAdminDashboard />} />

      <Route path="/workspace" element={<Workspace />}>
          {/* Role-aware index: admins → AdminDashboard, vendors → Dashboard */}
          <Route index element={<RoleDashboard />} />

          {/* Vendor specific */}
          <Route path="upload" element={<Upload />} />
          <Route path="history" element={<History />} />

          {/* Catalog Admin specific */}
          <Route path="ingestions" element={<Ingestions />} />
          <Route path="vendors" element={<Vendors />} />

          {/* Common */}
          <Route path="validation-rules" element={<ValidationRules />} />

      </Route>

      <Route path="/record" element={<Record />} />
    </Routes>
  );
}

export default App;
