import { Outlet } from "react-router-dom";
import "../../vendor-dashboard.css";
import VendorSidebar from "./VendorSidebar";

export default function VendorLayout() {
  return (
    <div className="vendor-app">
      <div className="app-container">
        <VendorSidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
