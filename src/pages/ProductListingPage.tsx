import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { selectFilteredProducts } from '@/store/selectors';
import ProductCard from '@/components/ProductCard';
import SearchAndFilters from '@/components/SearchAndFilters';

export default function ProductListingPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFilteredProducts);
  const loading = useAppSelector((state) => state.products.loading);
  const error = useAppSelector((state) => state.products.error);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-6 text-slate-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 border-l-4 border-red-500 bg-red-50/50">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-red-900 mb-1">Error loading products</p>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Products</h1>
        <p className="text-slate-600">Browse our curated collection of quality products</p>
      </div>
      <SearchAndFilters />
      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-600 text-lg font-medium">No products found matching your criteria.</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div>
          <p className="text-slate-600 mb-6 font-medium">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={product.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



