interface CategorySectionProps {
  onCategoryClick: (category: string) => void;
}

export function CategorySection({ onCategoryClick }: CategorySectionProps) {
  const categories = [
    { id: 'dog-best-sellers', name: 'Dog Best Sellers', icon: '🐕' },
    { id: 'cat-products', name: 'Cat Products', icon: '🐈' },
    { id: 'toys', name: 'Toys & Games', icon: '🎾' },
    { id: 'accessories', name: 'Accessories', icon: '👜' },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center hover:scale-105 transform"
            >
              <div className="text-5xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2 group-hover:text-gray-900 transition-colors">
                Explore products →
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
