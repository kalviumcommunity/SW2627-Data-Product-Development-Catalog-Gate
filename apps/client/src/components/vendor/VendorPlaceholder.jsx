import VendorAppFooter from "./VendorAppFooter";

export default function VendorPlaceholder({ title }) {
  return (
    <div className="workspace-canvas">
      <div className="canvas-header" style={{ marginTop: "1rem" }}>
        <div className="canvas-header-left">
          <h1>
            {title} <strong>Workspace</strong>
          </h1>
          <p>This section is coming soon.</p>
        </div>
      </div>
      <section className="section-card">
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Use the Dashboard to view recent catalog uploads.
        </p>
      </section>
      <VendorAppFooter />
    </div>
  );
}
