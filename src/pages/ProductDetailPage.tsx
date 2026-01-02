import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { selectIsFavorite } from '@/store/selectors';
import { store } from '@/store/store';
import { api } from '@/services/api';
import { Product } from '@/types/product';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector((state) => state.products.items);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFavorite = useAppSelector(selectIsFavorite(product?.id || 0));

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Try to get from Redux store first
        let productData = allProducts.find((p) => p.id === parseInt(id));

        if (!productData) {
          // If not in store, fetch all products first
          if (allProducts.length === 0) {
            await dispatch(fetchProducts());
            const state = store.getState();
            productData = state.products.items.find((p) => p.id === parseInt(id));
          }

          // If still not found, fetch directly from API
          if (!productData) {
            productData = await api.fetchProductById(parseInt(id));
          }
        }

        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, dispatch, allProducts]);

  const handleToggleFavorite = () => {
    if (product) {
      if (isFavorite) {
        dispatch(removeFavorite(product.id));
      } else {
        dispatch(addFavorite(product));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-6 text-slate-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card p-6 border-l-4 border-red-500 bg-red-50/50">
        <p className="font-semibold text-red-900 mb-2">Error</p>
        <p className="text-red-700 mb-4">{error || 'Product not found'}</p>
        <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-6 transition-colors group"
        aria-label="Back to products"
      >
        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </Link>

      <div className="card overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8 md:p-12">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="md:w-1/2 p-8 md:p-10">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight pr-4">
                {product.title}
              </h1>
              <button
                onClick={handleToggleFavorite}
                className="flex-shrink-0 text-3xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-2"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                </div>
                <span className="font-semibold text-slate-900">{product.rating.rate}</span>
                <span className="text-slate-500">({product.rating.count} reviews)</span>
              </div>
              <span className="badge bg-primary-50 text-primary-700 capitalize">
                {product.category}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed text-base">{product.description}</p>
            </div>

            <button
              onClick={handleToggleFavorite}
              className={`btn-primary w-full ${
                isFavorite
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
              }`}
            >
              {isFavorite ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Remove from Favorites
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Add to Favorites
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

