import { describe, it, expect } from 'vitest';
import filtersReducer, {
  setSearchQuery,
  setCategory,
  setSortOption,
  resetFilters,
} from '../filtersSlice';

describe('filtersSlice', () => {
  it('should return initial state', () => {
    const state = filtersReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      searchQuery: '',
      category: 'all',
      sortOption: 'none',
    });
  });

  it('should handle setSearchQuery', () => {
    const initialState = {
      searchQuery: '',
      category: 'all',
      sortOption: 'none' as const,
    };
    const action = setSearchQuery('laptop');
    const state = filtersReducer(initialState, action);
    expect(state.searchQuery).toBe('laptop');
  });

  it('should handle setCategory', () => {
    const initialState = {
      searchQuery: '',
      category: 'all',
      sortOption: 'none' as const,
    };
    const action = setCategory('electronics');
    const state = filtersReducer(initialState, action);
    expect(state.category).toBe('electronics');
  });

  it('should handle setSortOption', () => {
    const initialState = {
      searchQuery: '',
      category: 'all',
      sortOption: 'none' as const,
    };
    const action = setSortOption('price-asc');
    const state = filtersReducer(initialState, action);
    expect(state.sortOption).toBe('price-asc');
  });

  it('should handle resetFilters', () => {
    const initialState = {
      searchQuery: 'laptop',
      category: 'electronics',
      sortOption: 'price-desc' as const,
    };
    const action = resetFilters();
    const state = filtersReducer(initialState, action);
    expect(state).toEqual({
      searchQuery: '',
      category: 'all',
      sortOption: 'none',
    });
  });
});



