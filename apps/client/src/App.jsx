import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
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
      <Route path="/admin" element={<SuperAdminDashboard />} />

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
