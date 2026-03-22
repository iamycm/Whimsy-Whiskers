import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCartUpdate: () => void;
  onCheckout?: (total: number, items: (CartItem & { product: Product })[]) => void;
}

export function CartModal({ isOpen, onClose, onCartUpdate, onCheckout }: CartModalProps) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadCart();
    }
  }, [isOpen, user]);

  const loadCart = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          products(id, name, price, image_url)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        product: item.products
      })) || [];

      setCartItems(formattedData as any);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      await loadCart();
      onCartUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await loadCart();
      onCartUpdate();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;

    setProcessing(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending'
        })
        .select()
        .maybeSingle();

      if (orderError) throw orderError;

      if (order) {
        const orderItems = cartItems.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product?.price || 0
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        if (onCheckout) {
          onCheckout(total, cartItems);
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-2xl md:rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!user ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Please sign in to view your cart</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-rose-400 hover:text-rose-500"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product?.name}</h3>
                      <p className="text-gray-600">${item.product?.price?.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-light">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Pay'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
