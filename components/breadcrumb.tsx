import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-gray-900">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-gray-400" aria-hidden="true">
              /
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
