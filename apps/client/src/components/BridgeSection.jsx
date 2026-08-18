export default function BridgeSection() {
  return (
    <section className="section section-light" id="features">
      <div className="container">
        <div className="bridge-grid">
          <div className="bridge-left">
            <h2>
              Bridging the Gap Between <br />
              Vendors and Customers
            </h2>
            <p>
              Unstructured vendor data often leads to marketplace
              inconsistencies, broken links, and poor customer trust. Manual
              validation is a bottleneck that cannot scale.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h4>Data Integrity Crisis</h4>
                  <p>
                    Eliminate the 15% error rate typical in direct vendor
                    uploads.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h4>Operational Velocity</h4>
                  <p>
                    Reduce time-to-market from days to minutes with automated
                    logic.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bridge-right">
            <div className="bridge-card light">
              <svg
                className="card-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 11l2 2 4-4" />
              </svg>
              <h3>
                Sanitized <br />
                Pipeline
              </h3>
            </div>

            <div className="bridge-card blue">
              <svg
                className="card-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
              </svg>
              <h3>
                Centralized <br />
                Authority
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
