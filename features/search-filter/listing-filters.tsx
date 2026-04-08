import { getProductCategories } from '@/lib/products';
import { Filters } from './filters';

interface ListingFiltersProps {
  variant?: 'sidebar' | 'compact';
}

export async function ListingFilters({
  variant = 'sidebar',
}: ListingFiltersProps) {
  let categoryLoadError = false;
  let categories: Awaited<ReturnType<typeof getProductCategories>> = [];

  try {
    categories = await getProductCategories();
  } catch {
    categoryLoadError = true;
  }

  return (
    <Filters
      categories={categories}
      categoryLoadError={categoryLoadError}
      variant={variant}
    />
  );
}
