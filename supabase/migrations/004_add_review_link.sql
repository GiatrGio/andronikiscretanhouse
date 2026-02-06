-- Add review_link column to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_link TEXT DEFAULT '';

-- Update existing reviews with default links based on source
UPDATE reviews SET review_link = 'https://www.airbnb.com/experiences/588791?location=Rethymno%2C%20Crete%2C%20Greece&currentTab=experience_tab&federatedSearchId=a13831c1-c2e6-40ce-bd51-d9353d631895&searchId=8099acdc-de96-41a2-9132-c2bcc995d40c&sectionId=2cae4bf8-1b46-4ac3-b94e-86f47a94815e&source=p2' WHERE source = 'Airbnb';
UPDATE reviews SET review_link = 'https://www.tripadvisor.com/AttractionProductReview-g189429-d16642045-Cretan_Cooking_Class_and_Dinner_Evening_in_a_Rethymno_Home-Kythnos_Cyclades_South_.html#REVIEWS' WHERE source = 'TripAdvisor';
UPDATE reviews SET review_link = 'https://www.viator.com/tours/Cyclades-Islands/COOKING-LESSON-AND-MEAL-BASED-ON-CRETAN-CUISINE/d957-75909P89?mcid=56757' WHERE source = 'Viator';
UPDATE reviews SET review_link = 'https://www.cntraveler.com/story/the-quieter-side-of-crete' WHERE source = 'Conde Nast Traveler';
UPDATE reviews SET review_link = 'https://www.eatwith.com/events/22470?date=2026-04-20' WHERE source = 'Eatwith';
