import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery, setCategory, setSortOption } from '@/store/slices/filtersSlice';
import { selectCategories } from '@/store/selectors';
import { SortOption } from '@/types/product';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchAndFilters() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const currentCategory = useAppSelector((state) => state.filters.category);
  const currentSort = useAppSelector((state) => state.filters.sortOption);
  const currentSearch = useAppSelector((state) => state.filters.searchQuery);

  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setCategory(e.target.value));
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setSortOption(e.target.value as SortOption));
    },
    [dispatch]
  );

  return (
    <div className="card p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-semibold text-slate-700 mb-2.5">
            Search Products
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search"
              type="text"
              placeholder="Search by title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-10"
              aria-label="Search products by title"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2.5">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              value={currentCategory}
              onChange={handleCategoryChange}
              className="input-field appearance-none bg-white pr-10 cursor-pointer"
              aria-label="Filter products by category"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sort Option */}
        <div>
          <label htmlFor="sort" className="block text-sm font-semibold text-slate-700 mb-2.5">
            Sort By Price
          </label>
          <div className="relative">
            <select
              id="sort"
              value={currentSort}
              onChange={handleSortChange}
              className="input-field appearance-none bg-white pr-10 cursor-pointer"
              aria-label="Sort products by price"
            >
              <option value="none">None</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}



