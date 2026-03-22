import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProductDetailPageProps {
  productId: string;
  onBackClick: () => void;
  onCartUpdate: () => void;
}

export function ProductDetailPage({
  productId,
  onBackClick,
  onCartUpdate,
}: ProductDetailPageProps) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showCartMessage, setShowCartMessage] = useState(false);

  const mockProductDetails: { [key: string]: any } = {
    '1': {
      id: '1',
      name: 'Premium Gold Pet ID Tag',
      price: 49.99,
      image: '/item-cream.png',
      category: 'Dog Accessories',
      rating: 4.8,
      reviews: 342,
      description:
        "Crafted with precision and elegance, this premium gold pet ID tag is the perfect accessory for your beloved companion. Made from durable brass with a protective gold coating, it ensures your pet's safety while looking absolutely stunning.",
      features: [
        'Durable brass construction with gold plating',
        'Engravable surface for custom pet information',
        'Weather-resistant design',
        'Includes secure D-ring attachment',
        'Lightweight and comfortable for all-day wear',
        'Perfect gift for pet lovers',
      ],
      specifications: {
        Material: 'Brass with Gold Plating',
        Size: '1.2" x 1.2" (30mm x 30mm)',
        Weight: '8g',
        Color: 'Gold',
        Shape: 'Circular',
      },
      inStock: true,
      shippingInfo:
        'Free shipping on orders over $50. Arrives in 3-5 business days.',
      returnPolicy: '30-day money-back guarantee',
    },
  };

  const product = mockProductDetails[productId];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Product not found</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please sign in to add items to your cart');
      return;
    }

    setIsAddingToCart(true);

    try {
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
      } else {
        await supabase.from('cart_items').insert({
          user_id: user.id,
          product_id: productId,
          product_name: product.name,
          product_price: product.price,
          quantity,
        });
      }

      setShowCartMessage(true);
      onCartUpdate();
      setTimeout(() => setShowCartMessage(false), 3000);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(to bottom, #FCF8EE 0%, #FDF9F2 55%, #FFFFFF 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-0 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
          <div className="flex items-center justify-center p-8">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full h-auto object-contain max-h-96"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="font-semibold text-gray-900">
                    {product.rating}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({product.reviews} customer reviews)
                </span>
              </div>

              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <span className="text-amber-700 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-900">
                  <strong>Free Shipping:</strong> {product.shippingInfo}
                </p>
                <p className="text-sm text-gray-900 mt-2">
                  <strong>Returns:</strong> {product.returnPolicy}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  ${product.price.toFixed(2)}
                </div>
                <span
                  className={`text-sm font-medium ${
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.inStock ? '✓ In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !product.inStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-700 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
                >
                  <ShoppingCart size={20} />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              {showCartMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-900 text-center font-medium">
                  Added to cart successfully!
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <Heart size={20} />
                  <span>Wishlist</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-lg shadow-lg p-8 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(
              ([key, value]: [string, any]) => (
                <div
                  key={key}
                  className="flex justify-between border-b border-gray-200 pb-3"
                >
                  <span className="font-medium text-gray-700">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-12 rounded-lg shadow-lg p-8 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>
          <div className="text-center py-12 text-gray-600">
            <p>Customer reviews coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}