import { describe, it, expect, beforeEach, vi } from 'vitest';
import productsReducer, { fetchProducts } from '../productsSlice';
import { Product } from '@/types/product';
import { api } from '@/services/api';

vi.mock('@/services/api');

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product',
    price: 19.99,
    description: 'Test description',
    category: 'electronics',
    image: 'https://example.com/image.jpg',
    rating: { rate: 4.5, count: 100 },
  },
];

describe('productsSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const state = productsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      items: [],
      loading: false,
      error: null,
    });
  });

  it('should handle fetchProducts.pending', () => {
    const action = { type: fetchProducts.pending.type };
    const state = productsReducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle fetchProducts.fulfilled', () => {
    const initialState = {
      items: [],
      loading: true,
      error: null,
    };
    const action = {
      type: fetchProducts.fulfilled.type,
      payload: mockProducts,
    };
    const state = productsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockProducts);
    expect(state.error).toBe(null);
  });

  it('should handle fetchProducts.rejected', () => {
    const initialState = {
      items: [],
      loading: true,
      error: null,
    };
    const action = {
      type: fetchProducts.rejected.type,
      error: { message: 'Failed to fetch' },
    };
    const state = productsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });

  it('should fetch products successfully', async () => {
    vi.mocked(api.fetchProducts).mockResolvedValue(mockProducts);
    
    const dispatch = vi.fn();
    const getState = vi.fn();
    
    await fetchProducts()(dispatch, getState, undefined);
    
    expect(api.fetchProducts).toHaveBeenCalled();
  });
});



