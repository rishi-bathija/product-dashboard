import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductListingPage from '../ProductListingPage';
import productsReducer from '@/store/slices/productsSlice';
import filtersReducer from '@/store/slices/filtersSlice';
import favoritesReducer from '@/store/slices/favoritesSlice';
import { fetchProducts } from '@/store/slices/productsSlice';
import { Product } from '@/types/product';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Laptop',
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
];

vi.mock('@/store/slices/productsSlice', async () => {
  const actual = await vi.importActual('@/store/slices/productsSlice');
  return {
    ...actual,
    fetchProducts: vi.fn(() => ({
      type: 'products/fetchProducts/fulfilled',
      payload: mockProducts,
    })),
  };
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      products: {
        items: [],
        loading: false,
        error: null,
        ...initialState,
      },
      filters: {
        searchQuery: '',
        category: 'all',
        sortOption: 'none',
      },
      favorites: {
        items: [],
      },
    },
  });
};

describe('ProductListingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    const store = createMockStore({ loading: true });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductListingPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const store = createMockStore({ error: 'Failed to load' });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductListingPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Error loading products')).toBeInTheDocument();
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('should render products when loaded', () => {
    const store = createMockStore({ items: mockProducts });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductListingPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
  });

  it('should show no products message when filtered results are empty', () => {
    const store = configureStore({
      reducer: {
        products: productsReducer,
        filters: filtersReducer,
        favorites: favoritesReducer,
      },
      preloadedState: {
        products: {
          items: mockProducts,
          loading: false,
          error: null,
        },
        filters: {
          searchQuery: 'nonexistent',
          category: 'all',
          sortOption: 'none',
        },
        favorites: {
          items: [],
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductListingPage />
        </BrowserRouter>
      </Provider>
    );

    expect(
      screen.getByText('No products found matching your criteria.')
    ).toBeInTheDocument();
  });
});

