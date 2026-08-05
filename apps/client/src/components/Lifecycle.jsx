function Lifecycle() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          The Validation Lifecycle
        </h2>
        <p className="text-gray-500 mb-12">
          A precise, four-stage journey for every data point.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold">Upload</h3>
            <p className="text-sm text-gray-500">
              Vendors submit catalogs.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold">Validate</h3>
            <p className="text-sm text-gray-500">
              Automated validation runs.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold">Review</h3>
            <p className="text-sm text-gray-500">
              Admin reviews flagged issues.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold">Publish</h3>
            <p className="text-sm text-gray-500">
              Clean data goes live.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Lifecycle;