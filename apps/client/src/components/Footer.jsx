function CatalogGateLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 17V7" />
      <path d="M15 17V7" />
      <path d="M9 12h6" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-logo-col">
            <a href="/" className="logo">
              <CatalogGateLogo />
              CatalogGate
            </a>
            <p>
              The clinical standard for high-volume catalog data validation and lifecycle
              management.
            </p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#features">Security</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="#features">Contact Support</a>
              </li>
              <li>
                <a href="#workflow">Documentation</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#features">Privacy Policy</a>
              </li>
              <li>
                <a href="#features">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; 2026 CatalogGate. All rights reserved.</div>
          <div className="footer-bottom-right">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
