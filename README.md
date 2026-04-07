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
- Responsive product grid with mobile, tablet, and desktop layouts.
- Product cards include title, image with fallback, price, rating, category, brand, and stock status.
- URL-driven search, category filter, sorting, and pagination.
- Empty-state UI for searches or filters with no results.

Detail page:

- Dynamic route at `/products/[id]`.
- Server-level product detail fetching.
- Full product detail view with image, description, rating, price, brand, category, and stock status.
- Breadcrumb navigation back to the listing/category context.
- Dynamic metadata for title, description, and Open Graph image.
- Related products from the same category.

States:

- `app/loading.tsx` for route-level loading UI.
- `app/error.tsx` for friendly error recovery.
- `app/products/[id]/loading.tsx` for detail-page loading UI.
- `app/products/[id]/not-found.tsx` for invalid product routes.

Testing:

- `components/stock-badge.test.tsx` covers stock state messaging.
- `components/rating-display.test.tsx` covers rating and review-count rendering.

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

- `app/` owns routes, layouts, metadata, and route-level loading/error/not-found files.
- `components/` contains reusable presentational UI.
- `features/` groups route-specific product listing, product detail, and search/filter behavior.
- `lib/products.ts` is the API layer. Components do not call `fetch` directly.
- `types/` contains reusable TypeScript shapes for API data.

## Performance Decisions

- Product images use `next/image` with explicit width, height, responsive `sizes`, and fallback behavior.
- Above-the-fold listing images and the primary detail image are marked with `priority`.
- Next image optimization is enabled for `cdn.dummyjson.com`.
- Product and product-detail requests use `revalidate: 300`.
- Category-list requests use `revalidate: 3600`.
- Route-specific client code is isolated to search/filter controls.
- Production builds run TypeScript validation.

## Trade-offs And Known Limitations

- DummyJSON does not expose a combined category+search endpoint. When both are active, the app fetches products for the selected category and applies the search filter in `lib/products.ts`.
- Combined category+search filtering currently fetches up to 100 products for the selected category before local filtering.
- Lighthouse/PageSpeed results are not documented yet because the app has not been deployed.
- No environment variables are currently required, so `.env.example` is not needed at this stage.

## Verification

Current checks:

- `npm run test`
- `npx tsc --noEmit`
- `npm run build`

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
