import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SuperAdminLoginPage from "./pages/SuperAdminLoginPage";
import {
  VendorLayout,
  VendorDashboardPage,
  VendorUploadPage,
  VendorHistoryPage,
  VendorValidationRulesPage,
} from "./pages/VendorWorkspace";
import SuperAdminDashboard from "./components/admin/SuperAdminDashboard";
import RecordFormView from "./components/admin/RecordFormView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
      <Route path="/vendor" element={<VendorLayout />}>
        <Route index element={<VendorDashboardPage />} />
        <Route path="upload" element={<VendorUploadPage />} />
        <Route path="history" element={<VendorHistoryPage />} />
        <Route path="validation-rules" element={<VendorValidationRulesPage />} />
      </Route>
      <Route path="/admin" element={<SuperAdminDashboard />} />
      <Route path="/record" element={<RecordFormView />} />
    </Routes>
  );
}

export default App;
