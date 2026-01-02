# Product Dashboard

A modern product dashboard application built with React, Redux Toolkit, and TypeScript. This application demonstrates proficiency in building frontend applications with state management, API integration, and comprehensive testing.

## Features

- **Product Listing Page**: Displays product cards in a responsive grid layout
- **Search & Filter**:
  - Debounced search by product title
  - Filter by category
  - Sort by price (ascending/descending)
- **Product Detail Page**: Shows complete product information with favorite functionality
- **Favorites Page**: View and manage favorited products
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Accessible UI**: Proper ARIA labels and keyboard navigation support

## Tech Stack

- **React 18** - UI library with functional components and hooks
- **Redux Toolkit** - State management with slices and async thunks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Testing framework
- **Testing Library** - Component and integration testing

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd product-dashboard
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Testing

Run unit and integration tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── ProductCard.tsx # Product card component
│   └── SearchAndFilters.tsx # Search and filter controls
├── pages/              # Page components
│   ├── ProductListingPage.tsx
│   ├── ProductDetailPage.tsx
│   └── FavoritesPage.tsx
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices
│   │   ├── productsSlice.ts
│   │   ├── filtersSlice.ts
│   │   └── favoritesSlice.ts
│   ├── selectors.ts    # Redux selectors
│   ├── store.ts        # Store configuration
│   └── hooks.ts        # Typed Redux hooks
├── services/           # API services
│   └── api.ts          # Fake Store API integration
├── hooks/              # Custom React hooks
│   └── useDebounce.ts  # Debounce hook
├── types/              # TypeScript type definitions
│   └── product.ts      # Product types
└── test/               # Test setup
    └── setup.ts        # Vitest configuration
```

## API Integration

The application uses the [Fake Store API](https://fakestoreapi.com) to fetch product data:

- `GET /products` - Fetch all products
- `GET /products/:id` - Fetch single product
- `GET /products/categories` - Fetch categories

## State Management

The application uses Redux Toolkit with the following slices:

1. **productsSlice**: Manages product data and loading states
2. **filtersSlice**: Manages search query, category filter, and sort options
3. **favoritesSlice**: Manages favorite products

Selectors are used for derived state and memoized filtering/sorting logic.

## Testing Strategy

- **Unit Tests**: Test Redux slices, selectors, and individual components
- **Integration Tests**: Test end-to-end user flows (search, filter, favorites)
- **Coverage**: Aim for high test coverage on critical business logic

## Deployment

The application can be deployed to:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder or connect Git
- **Render**: Connect repository and set build command to `npm run build`

## Performance Optimizations

- Debounced search to reduce API calls
- Memoized selectors for efficient filtering
- Lazy loading images
- Code splitting with React Router

## Accessibility Features

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators for better UX

## Future Enhancements

- Pagination for large product lists
- Advanced filtering options
- Product comparison feature
- User authentication and persistent favorites
- Dark mode theme

## License

MIT

## Author

Built as part of a frontend developer assessment.



