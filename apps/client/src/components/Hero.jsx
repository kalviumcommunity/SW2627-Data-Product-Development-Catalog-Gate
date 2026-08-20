export default function Hero({ loginHandler }) {
  return (
    <section className="section hero">
      <div className="container">
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
          >
            I'm a Vendor
          </button>

          <button
            type="button"
            className="btn-bichromatic btn-bichromatic-admin"
          >
            I'm a Catalog Admin
          </button>
        </div>

        <button
          type="button"
          className="btn-login"
          onClick={loginHandler}
        >
          Login
        </button>
      </div>
    </section>
  );
}