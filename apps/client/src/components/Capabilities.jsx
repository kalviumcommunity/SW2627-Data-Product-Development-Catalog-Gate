const CHART_BARS = [
  { height: "35%" },
  { height: "80%", active: true },
  { height: "50%" },
  { height: "65%" },
  { height: "25%" },
  { height: "40%" },
];

export default function Capabilities() {
  return (
    <section className="section section-light">
      <div className="container">
        <div className="section-title-wrapper">
          <h2>Industrial-Grade Capabilities</h2>
        </div>

        <div className="capabilities-grid">
          <div className="cap-card cap-card-logic">
            <span className="cap-label">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              Engine
            </span>
            <h3>Advanced Logic Engine</h3>
            <p>
              Configure complex validation rules for SKUs, pricing logic, and regional availability
              without writing code.
            </p>
            <div className="pills-row">
              <span className="pill">Regex Validation</span>
              <span className="pill">Schema Mapping</span>
              <span className="pill">Duplicate Detection</span>
            </div>
          </div>

          <div className="cap-card cap-card-reporting">
            <span className="cap-label">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 6v6l4 2" />
              </svg>
              Audit
            </span>
            <h3>Precision Reporting</h3>
            <p>Audit trails and error breakdown for every submission.</p>

            <div className="mock-dashboard">
              <div className="mock-dash-header">
                <span>Catalog Errors By Category</span>
                <span>7 Days</span>
              </div>
              <div className="mock-dash-chart">
                {CHART_BARS.map((bar, index) => (
                  <div
                    key={index}
                    className={`mock-dash-bar${bar.active ? " active" : ""}`}
                    style={{ height: bar.height }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="cap-card cap-card-workflow">
            <span className="cap-label">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Automation
            </span>
            <h3>Collaborative Workflow</h3>
            <p>Seamless hand-offs between vendors, QA teams, and catalog managers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
