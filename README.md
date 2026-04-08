# Product Explorer

Content Explorer take-home project for the Checkit Frontend Engineer assessment.

Product Explorer is a server-rendered product catalog built with the Next.js App Router, TypeScript, and Tailwind CSS. It uses the DummyJSON Products API to provide searchable, filterable, paginated product browsing and server-rendered product detail pages.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run test
npx tsc --noEmit
npm run build
```

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- DummyJSON Products API
- Vitest + React Testing Library

The UI is built with Tailwind CSS only. No UI component library is used.

## API Choice

The app uses DummyJSON Products:

- Product listing: `https://dummyjson.com/products`
- Search: `https://dummyjson.com/products/search`
- Categories: `https://dummyjson.com/products/category-list`
- Category listing: `https://dummyjson.com/products/category/[category]`
- Product detail: `https://dummyjson.com/products/[id]`

DummyJSON was chosen because it is stable, free, does not require an API key, and provides product data with images, categories, search, pagination, and detail fields.

## Features

Listing page:

- Server-rendered App Router page.
- Product data fetched through the server-side API layer.
- Displays 20 products per page by default.
- Responsive product grid with mobile, tablet, and desktop layouts.
- Product cards include title, image with fallback, price, rating, category, brand, and stock status.
- Product image containers include a skeleton-style placeholder while images load.
- URL-driven search, category filter, sorting, and pagination.
- Empty-state UI for searches or filters with no results.

Detail page:

- Dynamic route at `/products/[id]`.
- Server-level product detail fetching.
- Full product detail view with image, description, rating, price, brand, category, and stock status.
- Breadcrumb navigation back to the listing/category context.
- Dynamic metadata for title, description, and Open Graph image.
- Related products from the same category.
- Related products are streamed behind a React `Suspense` boundary so the main product detail can render independently.

States:

- `app/loading.tsx` for route-level loading UI.
- `app/error.tsx` for friendly error recovery.
- `app/products/[id]/error.tsx` for detail-page error recovery.
- `app/products/[id]/loading.tsx` for detail-page loading UI.
- `app/products/[id]/not-found.tsx` for invalid product routes.
- Global navigation loading indicator for internal page transitions.
- Inline listing error state if product data cannot be loaded.
- Filter UI fallback if category data cannot be loaded.
- Related-products fallback so product detail remains usable if related products fail.

Testing:

- `components/stock-badge.test.tsx` covers stock state messaging.
- `components/rating-display.test.tsx` covers rating and review-count rendering.
- `lib/products.test.ts` covers API-boundary behavior, typed API errors, invalid response shapes, missing products, sorting, and the category+search workaround.
- `features/products/listing/search-params.test.ts` covers URL search-param normalization.
- `features/products/listing/pagination-utils.test.ts` covers pagination window behavior.

## Architecture

```text
app/
  layout.tsx
  page.tsx
  loading.tsx
  error.tsx
  products/[id]/
    page.tsx
    loading.tsx
    error.tsx
    not-found.tsx

components/
  breadcrumb.tsx
  empty-state.tsx
  error-state.tsx
  navigation-loading-indicator.tsx
  product-card.tsx
  product-detail-skeleton.tsx
  product-image-gallery.tsx
  product-skeleton.tsx
  rating-display.tsx
  stock-badge.tsx

features/
  products/
    detail/
    listing/
      pagination-utils.test.ts
      search-params.test.ts
  search-filter/

lib/
  constants.ts
  products.ts
  products.test.ts

types/
  index.ts
  product.ts
```

Architecture decisions:

- `app/` owns routes, layouts, metadata, and route-level loading/error/not-found files.
- `components/` contains reusable presentational UI.
- `features/` groups route-specific product listing, product detail, and search/filter behavior.
- `lib/products.ts` is the API layer. Components do not call `fetch` directly.
- `lib/products.ts` validates API response shapes and throws a typed `ProductApiError` when network, status, JSON, or schema issues occur.
- `types/` contains reusable TypeScript shapes for API data.

## Performance Optimizations

1. Image optimization with `next/image`

- All product imagery is rendered through `next/image`.
- Product images define explicit `width` and `height` values to reserve layout space and reduce CLS.
- Responsive `sizes` values are applied so smaller screens avoid downloading unnecessarily large images.
- Above-the-fold listing cards and the main detail image use `priority` to improve LCP.
- Product image containers keep a fixed aspect ratio and show a lightweight skeleton placeholder while the image loads.

2. Fetch caching strategy

- Product listing and product detail requests use `next: { revalidate: 300 }`.
- Category-list requests use a longer `revalidate: 3600` interval because that data changes less frequently.
- The app avoids `cache: 'no-store'` so repeat requests can benefit from Next.js caching and reduce render-time network cost.
- Static Next assets are configured with `Cache-Control: public, max-age=31536000, immutable`.

3. Font optimization with `next/font`

- The root layout uses `next/font/google` with `Inter`.
- Font loading uses `display: 'swap'` through Next.js font optimization.
- This avoids external render-blocking font requests and helps reduce layout shift on first paint.

4. Reduced client-side JavaScript

- The main listing page remains a server component.
- Client components are limited to interactive areas such as search/filter controls, image loading state, and route-transition feedback.
- Presentational components that do not need client hooks were moved back to server-compatible components to keep the client bundle smaller.

5. Layout stability improvements

- Listing and detail image containers use fixed aspect ratios.
- Skeleton loaders are sized to match their final content regions.
- Product cards and detail sections reserve space before content resolves, which helps keep CLS low.

## Bonus Work

- React streaming with `Suspense` is implemented on the product detail page for related products.
- Accessibility and Lighthouse audit results are still pending until the app is deployed.

## Accessibility

- Added a skip link for keyboard users to jump directly to the main content.
- Search, filters, pagination, and breadcrumbs use clearer labels and navigation semantics.
- Interactive controls include visible `focus-visible` states for keyboard navigation.
- Filter and sort controls expose state with `aria-pressed`, and the active breadcrumb item uses `aria-current="page"`.
- Empty and error states use clearer status/alert semantics.

## Trade-offs And Known Limitations

- DummyJSON does not expose a combined category+search endpoint. When both are active, the app fetches products for the selected category and applies the search filter in `lib/products.ts`.
- Combined category+search filtering currently fetches up to 100 products for the selected category before local filtering.
- Lighthouse/PageSpeed results are not documented yet because the app has not been deployed.
- No environment variables are currently required; `.env.example` is included to make that explicit.

## Verification

Current checks:

- `npm run test`
- `npx tsc --noEmit`
- `npm run build`

Current automated coverage:

- 5 test files
- 13 tests

Manual behavior checked:

- Listing page renders products.
- Search state is reflected in the URL, for example `/?q=phone`.
- Category state is reflected in the URL, for example `/?category=smartphones`.
- Pagination route behavior works with query state.
- Detail route works for `/products/1`.
- Invalid product routes show the product not-found UI.

## Remaining Work Before Submission

- Deploy the final app and add the live URL here.
- Run Lighthouse/PageSpeed against the deployed app and document the result.
- Run an accessibility audit if attempting the accessibility bonus.
- Add final deployment notes, including whether Cloudflare Workers or Vercel was used and why.
