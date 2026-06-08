// Supabase Edge Function: creates a Stripe PaymentIntent.
// Deploy with: `supabase functions deploy create-payment-intent`
// Set secret:  `supabase secrets set STRIPE_SECRET_KEY=sk_test_...`
//
// Or via Supabase Dashboard → Edge Functions → New Function → paste this code,
// then Settings → Secrets → add STRIPE_SECRET_KEY.

// @ts-expect-error deno remote import
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno';
// @ts-expect-error deno remote import
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

// @ts-expect-error Deno is available in Supabase Edge runtime
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  // @ts-expect-error fetch http client for Deno
  httpClient: Stripe.createFetchHttpClient(),
});

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { amount, currency = 'aud', metadata } = await req.json();
    if (typeof amount !== 'number' || amount < 0.5) {
      return json({ error: 'Invalid amount' }, 400);
    }
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // dollars → cents
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: metadata ?? {},
    });
    return json({ clientSecret: intent.client_secret });
  } catch (err) {
    return json({ error: (err as Error).message ?? String(err) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'content-type': 'application/json' },
  });
}
