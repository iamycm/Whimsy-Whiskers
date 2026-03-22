import { useState } from 'react';
import { ChevronLeft, Lock, Check } from 'lucide-react';
import { CartItem, Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface CheckoutPageProps {
  total: number;
  items: (CartItem & { product: Product })[];
  onBackClick: () => void;
}

export function CheckoutPage({ total, items, onBackClick }: CheckoutPageProps) {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'cardNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'expiryMonth') {
      processedValue = value.replace(/\D/g, '').slice(0, 2);
    } else if (name === 'expiryYear') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'cvv') {
      processedValue = value.replace(/\D/g, '').slice(0, 3);
    } else if (name === 'zipCode') {
      processedValue = value.replace(/\D/g, '').slice(0, 5);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.cardNumber ||
      !formData.expiryMonth ||
      !formData.expiryYear ||
      !formData.cvv ||
      !formData.cardholderName
    ) {
      alert('Please fill in all payment details');
      return;
    }

    if (formData.cardNumber.length !== 16) {
      alert('Card number must be 16 digits');
      return;
    }

    if (formData.cvv.length !== 3) {
      alert('CVV must be 3 digits');
      return;
    }

    setProcessing(true);
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (orders && orders.length > 0) {
        const orderId = orders[0].id;

        const { error } = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId);

        if (error) throw error;

        const { error: deleteError } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user?.id);

        if (deleteError) throw deleteError;

        setPaymentSuccess(true);

        setTimeout(() => {
          onBackClick();
        }, 3000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-light mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-2">
              Thank you for your purchase.
            </p>
            <p className="text-lg font-semibold text-gray-900">
              ${total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to home page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-3xl font-light mb-8">Checkout</h1>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Billing Address</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      name="cardholderName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.billingAddress}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, billingAddress: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                      required
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData(prev => ({ ...prev, city: e.target.value }))
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData(prev => ({ ...prev, state: e.target.value }))
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        name="zipCode"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-lg font-medium mb-4">Payment Information</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      name="cardholderName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Card Number (16 digits)"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      name="cardNumber"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                      required
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="MM"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                        name="expiryMonth"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      />
                      <input
                        type="text"
                        placeholder="YYYY"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                        name="expiryYear"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        name="cvv"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  {processing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-6 text-center">
                This is a demo payment form. No actual charges will be made.
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-32">
              <h3 className="text-lg font-medium mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product?.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-light">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
