/*
  # Add sample products for testing
  
  1. Inserts sample pet products into the products table
  2. Provides test data for cart and checkout functionality
*/

INSERT INTO products (name, description, price, category_id, image_url, stock, is_featured, sales_count)
VALUES 
  ('Premium Gold Pet ID Tag', 'Crafted with precision and elegance, this premium gold pet ID tag is the perfect accessory for your beloved companion.', 49.99, NULL, '/item-cream.jpg', 100, true, 0),
  ('Pink Pet Collar', 'Comfortable and stylish pink collar for small to medium sized pets.', 29.99, NULL, '/item-pink.png', 50, true, 0),
  ('White Pet Bed', 'Soft and cozy white pet bed perfect for cats and small dogs.', 39.99, NULL, '/item-white.png', 30, true, 0)
ON CONFLICT DO NOTHING;