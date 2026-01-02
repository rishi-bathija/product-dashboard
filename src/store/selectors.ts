import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Product, SortOption } from '@/types/product';

const selectAllProducts = (state: RootState) => state.products.items;
const selectSearchQuery = (state: RootState) => state.filters.searchQuery;
const selectCategory = (state: RootState) => state.filters.category;
const selectSortOption = (state: RootState) => state.filters.sortOption;

export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectSearchQuery, selectCategory, selectSortOption],
  (products, searchQuery, category, sortOption): Product[] => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Sort products
    if (sortOption === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }
);

export const selectCategories = createSelector([selectAllProducts], (products) => {
  const categories = new Set(products.map((product) => product.category));
  return Array.from(categories).sort();
});

export const selectFavoriteIds = (state: RootState) =>
  state.favorites.items.map((item) => item.id);

export const selectIsFavorite = (productId: number) => (state: RootState) =>
  state.favorites.items.some((item) => item.id === productId);



