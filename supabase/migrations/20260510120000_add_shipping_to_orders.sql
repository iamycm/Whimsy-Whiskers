-- Adds shipping address + shipping cost + subtotal to orders.
-- Run this in the Supabase SQL Editor (Dashboard → SQL).

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS subtotal numeric(10, 2),
  ADD COLUMN IF NOT EXISTS shipping_cost numeric(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_address jsonb;

COMMENT ON COLUMN orders.shipping_address IS
  'JSON: { fullName, phone, street, apt, suburb, state, postcode }';
