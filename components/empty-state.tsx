import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="py-12 text-center" role="status" aria-live="polite">
      <div className="mb-4 text-5xl" aria-hidden="true">📦</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-600 mb-6">
        Try adjusting your search or filters to find what you&apos;re looking for
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Clear Filters
      </Link>
    </div>
  );
}
