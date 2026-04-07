'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function isModifiedClick(event: MouseEvent): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function getInternalAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest('a');

  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (!anchor.href || anchor.target || anchor.hasAttribute('download')) return null;

  return anchor.origin === window.location.origin ? anchor : null;
}

export function NavigationLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
        return;
      }

      const anchor = getInternalAnchor(event.target);
      if (!anchor) return;

      const nextUrl = new URL(anchor.href);
      const currentUrl = new URL(window.location.href);

      if (
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search
      ) {
        return;
      }

      setIsLoading(true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
      }, 8000);
    }

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsLoading(false);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-50 bg-white/90 shadow-sm backdrop-blur"
    >
      <div className="h-1 w-full overflow-hidden bg-blue-100">
        <div className="h-full w-1/3 animate-pulse bg-blue-600" />
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-sm text-gray-700 sm:px-6 lg:px-8">
        <span className="h-3 w-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        Loading page...
      </div>
    </div>
  );
}
