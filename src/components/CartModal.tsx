import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  product_name: string;
  product_price: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCartUpdate: () => void;
  onCheckout?: (total: number, items: CartItem[]) => void;
}

export function CartModal({ isOpen, onClose, onCartUpdate, onCheckout }: CartModalProps) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && user) loadCart();
    if (isOpen && !user) setLoading(false);
  }, [isOpen, user]);

  const loadCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, product_id, product_name, product_price')
        .eq('user_id', user.id);
      if (error) throw error;
      setCartItems((data as CartItem[]) || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const { error } = await supabase.from('cart_items').update({ quantity: newQuantity }).eq('id', itemId);
      if (error) throw error;
      await loadCart();
      onCartUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (error) throw error;
      await loadCart();
      onCartUpdate();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.product_price || 0) * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;
    setProcessing(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ user_id: user.id, total_amount: total, status: 'pending' })
        .select()
        .maybeSingle();
      if (orderError) throw orderError;
      if (order && onCheckout) onCheckout(total, cartItems);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div
        className="w-full md:max-w-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: 'linear-gradient(135deg, #fdf4f0 0%, #faf5ee 100%)', border: '1px solid rgba(255,255,255,0.6)' }}
      >
        {/* Header */}
        <div className="sticky top-0 p-6 border-b border-[#f0e4dc] z-10" style={{ background: 'rgba(253,244,240,0.95)', backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-[#3b2f2f]">Shopping Cart</h2>
            <button onClick={onClose} className="p-2 hover:bg-[#f2e3e8] rounded-full transition-colors">
              <X className="w-5 h-5 text-[#7a6a60]" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!user ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🐾</div>
              <p className="text-[#7a6a60] mb-4">Please sign in to view your cart</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-[#7a6a60]">Loading...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-[#7a6a60] mb-4">Your cart is empty</p>
              <button onClick={onClose} className="text-[#b96b2c] hover:text-[#a05520] transition-colors text-sm">
                Continue shopping →
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/70 rounded-2xl border border-[#f0e4dc]">
                    <div className="flex-1">
                      <h3 className="font-medium text-[#3b2f2f] text-sm leading-snug">{item.product_name}</h3>
                      <p className="text-[#b96b2c] font-medium mt-1">${item.product_price?.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-xl border border-[#e8d8d0] px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-[#f2e3e8] rounded-lg transition-colors">
                        <Minus className="w-3 h-3 text-[#7a6a60]" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-[#3b2f2f]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-[#f2e3e8] rounded-lg transition-colors">
                        <Plus className="w-3 h-3 text-[#7a6a60]" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#f0e4dc]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-medium text-[#3b2f2f]">Total</span>
                  <span className="text-2xl font-bold text-[#b96b2c]">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full py-3 rounded-2xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #3b2f2f, #5a3e35)' }}
                >
                  {processing ? 'Processing...' : 'Checkout →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
