import { loadStripe, type Stripe } from '@stripe/stripe-js';

const KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

let _promise: Promise<Stripe | null> | null = null;
export function getStripe(): Promise<Stripe | null> | null {
  if (!KEY) return null;
  if (!_promise) _promise = loadStripe(KEY);
  return _promise;
}

export const STRIPE_ENABLED = Boolean(KEY);
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
