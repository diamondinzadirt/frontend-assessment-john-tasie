import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const LISTING_EDGE_CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=3600';
const NEXT_DATA_REVALIDATE_SECONDS = '300';

function isCacheableListingRequest(request: NextRequest): boolean {
  const acceptsRsc = request.headers.get('accept')?.includes('text/x-component');
  const isRscFlight = request.nextUrl.searchParams.has('_rsc');
  const isPrefetch = request.headers.get('next-router-prefetch') === '1';

  return (
    request.nextUrl.pathname === '/' &&
    (request.method === 'GET' || request.method === 'HEAD') &&
    !acceptsRsc &&
    !isRscFlight &&
    !isPrefetch
  );
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (!isCacheableListingRequest(request)) {
    response.headers.set('x-cache-status', 'BYPASS');
    return response;
  }

  response.headers.set('Cache-Control', LISTING_EDGE_CACHE_CONTROL);
  response.headers.set('x-cache-status', 'EDGE-ELIGIBLE');
  response.headers.set('x-next-revalidate', NEXT_DATA_REVALIDATE_SECONDS);

  return response;
}

export const config = {
  matcher: '/',
};
