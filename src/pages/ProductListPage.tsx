import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categories: string[];
}

interface ProductListPageProps {
  category: string;
  onProductClick: (productId: string) => void;
  onBackClick: () => void;
}

export function ProductListPage({ category, onProductClick, onBackClick }: ProductListPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('id, name, price, image, categories')
        .order('id');

      // For categories that have products, filter; otherwise return empty
      if (['dog-products', 'cat-products', 'diy-furniture'].includes(category)) {
        query = query.contains('categories', [category]);
      } else {
        // other-animals, new-collection, about — no products yet
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryNames: { [key: string]: string } = {
    'dog-products': 'Dog Products',
    'cat-products': 'Cat Products',
    'diy-furniture': 'DIY Furniture',
    'other-animals': 'Other Animals',
    'new-collection': 'New Collection',
    'about': 'About Us',
  };

  const isEmpty = !loading && products.length === 0;

  return (
    <div className="min-h-screen bg-[#FDF9F2] pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-4">
          <button
            onClick={onBackClick}
            className="flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {categoryNames[category] || category}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} products available`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-7xl mb-6">🐾</div>
            <h2 className="text-2xl font-light text-gray-700 mb-3">Coming Soon</h2>
            <p className="text-gray-500 max-w-sm">
              We're working on something special for this category. Check back soon!
            </p>
            <button
              onClick={onBackClick}
              className="mt-8 px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => onProductClick(product.id)}
                className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left"
              >
                <div className="relative overflow-hidden h-64 bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors mb-4 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-2xl font-bold text-amber-700">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-amber-700 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
