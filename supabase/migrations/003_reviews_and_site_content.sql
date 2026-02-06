-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  review_date DATE NOT NULL,
  text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Airbnb',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_content table for editable text blocks
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed existing reviews (source = Airbnb)
INSERT INTO reviews (name, review_date, text, source, is_featured) VALUES
  ('Tanja', '2018-08-01', 'Great cooking experience! Androniki and Pantelis welcomed us into their beautiful home. We learned to make traditional Cretan dishes and enjoyed a wonderful meal together. Highly recommended!', 'Airbnb', TRUE),
  ('Catherine V.', '2019-05-01', 'The best Cretan cooking experience you can find! From the moment we arrived, we felt like family. The food was incredible, the setting was magical, and we left with recipes we''ll cherish forever.', 'Airbnb', TRUE),
  ('Melnoel22', '2018-07-01', 'Cretan Cooking Dream! An authentic experience that exceeded all expectations. Learning to cook in the wood oven while surrounded by the beautiful garden was unforgettable.', 'Airbnb', FALSE),
  ('Jennifer', '2019-09-01', 'A highlight of our trip to Crete! Androniki is a wonderful teacher and her passion for Cretan cuisine shines through. The courtyard setting is absolutely beautiful.', 'Airbnb', FALSE),
  ('Amit', '2019-09-01', 'Perfect experience from start to finish. We learned so much about Cretan food culture and came away with amazing recipes. The hospitality was second to none.', 'Airbnb', FALSE),
  ('Lieke', '2018-10-01', 'An unforgettable afternoon! The cooking class was hands-on and fun, and the meal we prepared together was delicious. Androniki and Pantelis are wonderful hosts.', 'Airbnb', FALSE),
  ('Zoe', '2020-07-01', 'Authentic and genuine! This was the most authentic cultural experience we had in Crete. Learning traditional recipes passed down through generations was special.', 'Airbnb', FALSE);

-- Seed reviews hero text
INSERT INTO site_content (id, content) VALUES
  ('reviews_hero_text', 'Every year, we have hosted many good and kind people in our house from the furthest parts of our planet. We share with them memories, experiences and we enjoy so many pleasant, relaxed and delicious moments.

For our guests, the hospitality in our home is a sweet memory of their vacation, but their wonderful, noble reviews are a valuable gift for us. They give us the strength to continue to host people in the unique way of Cretan traditional hospitality. So, the best way to get to know us is through our visitors'' nice comments.');
