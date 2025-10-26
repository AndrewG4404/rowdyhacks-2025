// GoLoanMe - Home Page
// Minimal placeholder - frontend teammate will implement

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🚀 GoLoanMe Backend Ready!
        </h1>
        <p className="text-gray-600 mb-2">
          API is running at <code className="bg-gray-100 px-2 py-1 rounded">/api/*</code>
        </p>
        <p className="text-sm text-gray-500">
          Frontend teammate: Start building in <code>src/app/</code> and <code>src/components/</code>
        </p>
        <div className="mt-6">
          <a
            href="/api/health"
            className="text-green-600 hover:underline"
            target="_blank"
          >
            Check API Health →
          </a>
        </div>
      </div>
    </main>
  );
}

