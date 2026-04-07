'use client';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center bg-white border border-gray-200 rounded-lg p-8">
        <div className="mb-4 text-5xl" aria-hidden="true">
          ⚠️
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          We could not load products
        </h1>
        <p className="text-gray-600 mb-6">
          {error.message || 'Please try again in a moment.'}
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
