export default function Hero({ onVendorLogin, onAdminLogin }) {
  return (
    <section className="section hero">
      <div className="container">
        <div className="badge">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="11" x="2" y="9" rx="2" ry="2" />
            <path d="M5 20V9a7 7 0 0 1 14 0v11" />
          </svg>
          Trusted by Enterprise Marketplaces
        </div>
        <h1>
          The Operational Standard for <br />
          <span className="hero-highlight">Catalog Validation</span>.
        </h1>
        <p>
          Ensure zero-error data delivery. CatalogGate creates a clinical
          barrier between vendor uploads and your production environment,
          automating quality control at scale.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="btn-bichromatic btn-bichromatic-vendor"
            onClick={onVendorLogin}
          >
            I&apos;m a Vendor
          </button>
          <button
            type="button"
            className="btn-bichromatic btn-bichromatic-admin"
            onClick={onAdminLogin}
          >
            I&apos;m a Catalog Admin
          </button>
        </div>
      </div>
    </section>
  );
}
