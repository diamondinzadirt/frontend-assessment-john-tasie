import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mb-4 text-5xl">📦</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-600 mb-6">
        Try adjusting your search or filters to find what you&apos;re looking for
      </p>
      <Link href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Clear Filters
      </Link>
    </div>
  );
}
