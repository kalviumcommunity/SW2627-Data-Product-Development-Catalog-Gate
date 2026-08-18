const STEPS = [
  {
    title: "Upload",
    description: "Vendors submit catalogs via API or secure CSV portal.",
    icon: (
      <>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 12v6M9 15l3-3 3 3" />
      </>
    ),
  },
  {
    title: "Validate",
    description: "Automated heuristic engine checks for schema violations.",
    icon: <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />,
  },
  {
    title: "Review",
    description: "Stakeholders approve high-confidence data via dashboard.",
    icon: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: "Publish",
    description: "Clean data is synced to production systems instantly.",
    icon: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  },
];

export default function Lifecycle() {
  return (
    <section className="section" id="workflow">
      <div className="container">
        <div className="section-title-wrapper">
          <h2>The Validation Lifecycle</h2>
          <p>A precise, four-stage journey for every data point.</p>
        </div>

        <div className="lifecycle-flow">
          {STEPS.map((step) => (
            <div key={step.title} className="lifecycle-card">
              <div className="lifecycle-icon-box">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {step.icon}
                </svg>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
