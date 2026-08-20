import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SuperAdminLoginPage from "./pages/SuperAdminLoginPage";

import SuperAdminDashboard from "./components/admin/SuperAdminDashboard";
import RecordFormView from "./components/admin/RecordFormView";
import Workspace from "./pages/Workspace";
import Upload from "./components/Upload";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import Ingestions from "./components/Ingestions";
import Vendors from "./components/Vendors";
import Record from "./pages/Record";
import ValidationRules from "./pages/ValidationRules";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/super-admin/login" element={<SuperAdminLoginPage />} /> */}
      {/* <Route path="/vendor" element={<VendorLayout />}>
        <Route index element={<VendorDashboardPage />} />
        <Route path="upload" element={<VendorUploadPage />} />
        <Route path="history" element={<VendorHistoryPage />} />
        <Route path="validation-rules" element={<VendorValidationRulesPage />} />
      </Route> */}
      <Route path="/admin" element={<SuperAdminDashboard />} />
      {/* <Route path="/record" element={<RecordFormView />} /> */}

      <Route path="/workspace" element={<Workspace />}>
          <Route index element={<Dashboard />} />

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

      {/* route to workspace -> dashboard, upload, history, validation-rules, vendors */}
    </Routes>
  );
}

export default App;
