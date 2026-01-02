import { describe, it, expect } from 'vitest';
import { selectFilteredProducts, selectCategories, selectIsFavorite } from '../selectors';
import { RootState } from '../store';
import { Product, SortOption } from '@/types/product';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Laptop Computer',
    price: 999.99,
    description: 'A laptop',
    category: 'electronics',
    image: 'https://example.com/laptop.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'T-Shirt',
    price: 19.99,
    description: 'A t-shirt',
    category: 'clothing',
    image: 'https://example.com/tshirt.jpg',
    rating: { rate: 4.0, count: 50 },
  },
  {
    id: 3,
    title: 'Mobile Phone',
    price: 599.99,
    description: 'A phone',
    category: 'electronics',
    image: 'https://example.com/phone.jpg',
    rating: { rate: 4.8, count: 200 },
  },
];

describe('selectors', () => {
  const mockState: RootState = {
    products: {
      items: mockProducts,
      loading: false,
      error: null,
    },
    filters: {
      searchQuery: '',
      category: 'all',
      sortOption: 'none' as SortOption,
    },
    favorites: {
      items: [],
    },
  };

  it('selectFilteredProducts should return all products when no filters', () => {
    const result = selectFilteredProducts(mockState);
    expect(result).toHaveLength(3);
  });

  it('selectFilteredProducts should filter by search query', () => {
    const stateWithSearch: RootState = {
      ...mockState,
      filters: {
        ...mockState.filters,
        searchQuery: 'laptop',
      },
    };
    const result = selectFilteredProducts(stateWithSearch);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Laptop Computer');
  });

  it('selectFilteredProducts should filter by category', () => {
    const stateWithCategory: RootState = {
      ...mockState,
      filters: {
        ...mockState.filters,
        category: 'electronics',
      },
    };
    const result = selectFilteredProducts(stateWithCategory);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.category === 'electronics')).toBe(true);
  });

  it('selectFilteredProducts should sort by price ascending', () => {
    const stateWithSort: RootState = {
      ...mockState,
      filters: {
        ...mockState.filters,
        sortOption: 'price-asc' as SortOption,
      },
    };
    const result = selectFilteredProducts(stateWithSort);
    expect(result[0].price).toBe(19.99);
    expect(result[result.length - 1].price).toBe(999.99);
  });

  it('selectFilteredProducts should sort by price descending', () => {
    const stateWithSort: RootState = {
      ...mockState,
      filters: {
        ...mockState.filters,
        sortOption: 'price-desc' as SortOption,
      },
    };
    const result = selectFilteredProducts(stateWithSort);
    expect(result[0].price).toBe(999.99);
    expect(result[result.length - 1].price).toBe(19.99);
  });

  it('selectCategories should return unique sorted categories', () => {
    const result = selectCategories(mockState);
    expect(result).toEqual(['clothing', 'electronics']);
  });

  it('selectIsFavorite should return true if product is favorite', () => {
    const stateWithFavorites: RootState = {
      ...mockState,
      favorites: {
        items: [mockProducts[0]],
      },
    };
    const selector = selectIsFavorite(1);
    expect(selector(stateWithFavorites)).toBe(true);
  });

  it('selectIsFavorite should return false if product is not favorite', () => {
    const selector = selectIsFavorite(1);
    expect(selector(mockState)).toBe(false);
  });
});



