# Checkit Product Explorer

Production-minded Content Explorer built for the Checkit Frontend Engineer take-home assessment. The app uses the DummyJSON Products API to deliver a server-rendered product catalogue with search, filtering, pagination, and product detail pages.

## Live URL

Cloudflare Workers deployment:

- `https://frontend-assessment-john-tasie.tasiejohn777.workers.dev`

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Validation commands:

```bash
npm run test
npx tsc --noEmit
npm run build
```

No environment variables are required for this project. `.env.example` is included to make that explicit.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript with strict mode
- Tailwind CSS
- DummyJSON Products API
- Vitest + React Testing Library

No UI component library is used.

## API Choice

I chose DummyJSON because it is stable, free, requires no API key, and exposes the exact primitives needed for the brief: listing, detail pages, categories, search, images, and pagination.

API endpoints used:

- `/products`
- `/products/search`
- `/products/category-list`
- `/products/category/[category]`
- `/products/[id]`

## Features Delivered

### Listing page

- Server-rendered product listing
- 20 items per page
- Responsive product grid: 1 column on mobile, 2 on tablet, 3 to 4 on larger screens
- URL-driven search with 300ms debounce
- Category filter and sort controls
- Shareable query state in the URL
- Pagination with preserved filter/search state

Each card shows:

- title
- image with graceful fallback
- price
- rating
- category
- brand
- stock state

### Detail page

- Dynamic route at `/products/[id]`
- Server-level data fetching
- Metadata via `generateMetadata`
- Breadcrumb back to the listing context
- Full product details
- Related products from the same category

### Loading, error, and empty states

- `loading.tsx` route-level skeletons
- friendly `error.tsx` boundaries
- dedicated `not-found.tsx` for invalid product IDs
- reusable empty-state UI for no-result searches

## Architecture

The project follows the foundation requested in the brief:

```text
app/         routes, layouts, loading/error boundaries
components/  reusable UI pieces
features/    listing, detail, and search/filter feature logic
lib/         API layer and shared utilities
types/       shared TypeScript types
__tests__/   focused test coverage
```

Key decisions:

- `app/` owns routing, metadata, and route-level async states.
- `components/` contains reusable presentational UI.
- `features/` groups route-specific behavior so listing and detail logic stay isolated.
- `lib/products.ts` is the API boundary. Components do not call `fetch()` directly.
- shared types live in `types/`, keeping reused data shapes out of JSX and route files.

## Performance Optimizations

I applied more than the three optimizations requested in the brief:

1. `next/image`
   - All product imagery uses `next/image`.
   - Explicit dimensions and `sizes` reduce layout shift and avoid oversized downloads.
   - Above-the-fold imagery uses `priority`.

2. Fetch caching with Next.js cache semantics
   - listing and detail requests use `next: { revalidate: 300 }`
   - category list uses `next: { revalidate: 3600 }`
   - this keeps data reasonably fresh without paying the full fetch cost on every request

3. Edge-aware cache headers for Cloudflare
   - listing HTML responses expose `Cache-Control`, `x-cache-status`, and `x-next-revalidate`
   - static assets use a Cloudflare `_headers` file with long-lived immutable caching
   - the listing route advertises edge-cache eligibility separately from Next data revalidation so response caching and fetch caching are both visible

4. `next/font`
   - Inter is loaded with Next font optimization and `display: 'swap'`
   - this avoids a separate render-blocking font request

5. Reduced client-side JavaScript
   - the main listing page remains server-rendered
   - client components are limited to interactive controls and lightweight UI state

## Testing

The brief asked for at least two meaningful tests. The project currently has:

- `4` test files
- `11` tests

Coverage is focused on core behavior rather than snapshot volume:

- [__tests__/lib/products.test.ts](/Users/mac/Downloads/test-checkit/__tests__/lib/products.test.ts)
  - API behavior, validation, error handling, local sort/filter fallback
- [__tests__/features/products/listing/search-params.test.ts](/Users/mac/Downloads/test-checkit/__tests__/features/products/listing/search-params.test.ts)
  - URL state normalization
- [__tests__/features/products/listing/pagination-utils.test.ts](/Users/mac/Downloads/test-checkit/__tests__/features/products/listing/pagination-utils.test.ts)
  - pagination window logic
- [__tests__/features/products/listing/product-listing.test.tsx](/Users/mac/Downloads/test-checkit/__tests__/features/products/listing/product-listing.test.tsx)
  - empty-state and friendly error-state rendering for the listing route

## Lighthouse And Accessibility

From the latest Lighthouse run:

- Performance: `95`
- Accessibility: `100`
- Best Practices: `100`
- SEO: `100`
- FCP: `0.3s`
- LCP: `1.5s`
- Speed Index: `0.9s`
- TBT: `50ms`
- Max Potential FID: `90ms`
- CLS: `0`
- Root document response time: `130ms`

Interpretation:

- the submission clears the Lighthouse performance target of `>= 90`
- accessibility bonus target of `>= 95` is met
- LCP is now comfortably inside the ideal `< 2.5s` target
- interaction and layout stability metrics are also inside the brief's target range

Accessibility work completed:

- skip link to main content
- improved labels and landmarks for search, filters, pagination, and breadcrumbs
- visible keyboard focus states
- accessible filter state semantics

## Bonus Tasks Attempted

### React 18 streaming with Suspense

Implemented.

- Related products on the detail page are wrapped in a `Suspense` boundary with a meaningful fallback.

### Accessibility audit

Implemented.

- Lighthouse accessibility score: `100`

### Cloudflare Workers deployment

Implemented.

- app is deployed on Cloudflare Workers rather than Vercel

Verification:

```bash
curl -I https://frontend-assessment-john-tasie.tasiejohn777.workers.dev/
```

Headers to check:

- `cache-control`
- `x-cache-status`
- `x-next-revalidate`

## Trade-offs And Known Limitations

- DummyJSON does not provide a combined category + search endpoint. When both are active, the app fetches category results and applies the text filter locally in `lib/products.ts`.
- That fallback currently fetches up to 100 items from the selected category before local filtering.
- `x-cache-status` currently signals cache eligibility at the app layer; it is useful for verification, but it is not a substitute for Cloudflare's own `cf-cache-status` response header.
- I did not add extra state libraries because the app does not need them; URL state plus React built-ins were sufficient.

## What I Would Improve With 2 More Hours

- tighten Cloudflare edge-cache observability further so `HIT`/`MISS` can be demonstrated more explicitly at the deployment boundary
- add a small verified deployment section with screenshots or repeated curl checks for caching behavior
- expand tests around detail-page rendering and error recovery
