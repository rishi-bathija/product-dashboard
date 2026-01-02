import { describe, it, expect } from 'vitest';
import favoritesReducer, { addFavorite, removeFavorite } from '../favoritesSlice';
import { Product } from '@/types/product';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 19.99,
  description: 'Test description',
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: { rate: 4.5, count: 100 },
};

const mockProduct2: Product = {
  id: 2,
  title: 'Test Product 2',
  price: 29.99,
  description: 'Test description 2',
  category: 'clothing',
  image: 'https://example.com/image2.jpg',
  rating: { rate: 4.0, count: 50 },
};

describe('favoritesSlice', () => {
  it('should return initial state', () => {
    const state = favoritesReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      items: [],
    });
  });

  it('should handle addFavorite', () => {
    const initialState = { items: [] };
    const action = addFavorite(mockProduct);
    const state = favoritesReducer(initialState, action);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockProduct);
  });

  it('should not add duplicate favorites', () => {
    const initialState = { items: [mockProduct] };
    const action = addFavorite(mockProduct);
    const state = favoritesReducer(initialState, action);
    expect(state.items).toHaveLength(1);
  });

  it('should handle removeFavorite', () => {
    const initialState = { items: [mockProduct, mockProduct2] };
    const action = removeFavorite(1);
    const state = favoritesReducer(initialState, action);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockProduct2);
  });

  it('should handle removeFavorite when item does not exist', () => {
    const initialState = { items: [mockProduct] };
    const action = removeFavorite(999);
    const state = favoritesReducer(initialState, action);
    expect(state.items).toHaveLength(1);
  });
});



