import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import SearchAndFilters from '../SearchAndFilters';
import productsReducer from '@/store/slices/productsSlice';
import filtersReducer from '@/store/slices/filtersSlice';
import favoritesReducer from '@/store/slices/favoritesSlice';
import { SortOption } from '@/types/product';

const createMockStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      products: {
        items: [
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
        ],
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
    },
  });
};

describe('SearchAndFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render search input, category select, and sort select', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchAndFilters />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText('Search Products')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort By Price')).toBeInTheDocument();
  });

  it('should update search query with debounce', async () => {
    const user = userEvent.setup({ delay: null });
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchAndFilters />
        </BrowserRouter>
      </Provider>
    );

    const searchInput = screen.getByLabelText('Search Products');
    await user.type(searchInput, 'laptop');

    // Before debounce
    expect(store.getState().filters.searchQuery).toBe('');

    // After debounce
    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('laptop');
    });
  });

  it('should update category filter', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchAndFilters />
        </BrowserRouter>
      </Provider>
    );

    const categorySelect = screen.getByLabelText('Category');
    await user.selectOptions(categorySelect, 'electronics');

    expect(store.getState().filters.category).toBe('electronics');
  });

  it('should update sort option', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchAndFilters />
        </BrowserRouter>
      </Provider>
    );

    const sortSelect = screen.getByLabelText('Sort By Price');
    await user.selectOptions(sortSelect, 'price-asc');

    expect(store.getState().filters.sortOption).toBe('price-asc');
  });
});

