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
    <div
      role="alert"
      className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center"
    >
      <div className="mb-4 text-5xl" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      <Link
        href={actionHref}
        className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
