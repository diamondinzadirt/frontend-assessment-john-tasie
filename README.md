# Product Explorer

Content Explorer take-home project for the Checkit Frontend Engineer assessment.

This app uses the DummyJSON Products API to render a browsable, searchable product catalog with a listing page, product detail pages, category filters, sorting, pagination, and loading/error/empty states.

## Current Status

Implemented:

- Server-rendered product listing page.
- Product data from the DummyJSON Products API.
- URL-driven search, category filter, sorting, and pagination.
- Dynamic product detail route at `/products/[id]`.
- Server-level product detail fetching.
- Breadcrumb navigation on the detail page.
- Dynamic detail metadata with title, description, and Open Graph image.
- Route-level loading and error UI.
- Dedicated empty state for no listing results.
- Two meaningful component tests with Vitest and React Testing Library.
- Product images rendered with `next/image`.
- Explicit fetch cache strategy for product and category data.
- Shared TypeScript product types.
- Feature-scoped structure for listing, detail, and search/filter behavior.

Planned next:

- Add `.env.example` if environment variables become necessary. Currently none are required.
- Run Lighthouse or axe accessibility audit and document results if pursuing accessibility bonus.
- Deploy final commit to Cloudflare Workers or Vercel and add the live URL.

## Setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Build check:

```bash
npm run build
```

Type check:

```bash
npx tsc --noEmit
```

Test:

```bash
npm run test
```

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- DummyJSON Products API

The UI is built with Tailwind CSS only. No UI component library is used.

## API Choice

The app uses DummyJSON Products:

- Product listing: `https://dummyjson.com/products`
- Search: `https://dummyjson.com/products/search`
- Categories: `https://dummyjson.com/products/category-list`
- Category listing: `https://dummyjson.com/products/category/[category]`
- Product detail: `https://dummyjson.com/products/[id]`

Reasoning:

- Free and stable public API.
- No API key required.
- Supports product images, metadata, categories, search, pagination, and detail data.
- Fits the assessment requirement for a browsable content explorer.

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
    not-found.tsx

components/
  breadcrumb.tsx
  empty-state.tsx
  error-state.tsx
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
  search-filter/

lib/
  constants.ts
  products.ts

types/
  index.ts
  product.ts
```

Architecture decisions:

- `app/` owns routing, layouts, metadata, and route-level loading/error files.
- `components/` contains reusable presentational UI only.
- `features/` groups route-specific product listing, product detail, and search/filter logic.
- `lib/products.ts` is the API layer. Components do not call `fetch` directly.
- `types/` contains shared reusable TypeScript shapes for API data.

## Implemented Features

Listing page:

- Server-rendered App Router page.
- Fetches product data from DummyJSON.
- Displays product cards in a responsive grid.
- Cards include title, image with fallback, price, rating, category, brand, and stock status.
- Supports URL-driven search, category filter, sorting, and pagination.

Detail page:

- Dynamic route: `/products/[id]`.
- Fetches product data at the server level.
- Shows full product detail.
- Includes breadcrumb navigation back to listing/category context.
- Exports dynamic metadata for title, description, and Open Graph image.

States:

- `app/loading.tsx` for route-level loading UI.
- `app/error.tsx` for friendly error recovery.
- `app/products/[id]/loading.tsx` for detail loading UI.
- Dedicated empty state for no listing results.

Tests:

- `components/stock-badge.test.tsx` covers stock state messaging.
- `components/rating-display.test.tsx` covers rating and review-count rendering.

## Performance Work Done So Far

- Kept route-specific client code isolated to search/filter controls.
- Listing and detail data are fetched from the server layer.
- Product images use `next/image` with explicit width, height, responsive `sizes`, and graceful fallback behavior.
- Above-the-fold listing images and the primary detail image are marked with `priority`.
- DummyJSON product/detail requests use `revalidate: 300`.
- DummyJSON category-list requests use `revalidate: 3600`.
- Next image optimization is enabled for `cdn.dummyjson.com`.
- Production builds run TypeScript validation.

Performance work still pending:

- Run Lighthouse/PageSpeed after deployment.

## Trade-offs And Known Limitations

- DummyJSON does not support combining category and search server-side, so combined search+category filtering is handled in `lib/products.ts` after fetching the selected category page.
- Combined category+search filtering fetches up to 100 products for the selected category and filters locally because DummyJSON does not expose a combined category search endpoint.
- README will need final deployment details once the app is deployed.

## Next Work Plan

Stage 1: Verification pass. Done.

Goal: confirm that the current implementation behaves exactly as expected before adding more code.

- Verified search URL behavior, for example `/?q=phone`.
- Verified category filter URL behavior, for example `/?category=smartphones`.
- Verified pagination route behavior with query state.
- Verified detail route behavior for `/products/1`.
- Verified not-found route behavior for an invalid product.

Stage 2: Tests. Done.

Goal: satisfy the assessment testing requirement without over-testing.

- Added Vitest with React Testing Library.
- Added tests for `StockBadge` and `RatingDisplay`.

Stage 3: Performance pass. Done.

Goal: improve Lighthouse readiness and document optimization choices.

- Replaced raw product images with `next/image`.
- Added explicit image dimensions and responsive sizes.
- Enabled remote image optimization for DummyJSON images.
- Applied `revalidate` cache settings for product and category fetches.

Stage 4: README finalization.

Goal: make the README submission-ready.

- Update setup instructions if scripts change.
- Add final architecture notes.
- Add final performance decisions.
- Add known limitations after the final implementation.
- Add deployment URL after deployment.

Stage 5: Deployment.

Goal: produce a publicly accessible final URL.

- Prefer Cloudflare Workers if time allows.
- Use Vercel only if Cloudflare setup becomes a blocker, and document why.
- Confirm the deployment reflects the final commit.

Stage 6: Final assessment audit.

Goal: check the submission against the PDF rubric before sending.

- Confirm all required features are present.
- Confirm dependency list has no UI libraries.
- Confirm build and tests pass.
- Confirm README is honest and complete.
- Run Lighthouse/accessibility checks if possible.
