import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Share2, PawPrint } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getGalleryImages } from '../data/productGallery';

interface ProductDetailPageProps {
  productId: string;
  onBackClick: () => void;
  onCartUpdate: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  in_stock: boolean;
  shipping_info: string;
  return_policy: string;
}

export function ProductDetailPage({ productId, onBackClick, onCartUpdate }: ProductDetailPageProps) {
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showCartMessage, setShowCartMessage] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please sign in to add items to your cart');
      return;
    }
    if (!product) return;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #FCF8EE 0%, #FDF9F2 55%, #FFFFFF 100%)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🐾</div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #FCF8EE 0%, #FDF9F2 55%, #FFFFFF 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-12">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
          <div className="flex items-center justify-center p-8">
            <img src={product.image} alt={product.name} className="max-w-full h-auto object-contain max-h-96" />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-amber-700 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-900"><strong>Free Shipping:</strong> {product.shipping_info}</p>
                <p className="text-sm text-gray-900 mt-2"><strong>Returns:</strong> {product.return_policy}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">${product.price.toFixed(2)}</div>
                <span className={`text-sm font-medium ${product.in_stock ? 'text-[#b96b2c]' : 'text-red-500'}`}>
                  {product.in_stock ? '✓ In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">−</button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !product.in_stock}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-700 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors disabled:opacity-50"
                >
                  <ShoppingCart size={20} />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
              {showCartMessage && (
                <div className="p-4 rounded-lg text-center font-medium" style={{ background: '#fdf4f0', border: '1px solid #e8d8d0', color: '#b96b2c' }}>
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

        {(() => {
          const galleryImages = getGalleryImages(product.id);
          if (galleryImages.length === 0) return null;
          return (
            <section className="mt-12 px-8 py-10 rounded-2xl" style={{ background: '#FCF8EE' }}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <PawPrint size={24} className="text-amber-700" />
                  Product Details
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Thoughtfully designed for comfort, control and everyday adventures.
                </p>
              </div>
              <div className="flex flex-col gap-6 items-center">
                {galleryImages.map((src, idx) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${product.name} detail ${idx + 1}`}
                    loading="lazy"
                    className="w-full max-w-2xl h-auto block"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                ))}
              </div>
            </section>
          );
        })()}

        <div className="mt-12 rounded-lg shadow-lg p-8 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-gray-200 pb-3">
                <span className="font-medium text-gray-700">{key}</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-lg shadow-lg p-8 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="text-center py-12 text-gray-600">
            <p>Customer reviews coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
