import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
    >
      <div className="text-center">
        <div className="mb-4 text-6xl" aria-hidden="true">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The product you&apos;re looking for doesn&apos;t exist or has been removed
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Back to Products
        </Link>
      </div>
    </main>
  );
}
