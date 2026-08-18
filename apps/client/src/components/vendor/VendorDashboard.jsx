import { Link } from "react-router-dom";
import {
  VENDOR_PROFILE,
  VENDOR_UPLOADS,
  VENDOR_UPLOADS_TOTAL,
} from "../../data/vendorMockData";
import VendorAppFooter from "./VendorAppFooter";

function StatusBadge({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`status-badge ${status}`}>{label}</span>;
}

export default function VendorDashboard() {
  return (
    <div className="workspace-canvas">
      <div
        className="canvas-header"
        style={{ marginTop: "1rem", alignItems: "center" }}
      >
        <div className="canvas-header-left">
          <span className="user-welcome">Welcome {VENDOR_PROFILE.name}!</span>
          <h1>
            Vendor <strong>Dashboard</strong>
          </h1>
        </div>

        <div
          className="topbar-utilities"
          style={{
            position: "absolute",
            right: "2rem",
            top: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            zIndex: 10,
          }}
        >
          <div
            className="user-profile-widget"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <div style={{ textAlign: "right", lineHeight: 1.2 }}>
              <div
                style={{
                  fontSize: "0.775rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                }}
              >
                {VENDOR_PROFILE.name}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {VENDOR_PROFILE.company} - {VENDOR_PROFILE.role}
              </div>
            </div>
            <img
              src={VENDOR_PROFILE.avatar}
              alt={`${VENDOR_PROFILE.name} profile`}
              className="user-avatar-main"
              style={{ width: 36, height: 36, borderRadius: "50%" }}
            />
          </div>
        </div>
      </div>

      <section className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Recent Uploads</h2>
          <Link to="/vendor/history" className="action-link">
            View All History
          </Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Catalog Name</th>
                <th>Upload Date</th>
                <th>Items</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {VENDOR_UPLOADS.map((upload) => (
                <tr key={upload.id}>
                  <td>
                    <a href={`#${upload.id}`} className="batch-link">
                      #{upload.id}
                    </a>
                  </td>
                  <td>
                    <span className="catalog-name">{upload.catalogName}</span>
                  </td>
                  <td>
                    <span className="date-text">{upload.uploadDate}</span>
                  </td>
                  <td>{upload.items}</td>
                  <td>
                    <StatusBadge status={upload.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Showing {VENDOR_UPLOADS.length} of {VENDOR_UPLOADS_TOTAL} uploads
          </span>
          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-btn"
              aria-label="Previous Page"
            >
              ⟨
            </button>
            <button
              type="button"
              className="pagination-btn"
              aria-label="Next Page"
            >
              ⟩
            </button>
          </div>
        </div>
      </section>

      <VendorAppFooter />
    </div>
  );
}
