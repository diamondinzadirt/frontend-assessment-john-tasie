import Link from 'next/link';

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = 'Something went wrong' }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mb-4 text-5xl">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-600 mb-6">
        Please try again later or go back to the products list
      </p>
      <Link href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Back to Products
      </Link>
    </div>
  );
}
