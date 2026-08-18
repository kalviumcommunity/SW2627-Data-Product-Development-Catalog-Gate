export default function VendorAppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-container">
        <div className="app-footer-left">
          <svg
            width="18"
            height="18"
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
          CatalogGate Enterprise
        </div>
        <div className="app-footer-center">
          &copy; 2026 CatalogGate Enterprise. All rights reserved.
        </div>
        <div className="app-footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#security">Security Compliance</a>
        </div>
      </div>
    </footer>
  );
}
