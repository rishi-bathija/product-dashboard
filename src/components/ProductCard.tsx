import { Link } from 'react-router-dom';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="card group flex flex-col overflow-hidden hover:-translate-y-1 animate-slide-up"
      aria-label={`View details for ${product.title}`}
    >
      <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/30 group-hover:to-primary-100/20 transition-all duration-300"></div>
        <img
          src={product.image}
          alt={product.title}
          className="max-w-full max-h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary-700 transition-colors">
          {product.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div>
            <span className="text-2xl font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </div>
            <span className="font-medium text-slate-700">{product.rating.rate}</span>
            <span className="text-slate-400">({product.rating.count})</span>
          </div>
        </div>
        <span className="badge bg-slate-100 text-slate-600 mt-3 self-start">
          {product.category}
        </span>
      </div>
    </Link>
  );
}



