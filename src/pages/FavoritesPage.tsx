import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFavorite } from '@/store/slices/favoritesSlice';
import ProductCard from '@/components/ProductCard';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const handleRemoveFavorite = (productId: number) => {
    dispatch(removeFavorite(productId));
  };

  if (favorites.length === 0) {
    return (
      <div className="card p-12 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Your Favorites</h1>
          <p className="text-slate-600 mb-8">You haven't added any favorites yet. Start exploring and save products you love!</p>
          <Link to="/" className="btn-primary inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Favorites</h1>
        <p className="text-slate-600">
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product, index) => (
          <div key={product.id} className="relative group" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="animate-slide-up">
              <ProductCard product={product} />
            </div>
            <button
              onClick={() => handleRemoveFavorite(product.id)}
              className="absolute top-3 right-3 bg-white text-red-600 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:scale-110 shadow-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
              aria-label={`Remove ${product.title} from favorites`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}



