import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import productsReducer from '@/store/slices/productsSlice';
import filtersReducer from '@/store/slices/filtersSlice';
import favoritesReducer from '@/store/slices/favoritesSlice';
import { Product } from '@/types/product';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Laptop Computer',
    price: 999.99,
    description: 'A powerful laptop',
    category: 'electronics',
    image: 'https://example.com/laptop.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'T-Shirt',
    price: 19.99,
    description: 'A comfortable t-shirt',
    category: 'clothing',
    image: 'https://example.com/tshirt.jpg',
    rating: { rate: 4.0, count: 50 },
  },
  {
    id: 3,
    title: 'Mobile Phone',
    price: 599.99,
    description: 'A smartphone',
    category: 'electronics',
    image: 'https://example.com/phone.jpg',
    rating: { rate: 4.8, count: 200 },
  },
];

const createMockStore = () => {
  return configureStore({
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

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Search functionality', () => {
    it('should filter products by search query', async () => {
      const user = userEvent.setup({ delay: null });
      const store = createMockStore();
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );

      // All products should be visible
      expect(screen.getByText('Laptop Computer')).toBeInTheDocument();
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
      expect(screen.getByText('Mobile Phone')).toBeInTheDocument();

      // Type in search box
      const searchInput = screen.getByLabelText('Search Products');
      await user.type(searchInput, 'laptop');

      // Advance timers for debounce
      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(screen.getByText('Laptop Computer')).toBeInTheDocument();
        expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
        expect(screen.queryByText('Mobile Phone')).not.toBeInTheDocument();
      });
    });
  });

  describe('Category filter functionality', () => {
    it('should filter products by category', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );

      // All products should be visible
      expect(screen.getByText('Laptop Computer')).toBeInTheDocument();
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();

      // Select electronics category
      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'electronics');

      await waitFor(() => {
        expect(screen.getByText('Laptop Computer')).toBeInTheDocument();
        expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
        expect(screen.getByText('Mobile Phone')).toBeInTheDocument();
      });
    });
  });

  describe('Sort functionality', () => {
    it('should sort products by price ascending', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );

      // Select sort option
      const sortSelect = screen.getByLabelText('Sort By Price');
      await user.selectOptions(sortSelect, 'price-asc');

      await waitFor(() => {
        const productCards = screen.getAllByText(/\$\d+\.\d{2}/);
        // First product should be cheapest
        expect(productCards[0].textContent).toBe('$19.99');
      });
    });

    it('should sort products by price descending', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );

      // Select sort option
      const sortSelect = screen.getByLabelText('Sort By Price');
      await user.selectOptions(sortSelect, 'price-desc');

      await waitFor(() => {
        const productCards = screen.getAllByText(/\$\d+\.\d{2}/);
        // First product should be most expensive
        expect(productCards[0].textContent).toBe('$999.99');
      });
    });
  });

  describe('Favorites functionality', () => {
    it('should add product to favorites and show in favorites page', async () => {
      const user = userEvent.setup();
      const store = createMockStore();
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );

      // Click on first product
      const productLink = screen.getByText('Laptop Computer').closest('a');
      if (productLink) {
        await user.click(productLink);
      }

      await waitFor(() => {
        expect(screen.getByText(/Laptop Computer/i)).toBeInTheDocument();
      });

      // Add to favorites
      const favoriteButton = screen.getByRole('button', {
        name: /add to favorites/i,
      });
      await user.click(favoriteButton);

      // Navigate to favorites page
      const favoritesLink = screen.getByText('Favorites');
      await user.click(favoritesLink);

      await waitFor(() => {
        expect(screen.getByText(/Favorites \(1\)/i)).toBeInTheDocument();
        expect(screen.getByText('Laptop Computer')).toBeInTheDocument();
      });
    });

    it('should remove product from favorites', async () => {
      const user = userEvent.setup();
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
            searchQuery: '',
            category: 'all',
            sortOption: 'none',
          },
          favorites: {
            items: [mockProducts[0]],
          },
        },
      });
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );

      // Navigate to favorites
      const favoritesLink = screen.getByText('Favorites');
      await user.click(favoritesLink);

      await waitFor(() => {
        expect(screen.getByText('Laptop Computer')).toBeInTheDocument();
      });

      // Remove from favorites (hover to show button, then click)
      const removeButton = screen.getByRole('button', {
        name: /remove laptop computer from favorites/i,
      });
      await user.click(removeButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Laptop Computer')
        ).not.toBeInTheDocument();
        expect(
          screen.getByText("You haven't added any favorites yet.")
        ).toBeInTheDocument();
      });
    });
  });

  describe('Combined filters', () => {
    it('should work with search, category, and sort together', async () => {
      const user = userEvent.setup({ delay: null });
      const store = createMockStore();
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );

      // Set category filter
      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'electronics');

      // Set search query
      const searchInput = screen.getByLabelText('Search Products');
      await user.type(searchInput, 'mobile');

      // Set sort
      const sortSelect = screen.getByLabelText('Sort By Price');
      await user.selectOptions(sortSelect, 'price-desc');

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        // Should only show Mobile Phone
        expect(screen.getByText('Mobile Phone')).toBeInTheDocument();
        expect(screen.queryByText('Laptop Computer')).not.toBeInTheDocument();
        expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
      });
    });
  });
});

