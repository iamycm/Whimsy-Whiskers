import { Home, ArrowLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductListPageProps {
  category: string;
  onProductClick: (productId: string) => void;
  onBackClick: () => void;
}

export function ProductListPage({
  category,
  onProductClick,
  onBackClick,
}: ProductListPageProps) {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Premium Gold Pet ID Tag',
      price: 49.99,
      image: '/item-cream.png',
      category: 'dog-best-sellers',
    },
  ];

  const categoryNames: { [key: string]: string } = {
    'dog-best-sellers': 'Dog Best Sellers',
    'cat-products': 'Cat Products',
    'toys': 'Toys & Games',
    'accessories': 'Accessories',
  };

  const filteredProducts = mockProducts.filter((p) => p.category === category);

  return (
    /*背景颜色 */
    /*白色*/
    /* <div className="min-h-screen bg-white">*/
    
    <div className="min-h-screen bg-[#FDF9F2] pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={onBackClick}
            className="flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {categoryNames[category] || category}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} product available
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
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
                  <span className="text-amber-700 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}