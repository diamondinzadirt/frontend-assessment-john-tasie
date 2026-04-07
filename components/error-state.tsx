import Link from 'next/link';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again later or go back to the products list',
  actionHref = '/',
  actionLabel = 'Back to Products',
}: ErrorStateProps) {
  return (
    <div className="text-center py-12 bg-white border border-gray-200 rounded-lg px-6">
      <div className="mb-4 text-5xl" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      <Link href={actionHref} className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        {actionLabel}
      </Link>
    </div>
  );
}
