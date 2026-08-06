function BridgeSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Bridging the Gap Between <br /> Vendors and Customers
          </h2>

          <p className="text-gray-500 mb-10">
            Unstructured vendor data leads to inconsistencies and poor trust.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                ✓
              </div>
              <div>
                <h4 className="font-semibold">Data Integrity Crisis</h4>
                <p className="text-sm text-gray-500">
                  Eliminate the 15% error rate in uploads.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                ⚡
              </div>
              <div>
                <h4 className="font-semibold">Operational Velocity</h4>
                <p className="text-sm text-gray-500">
                  Reduce time-to-market drastically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 rounded-xl">
            <h3 className="font-bold text-lg">Sanitized Pipeline</h3>
          </div>

          <div className="p-6 bg-blue-500 text-white rounded-xl">
            <h3 className="font-bold text-lg">Centralized Authority</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BridgeSection;