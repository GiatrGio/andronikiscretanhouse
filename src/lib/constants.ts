export const SITE_NAME = "Androniki's Cretan House";
export const SITE_DESCRIPTION = "Authentic Cretan Cooking Classes in Rethymno, Crete";

export const CONTACT_INFO = {
  phone: "+30 6948247099",
  phoneDisplay: "+30 694 824 7099",
  email: "andronikiscretanhouse@gmail.com",
  address: "Loutra, Rethymno, Crete, Greece",
  season: "April 20 - October 9",
  googleMapsUrl: "https://maps.google.com/?q=Loutra+Rethymno+Crete",
};

export const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/courses/availability", label: "Availability" },
  { href: "/about", label: "About Us" },
  { href: "/recipes", label: "Recipes" },
  { href: "/reviews", label: "Reviews" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const COURSE_DETAILS = {
  season: "April 20th to October 9th",
  maxGroupSize: 8,
  maxPrivateGroupSize: 12,
  bookingDeadline: "2 days before the event",
  duration: "Approximately 4 hours (including meal)",
  included: ["Written recipes", "Traditional souvenirs", "Full meal with wine"],
};

export const REVIEWS = [
  {
    id: 1,
    name: "Tanja",
    date: "August 2018",
    rating: 5,
    text: "Great cooking experience! Androniki and Pantelis welcomed us into their beautiful home. We learned to make traditional Cretan dishes and enjoyed a wonderful meal together. Highly recommended!",
    country: "Germany",
  },
  {
    id: 2,
    name: "Catherine V.",
    date: "May 2019",
    rating: 5,
    text: "The best Cretan cooking experience you can find! From the moment we arrived, we felt like family. The food was incredible, the setting was magical, and we left with recipes we'll cherish forever.",
    country: "France",
  },
  {
    id: 3,
    name: "Melnoel22",
    date: "July 2018",
    rating: 5,
    text: "Cretan Cooking Dream! An authentic experience that exceeded all expectations. Learning to cook in the wood oven while surrounded by the beautiful garden was unforgettable.",
    country: "USA",
  },
  {
    id: 4,
    name: "Jennifer",
    date: "September 2019",
    rating: 5,
    text: "A highlight of our trip to Crete! Androniki is a wonderful teacher and her passion for Cretan cuisine shines through. The courtyard setting is absolutely beautiful.",
    country: "UK",
  },
  {
    id: 5,
    name: "Amit",
    date: "September 2019",
    rating: 5,
    text: "Perfect experience from start to finish. We learned so much about Cretan food culture and came away with amazing recipes. The hospitality was second to none.",
    country: "India",
  },
  {
    id: 6,
    name: "Lieke",
    date: "October 2018",
    rating: 5,
    text: "An unforgettable afternoon! The cooking class was hands-on and fun, and the meal we prepared together was delicious. Androniki and Pantelis are wonderful hosts.",
    country: "Netherlands",
  },
  {
    id: 7,
    name: "Zoe",
    date: "July 2020",
    rating: 5,
    text: "Authentic and genuine! This was the most authentic cultural experience we had in Crete. Learning traditional recipes passed down through generations was special.",
    country: "Australia",
  },
];

// Recipe types matching JSON structure
export interface RecipeInstruction {
  step: number;
  type: "text" | "photo";
  value: string;
}

export interface RecipeIngredientGroup {
  group?: string;
  items: string[];
}

export interface RecipeSummary {
  id: number;
  slug: string;
  title: string;
  summary: string;
  preparation_time: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  main_photo: string;
}

export interface Recipe extends RecipeSummary {
  serves: string;
  ingredients: RecipeIngredientGroup[];
  instructions: RecipeInstruction[];
  tips_and_notes: string[];
}


export const RECIPES: Recipe[] = [
  {
    id: 1,
    name: "Traditional Moussaka",
    slug: "traditional-moussaka",
    description: "Layers of eggplant, spiced meat sauce, and creamy bechamel, baked to perfection.",
    difficulty: "Medium",
    prepTime: "45 min",
    cookTime: "45 min",
    totalTime: "90 min",
    servings: "6-8",
    category: "Main Courses",
    ingredients: [
      {
        group: "For the Eggplant Layer",
        items: [
          "3 large eggplants, sliced into 1/2 inch rounds",
          "1/2 cup olive oil",
          "Salt to taste",
        ],
      },
      {
        group: "For the Meat Sauce",
        items: [
          "2 lbs ground lamb or beef",
          "1 large onion, finely chopped",
          "3 cloves garlic, minced",
          "1 can (14 oz) crushed tomatoes",
          "2 tbsp tomato paste",
          "1/2 cup red wine",
          "1 tsp cinnamon",
          "1/2 tsp nutmeg",
          "2 bay leaves",
          "Salt and pepper to taste",
        ],
      },
      {
        group: "For the Bechamel Sauce",
        items: [
          "6 tbsp butter",
          "1/2 cup all-purpose flour",
          "4 cups whole milk, warmed",
          "3 egg yolks",
          "1 cup grated kefalotyri or parmesan cheese",
          "Pinch of nutmeg",
        ],
      },
    ],
    instructions: [
      {
        text: "Preheat oven to 375°F (190°C). Brush eggplant slices with olive oil and arrange on baking sheets. Sprinkle with salt and bake for 20 minutes until golden. Set aside.",
        images: ["/images/recipes/moussaka-step1.jpg"],
      },
      {
        text: "In a large pan, brown the ground meat over medium-high heat. Add onions and garlic, cook until softened.",
      },
      {
        text: "Add tomatoes, tomato paste, wine, cinnamon, nutmeg, and bay leaves. Simmer for 30 minutes until sauce thickens. Season with salt and pepper.",
        images: ["/images/recipes/moussaka-step3-1.jpg", "/images/recipes/moussaka-step3-2.jpg"],
      },
      {
        text: "For the bechamel, melt butter in a saucepan. Whisk in flour and cook for 2 minutes. Gradually add warm milk, whisking constantly until smooth and thick.",
      },
      {
        text: "Remove from heat. Whisk egg yolks in a bowl, then slowly add some hot bechamel to temper. Pour egg mixture back into the sauce, add cheese and nutmeg. Stir well.",
      },
      {
        text: "In a 9x13 inch baking dish, layer half the eggplant, then all the meat sauce, then remaining eggplant. Pour bechamel over the top, spreading evenly.",
        images: ["/images/recipes/moussaka-step6-1.jpg", "/images/recipes/moussaka-step6-2.jpg"],
      },
      {
        text: "Bake for 45 minutes until golden brown and bubbling. Let rest for 15 minutes before cutting and serving.",
        images: ["/images/recipes/moussaka-step7.jpg"],
      },
    ],
    tips: [
      "Salting the eggplant before baking helps remove bitterness and excess moisture",
      "Make the meat sauce a day ahead for deeper flavors",
      "Let the moussaka rest after baking so it sets properly and is easier to slice",
    ],
  },
  {
    id: 2,
    name: "Wood Oven Bread",
    slug: "wood-oven-bread",
    description: "Crusty artisan bread baked in our traditional wood-fired oven.",
    difficulty: "Easy",
    prepTime: "30 min",
    cookTime: "30 min",
    totalTime: "3 hours",
    servings: "2 loaves",
    category: "Breads",
    ingredients: [
      {
        items: [
          "4 cups bread flour",
          "2 tsp active dry yeast",
          "2 tsp salt",
          "1 3/4 cups warm water",
          "2 tbsp olive oil",
          "1 tbsp honey",
        ],
      },
    ],
    instructions: [
      {
        text: "In a large bowl, combine warm water, yeast, and honey. Let stand for 5 minutes until foamy.",
      },
      {
        text: "Add flour, salt, and olive oil. Mix until a shaggy dough forms.",
      },
      {
        text: "Turn dough onto a floured surface and knead for 10 minutes until smooth and elastic.",
        images: ["/images/recipes/bread-step3.jpg"],
      },
      {
        text: "Place in an oiled bowl, cover with a damp cloth, and let rise in a warm place for 1.5-2 hours until doubled.",
        images: ["/images/recipes/bread-step4-1.jpg", "/images/recipes/bread-step4-2.jpg"],
      },
      {
        text: "Punch down the dough and divide into 2 pieces. Shape into round loaves.",
      },
      {
        text: "Place on a floured surface, cover, and let rise for another 30-45 minutes.",
      },
      {
        text: "Preheat your oven to 450°F (230°C). If using a wood oven, ensure it reaches about 400°F.",
      },
      {
        text: "Score the tops with a sharp knife. Bake for 25-30 minutes until golden brown and hollow-sounding when tapped.",
        images: ["/images/recipes/bread-step8.jpg"],
      },
      {
        text: "Cool on a wire rack before slicing.",
      },
    ],
    tips: [
      "The dough should be slightly sticky - resist adding too much flour",
      "Steam in the oven creates a crispy crust - place a pan of water in the bottom of the oven",
      "Wood-fired ovens give the best flavor, but a home oven works well too",
    ],
  },
  {
    id: 3,
    name: "Homemade Cheese",
    slug: "homemade-cheese",
    description: "Fresh, creamy cheese made using traditional Cretan methods.",
    difficulty: "Medium",
    prepTime: "30 min",
    cookTime: "30 min",
    totalTime: "4 hours",
    servings: "1 lb cheese",
    category: "Appetizers",
    ingredients: [
      {
        items: [
          "1 gallon whole milk",
          "1/4 cup fresh lemon juice or white vinegar",
          "1 tsp salt",
          "Cheesecloth",
        ],
      },
    ],
    instructions: [
      {
        text: "Pour milk into a large pot and heat over medium heat, stirring occasionally to prevent scorching.",
      },
      {
        text: "When milk reaches 185°F (85°C) or just before boiling, remove from heat.",
      },
      {
        text: "Add lemon juice or vinegar and stir gently. The milk will begin to curdle immediately.",
        images: ["/images/recipes/cheese-step3.jpg"],
      },
      {
        text: "Let stand for 10 minutes. You'll see clear separation between curds and whey.",
        images: ["/images/recipes/cheese-step4-1.jpg", "/images/recipes/cheese-step4-2.jpg"],
      },
      {
        text: "Line a colander with cheesecloth and place over a large bowl. Pour the mixture through to strain.",
      },
      {
        text: "Gather the corners of the cheesecloth and rinse the curds under cold water.",
      },
      {
        text: "Squeeze out excess liquid, add salt, and mix gently.",
      },
      {
        text: "Tie the cheesecloth into a bundle and hang over a bowl for 2-3 hours to drain completely.",
        images: ["/images/recipes/cheese-step8.jpg"],
      },
      {
        text: "Unwrap and enjoy fresh, or refrigerate in an airtight container for up to 5 days.",
      },
    ],
    tips: [
      "Use the freshest whole milk possible for the best flavor",
      "The whey can be saved and used in baking or for making ricotta",
      "For a firmer cheese, press under a weight while draining",
    ],
  },
  {
    id: 4,
    name: "Orange Jam",
    slug: "orange-jam",
    description: "Sweet and tangy preserve made from local Cretan oranges.",
    difficulty: "Easy",
    prepTime: "20 min",
    cookTime: "25 min",
    totalTime: "45 min",
    servings: "4 cups",
    category: "Preserves",
    ingredients: [
      {
        items: [
          "6 large oranges",
          "4 cups sugar",
          "2 cups water",
          "2 tbsp lemon juice",
          "1 cinnamon stick",
        ],
      },
    ],
    instructions: [
      {
        text: "Wash oranges thoroughly. Using a vegetable peeler, remove the zest in strips, avoiding the white pith.",
      },
      {
        text: "Cut zest into thin julienne strips. Peel oranges completely and chop the flesh, removing seeds.",
        images: ["/images/recipes/orange-step2.jpg"],
      },
      {
        text: "In a large pot, combine orange zest, chopped oranges, water, and cinnamon stick. Bring to a boil.",
      },
      {
        text: "Reduce heat and simmer for 10 minutes until the zest is tender.",
      },
      {
        text: "Add sugar and lemon juice. Stir until sugar dissolves completely.",
      },
      {
        text: "Increase heat to medium-high and boil for 15-20 minutes, stirring frequently, until the mixture thickens and reaches jam consistency.",
        images: ["/images/recipes/orange-step6-1.jpg", "/images/recipes/orange-step6-2.jpg"],
      },
      {
        text: "Test by placing a small amount on a cold plate - it should wrinkle when pushed with your finger.",
      },
      {
        text: "Remove cinnamon stick. Pour into sterilized jars and seal while hot.",
        images: ["/images/recipes/orange-step8.jpg"],
      },
      {
        text: "Store in a cool, dark place. Refrigerate after opening.",
      },
    ],
    tips: [
      "Use organic oranges to avoid pesticide residue on the zest",
      "Don't skip the lemon juice - it helps with setting and adds brightness",
      "Properly sealed jars will keep for up to a year",
    ],
  },
  {
    id: 5,
    name: "Quince Jelly",
    slug: "quince-jelly",
    description: "Delicate jelly with the subtle sweetness of fresh quince fruit.",
    difficulty: "Medium",
    prepTime: "30 min",
    cookTime: "30 min",
    totalTime: "60 min",
    servings: "3 cups",
    category: "Preserves",
    ingredients: [
      {
        items: [
          "4 lbs quinces",
          "8 cups water",
          "Sugar (amount determined after cooking)",
          "Juice of 1 lemon",
          "Cheesecloth",
        ],
      },
    ],
    instructions: [
      {
        text: "Wash quinces and cut into quarters. No need to peel or core - the skin and seeds add pectin.",
      },
      {
        text: "Place quince pieces in a large pot with water. Bring to a boil, then reduce heat and simmer for 45 minutes until very soft.",
        images: ["/images/recipes/quince-step2.jpg"],
      },
      {
        text: "Line a colander with cheesecloth and strain the mixture into a bowl. Let drip for several hours or overnight - don't squeeze or the jelly will be cloudy.",
        images: ["/images/recipes/quince-step3-1.jpg", "/images/recipes/quince-step3-2.jpg"],
      },
      {
        text: "Measure the extracted juice. For every cup of juice, add 3/4 cup of sugar.",
      },
      {
        text: "Pour juice into a pot, add sugar and lemon juice. Stir over medium heat until sugar dissolves.",
      },
      {
        text: "Bring to a rapid boil and cook for 20-30 minutes until it reaches the jelling point (220°F/105°C).",
      },
      {
        text: "Test by placing a small amount on a cold plate - it should set and wrinkle when pushed.",
      },
      {
        text: "Pour into sterilized jars and seal immediately.",
        images: ["/images/recipes/quince-step8.jpg"],
      },
    ],
    tips: [
      "Quinces turn a beautiful pink color when cooked - this is natural",
      "The longer you cook the fruit, the deeper the pink color",
      "Save the leftover quince pulp to make quince paste",
    ],
  },
  {
    id: 6,
    name: "Fig Marmalade",
    slug: "fig-marmalade",
    description: "Rich, sweet marmalade made from ripe Cretan figs.",
    difficulty: "Easy",
    prepTime: "25 min",
    cookTime: "25 min",
    totalTime: "50 min",
    servings: "4 cups",
    category: "Preserves",
    ingredients: [
      {
        items: [
          "2 lbs fresh figs, stemmed and quartered",
          "3 cups sugar",
          "1/2 cup water",
          "1/4 cup lemon juice",
          "1 tsp vanilla extract",
          "Pinch of salt",
        ],
      },
    ],
    instructions: [
      {
        text: "Place figs in a large, heavy-bottomed pot with water and lemon juice.",
      },
      {
        text: "Bring to a boil over medium-high heat, then reduce to a simmer. Cook for 10 minutes, stirring occasionally.",
        images: ["/images/recipes/fig-step2.jpg"],
      },
      {
        text: "Add sugar and salt. Stir until sugar is completely dissolved.",
      },
      {
        text: "Increase heat to medium-high and cook for 15-20 minutes, stirring frequently to prevent sticking.",
      },
      {
        text: "The mixture will thicken and become glossy. For a smoother texture, mash some of the figs with a potato masher.",
        images: ["/images/recipes/fig-step5-1.jpg", "/images/recipes/fig-step5-2.jpg"],
      },
      {
        text: "Stir in vanilla extract. Test consistency on a cold plate.",
      },
      {
        text: "When ready, remove from heat and let cool for 5 minutes.",
      },
      {
        text: "Pour into sterilized jars, leaving 1/4 inch headspace. Seal and process if desired.",
        images: ["/images/recipes/fig-step8.jpg"],
      },
    ],
    tips: [
      "Use ripe but firm figs for the best flavor and texture",
      "Add a cinnamon stick or star anise while cooking for extra warmth",
      "This marmalade is perfect with cheese and crackers",
    ],
  },
  {
    id: 7,
    name: "Vanilla Marmalade",
    slug: "vanilla-marmalade",
    description: "Fragrant vanilla-infused preserve, perfect for breakfast.",
    difficulty: "Easy",
    prepTime: "15 min",
    cookTime: "25 min",
    totalTime: "40 min",
    servings: "3 cups",
    category: "Preserves",
    ingredients: [
      {
        items: [
          "4 cups mixed citrus (oranges, lemons, grapefruits), peeled and chopped",
          "2 vanilla beans, split lengthwise",
          "3 cups sugar",
          "1 cup water",
          "2 tbsp lemon juice",
        ],
      },
    ],
    instructions: [
      {
        text: "Scrape the seeds from vanilla beans and add both seeds and pods to a large pot.",
        images: ["/images/recipes/vanilla-step1.jpg"],
      },
      {
        text: "Add chopped citrus, water, and lemon juice. Bring to a boil.",
      },
      {
        text: "Reduce heat and simmer for 15 minutes until fruit is soft.",
      },
      {
        text: "Add sugar and stir until completely dissolved.",
      },
      {
        text: "Increase heat to medium-high and boil for 20-25 minutes, stirring often, until thickened.",
        images: ["/images/recipes/vanilla-step5-1.jpg", "/images/recipes/vanilla-step5-2.jpg"],
      },
      {
        text: "Test for doneness - a spoonful should wrinkle on a cold plate.",
      },
      {
        text: "Remove vanilla pods (rinse, dry, and save for vanilla sugar if desired).",
      },
      {
        text: "Pour into sterilized jars and seal.",
        images: ["/images/recipes/vanilla-step8.jpg"],
      },
    ],
    tips: [
      "Don't discard vanilla pods - they can be dried and used to make vanilla sugar",
      "Mix different citrus fruits for a more complex flavor",
      "Spread on toast or use as a filling for pastries",
    ],
  },
  {
    id: 8,
    name: "Dakos Salad",
    slug: "dakos-salad",
    description: "Traditional Cretan salad with barley rusks, tomatoes, and mizithra cheese.",
    difficulty: "Easy",
    prepTime: "15 min",
    cookTime: "0 min",
    totalTime: "15 min",
    servings: "4",
    category: "Appetizers",
    ingredients: [
      {
        items: [
          "4 barley rusks (paximadi) or thick slices of toasted whole grain bread",
          "4 large ripe tomatoes, grated",
          "1 cup mizithra or feta cheese, crumbled",
          "1/4 cup extra virgin olive oil",
          "2 tbsp red wine vinegar",
          "1 tsp dried oregano",
          "1/2 cup Kalamata olives",
          "1 small red onion, thinly sliced",
          "1 cucumber, diced",
          "Salt and pepper to taste",
        ],
      },
    ],
    instructions: [
      {
        text: "If using barley rusks, briefly moisten them under running water or dip in a bowl of water for 2-3 seconds. They should soften slightly but remain crunchy in the center.",
      },
      {
        text: "Place rusks on individual serving plates.",
      },
      {
        text: "Grate tomatoes using the large holes of a box grater, discarding the skin. Season with salt.",
        images: ["/images/recipes/dakos-step3.jpg"],
      },
      {
        text: "Spoon the grated tomato over each rusk, allowing it to soak in slightly.",
      },
      {
        text: "Top with crumbled cheese, sliced onions, olives, and cucumber.",
        images: ["/images/recipes/dakos-step5-1.jpg", "/images/recipes/dakos-step5-2.jpg"],
      },
      {
        text: "Drizzle generously with olive oil and vinegar.",
      },
      {
        text: "Sprinkle with oregano, salt, and pepper.",
      },
      {
        text: "Serve immediately while the base still has some crunch.",
        images: ["/images/recipes/dakos-step8.jpg"],
      },
    ],
    tips: [
      "The key is the quality of the tomatoes - use the ripest, most flavorful ones you can find",
      "Don't over-soak the rusks - they should be slightly crunchy",
      "This is traditionally served as a light lunch or appetizer in Crete",
    ],
  },
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.slug === slug);
}

export function getRelatedRecipes(currentSlug: string, limit: number = 3): Recipe[] {
  const currentRecipe = getRecipeBySlug(currentSlug);
  if (!currentRecipe) return [];

  // Get recipes from the same category, excluding the current one
  const sameCategory = RECIPES.filter(
    (recipe) => recipe.category === currentRecipe.category && recipe.slug !== currentSlug
  );

  // If not enough from same category, add others
  const others = RECIPES.filter(
    (recipe) => recipe.category !== currentRecipe.category && recipe.slug !== currentSlug
  );

  return [...sameCategory, ...others].slice(0, limit);
}
