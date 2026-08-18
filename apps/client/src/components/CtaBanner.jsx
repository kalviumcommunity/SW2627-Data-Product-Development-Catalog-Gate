export default function CtaBanner() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="cta-banner">
      <div className="cta-container">
        <h2>
          Ready to <span className="cta-highlight">standardize</span> your data?
        </h2>
        <div className="cta-actions">
          <button type="button" className="btn-primary-white" onClick={scrollToFeatures}>
            Know More
          </button>
        </div>
      </div>
    </section>
  );
}
