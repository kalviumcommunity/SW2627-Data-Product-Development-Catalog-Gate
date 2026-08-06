function Hero() {
  return (
    <section className="py-24 text-center relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-500 text-xs font-semibold px-3 py-1 rounded-full mb-8 uppercase tracking-wide">
          Trusted by Enterprise Marketplaces
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
          The Operational Standard for <br />
          <span className="bg-teal-100 px-2 rounded">
            Catalog Validation
          </span>
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Ensure zero-error data delivery. CatalogGate creates a clinical barrier
          between vendor uploads and your production environment.
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-400 to-teal-500 text-white rounded-md font-semibold hover:scale-105 transition">
            I'm a Vendor
          </button>

          <button className="px-6 py-3 bg-gradient-to-l from-blue-400 to-teal-500 text-white rounded-md font-semibold hover:scale-105 transition">
            I'm a Catalog Admin
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;