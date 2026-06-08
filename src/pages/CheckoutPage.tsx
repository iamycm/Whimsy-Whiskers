import { useMemo, useState } from 'react';
import { ChevronLeft, Lock, Check, ShoppingBag } from 'lucide-react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from '../lib/shipping';
import { getStripe, STRIPE_ENABLED, SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/stripe';

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  product_name: string;
  product_price: number;
}

interface CheckoutPageProps {
  total: number;
  items: CartItem[];
  onBackClick: () => void;
  onOrderComplete: () => void;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  apt: string;
  suburb: string;
  state: string;
  postcode: string;
}

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
const inputClass = "w-full px-4 py-3 border border-[#e8d8d0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f2e3e8] bg-white/80 text-[#3b2f2f] placeholder-[#c4b0a8] text-sm";

export function CheckoutPage({ total: subtotal, items, onBackClick, onOrderComplete }: CheckoutPageProps) {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [ship, setShip] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    street: '',
    apt: '',
    suburb: '',
    state: '',
    postcode: '',
  });

  const shippingQuote = useMemo(
    () => calculateShipping(subtotal, ship.postcode),
    [subtotal, ship.postcode]
  );
  const grandTotal = subtotal + shippingQuote.cost;

  const handleShipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'postcode') v = value.replace(/\D/g, '').slice(0, 4);
    if (name === 'phone') v = value.replace(/[^\d +()-]/g, '').slice(0, 20);
    setShip(prev => ({ ...prev, [name]: v }));
  };

  const validateShipping = () => {
    if (!ship.fullName || !ship.phone || !ship.street || !ship.suburb || !ship.state || !ship.postcode) {
      alert('Please complete your shipping address');
      return false;
    }
    if (ship.postcode.length !== 4) { alert('Postcode must be 4 digits'); return false; }
    if (shippingQuote.reason === 'no-postcode') { alert('Enter a valid postcode'); return false; }
    return true;
  };

  const finalizeOrder = async () => {
    const { data: orders } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user?.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

    if (orders && orders.length > 0) {
      await supabase.from('orders').update({
        status: 'paid',
        total_amount: grandTotal,
        subtotal,
        shipping_cost: shippingQuote.cost,
        shipping_address: ship,
      }).eq('id', orders[0].id);
    }
    await supabase.from('cart_items').delete().eq('user_id', user?.id);
    onOrderComplete();
    setPaymentSuccess(true);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f2e3e8 0%, #fdf4f0 40%, #faf5ee 100%)' }}>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center max-w-md mx-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #f2e3e8, #fde8d0)' }}>
            <Check className="w-10 h-10 text-[#b96b2c]" />
          </div>
          <div className="text-4xl mb-4">🐾</div>
          <h1 className="text-3xl font-light text-[#3b2f2f] mb-3">Order placed!</h1>
          <p className="text-[#7a6a60] mb-6 leading-relaxed">
            Thank you for shopping with Whimsy Whiskers.<br />
            Your furry friend is going to love it! 🐶🐱
          </p>
          <p className="text-3xl font-bold text-[#b96b2c] mb-8">${grandTotal.toFixed(2)}</p>
          <button
            onClick={onBackClick}
            className="px-8 py-3 rounded-2xl text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b2f2f, #5a3e35)' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 pb-16" style={{ background: 'linear-gradient(135deg, #f2e3e8 0%, #fdf4f0 40%, #faf5ee 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-[#7a6a60] hover:text-[#3b2f2f] mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm">Back to shopping</span>
        </button>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/60 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f2e3e8, #fde8d0)' }}>
                  <Lock className="w-4 h-4 text-[#b96b2c]" />
                </div>
                <div>
                  <h1 className="text-xl font-light text-[#3b2f2f]">Secure Checkout</h1>
                  <p className="text-xs text-[#b0a09a]">
                    {STRIPE_ENABLED ? 'Test mode — use card 4242 4242 4242 4242' : 'Demo payment — no real charges'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-medium text-[#7a6a60] uppercase tracking-wider mb-4">Shipping Address</h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Full Name" name="fullName" value={ship.fullName} onChange={handleShipChange} className={inputClass} required />
                      <input type="tel" placeholder="Phone" name="phone" value={ship.phone} onChange={handleShipChange} className={inputClass} required />
                    </div>
                    <input
                      type="text"
                      placeholder="Street Address"
                      name="street"
                      value={ship.street}
                      onChange={handleShipChange}
                      className={inputClass}
                      autoComplete="address-line1"
                      required
                    />
                    <input type="text" placeholder="Apt / Unit (optional)" name="apt" value={ship.apt} onChange={handleShipChange} className={inputClass} autoComplete="address-line2" />
                    <div className="grid grid-cols-3 gap-3">
                      <input type="text" placeholder="Suburb" name="suburb" value={ship.suburb} onChange={handleShipChange} className={inputClass} required />
                      <select name="state" value={ship.state} onChange={handleShipChange} className={inputClass} required>
                        <option value="">State</option>
                        {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input type="text" inputMode="numeric" placeholder="Postcode" name="postcode" value={ship.postcode} onChange={handleShipChange} className={inputClass} required />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#f0e4dc]" />

                <PaymentSection
                  grandTotal={grandTotal}
                  processing={processing}
                  setProcessing={setProcessing}
                  validateShipping={validateShipping}
                  finalizeOrder={finalizeOrder}
                  shippingMeta={ship}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/60 p-6 sticky top-36">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-5 h-5 text-[#b96b2c]" />
                <h3 className="text-base font-medium text-[#3b2f2f]">Order Summary</h3>
              </div>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#3b2f2f] font-medium leading-snug line-clamp-2">{item.product_name}</p>
                      <p className="text-xs text-[#b0a09a] mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[#3b2f2f] whitespace-nowrap">
                      ${((item.product_price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#f0e4dc] pt-4 space-y-2">
                <div className="flex justify-between text-sm text-[#7a6a60]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline text-sm">
                  <div className="flex flex-col">
                    <span className="text-[#7a6a60]">Shipping</span>
                    <span className="text-[10px] text-[#b0a09a]">{shippingQuote.label}</span>
                  </div>
                  <span className={`font-medium ${shippingQuote.isFree ? 'text-[#b96b2c]' : 'text-[#3b2f2f]'}`}>
                    {shippingQuote.reason === 'no-postcode'
                      ? '—'
                      : shippingQuote.isFree
                        ? 'Free'
                        : `$${shippingQuote.cost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[#f0e4dc]">
                  <span className="font-bold text-[#3b2f2f]">Total</span>
                  <span className="text-2xl font-bold text-[#b96b2c]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-center text-[#c4b0a8] mt-6">
                🐾 Free shipping Australia-wide on orders over ${FREE_SHIPPING_THRESHOLD}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PaymentSectionProps {
  grandTotal: number;
  processing: boolean;
  setProcessing: (v: boolean) => void;
  validateShipping: () => boolean;
  finalizeOrder: () => Promise<void>;
  shippingMeta: ShippingAddress;
}

function PaymentSection(props: PaymentSectionProps) {
  if (!STRIPE_ENABLED) return <DemoCardForm {...props} />;

  const stripePromise = getStripe();
  if (!stripePromise) return <DemoCardForm {...props} />;

  // Re-key on amount in cents so Elements re-creates the intent if the total shifts.
  const amountCents = Math.max(50, Math.round(props.grandTotal * 100));

  return (
    <Elements
      key={amountCents}
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount: amountCents,
        currency: 'aud',
        appearance: { theme: 'stripe' },
      }}
    >
      <StripePaymentForm {...props} />
    </Elements>
  );
}

function StripePaymentForm({ grandTotal, processing, setProcessing, validateShipping, finalizeOrder, shippingMeta }: PaymentSectionProps) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!validateShipping()) return;

    setProcessing(true);
    try {
      const { error: submitErr } = await elements.submit();
      if (submitErr) {
        alert(submitErr.message);
        return;
      }

      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          amount: grandTotal,
          currency: 'aud',
          metadata: {
            suburb: shippingMeta.suburb,
            postcode: shippingMeta.postcode,
            state: shippingMeta.state,
          },
        }),
      });
      const { clientSecret, error: intentErr } = await res.json();
      if (intentErr || !clientSecret) {
        alert(intentErr || 'Could not start payment. Check Edge Function deployment.');
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.href,
          payment_method_data: {
            billing_details: {
              name: shippingMeta.fullName,
              phone: shippingMeta.phone,
              address: {
                line1: shippingMeta.street,
                line2: shippingMeta.apt,
                city: shippingMeta.suburb,
                state: shippingMeta.state,
                postal_code: shippingMeta.postcode,
                country: 'AU',
              },
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        alert(error.message);
        return;
      }
      await finalizeOrder();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-[#7a6a60] uppercase tracking-wider mb-4">Payment Details</h2>
        <div className="p-4 rounded-xl border border-[#e8d8d0] bg-white/80">
          <PaymentElement options={{ layout: 'tabs' }} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 rounded-2xl text-white font-medium text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        style={{ background: processing ? '#c4a898' : 'linear-gradient(135deg, #3b2f2f, #5a3e35)' }}
      >
        <Lock className="w-4 h-4" />
        {processing ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
      </button>
    </form>
  );
}

function DemoCardForm({ grandTotal, processing, setProcessing, validateShipping, finalizeOrder }: PaymentSectionProps) {
  const [card, setCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
  });

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'cardNumber') v = value.replace(/\D/g, '').slice(0, 16);
    else if (name === 'expiryMonth') v = value.replace(/\D/g, '').slice(0, 2);
    else if (name === 'expiryYear') v = value.replace(/\D/g, '').slice(0, 4);
    else if (name === 'cvv') v = value.replace(/\D/g, '').slice(0, 4);
    setCard(prev => ({ ...prev, [name]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateShipping()) return;
    if (!card.cardNumber || !card.expiryMonth || !card.expiryYear || !card.cvv || !card.cardholderName) {
      alert('Please fill in all payment details');
      return;
    }
    if (card.cardNumber.length !== 16) { alert('Card number must be 16 digits'); return; }
    if (card.cvv.length < 3) { alert('CVV must be 3 digits'); return; }

    setProcessing(true);
    try {
      await finalizeOrder();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-[#7a6a60] uppercase tracking-wider mb-4">Payment Details</h2>
        <div className="space-y-3">
          <input type="text" placeholder="Cardholder Name" name="cardholderName" value={card.cardholderName} onChange={handleCardChange} className={inputClass} required />
          <input type="text" placeholder="Card Number (16 digits)" name="cardNumber" value={card.cardNumber} onChange={handleCardChange} className={inputClass} required />
          <div className="grid grid-cols-3 gap-3">
            <input type="text" placeholder="MM" name="expiryMonth" value={card.expiryMonth} onChange={handleCardChange} className={inputClass} required />
            <input type="text" placeholder="YYYY" name="expiryYear" value={card.expiryYear} onChange={handleCardChange} className={inputClass} required />
            <input type="text" placeholder="CVV" name="cvv" value={card.cvv} onChange={handleCardChange} className={inputClass} required />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="w-full py-4 rounded-2xl text-white font-medium text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        style={{ background: processing ? '#c4a898' : 'linear-gradient(135deg, #3b2f2f, #5a3e35)' }}
      >
        <Lock className="w-4 h-4" />
        {processing ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
      </button>
    </form>
  );
}

