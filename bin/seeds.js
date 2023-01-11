const mongoose = require("mongoose");
const Recipe = require("../models/Recipe.model"); 


const recipes = [
    { cousine: "italian", 
     title: 'Spaghetti Genovese', 
     imageUrl: 'https://img.taste.com.au/tyTSqefm/w720-h480-cfill-q80/taste/2016/11/spaghetti-alla-genovese-11777-1.jpeg', 
     duration: 25 , 
     ingredients: ['300g potato', '300g spaguetti', '200g trimmed green bean', '120g tub fresh pesto', 'olive oil'], 
     preparation: `step 1
     Pour a kettle of boiling water into a very large pan until half full. Return to the boil, then add the potatoes and spaghetti, and a little salt. Cook for 10 minutes until the potatoes and pasta are almost tender. Tip in the green beans and cook for 5 minutes more,
  
     STEP 2
     Drain well, reserving 4 tbsp of the cooking liquid. Return the potatoes, pasta and beans to the pan, then stir in the fresh pesto and reserved cooking liquid. Season to taste, divide between four serving plates and drizzle with a little olive oil`,

     owner: {}, 
     comments: []
    },

    { cousine: "slavic", 
     title: ' Borscht ', 
     imageUrl: 'https://static.wixstatic.com/media/293fdb_5c7fdd317f334787bc552e1e380abd58~mv2.jpg', 
     duration: 65, 
     ingredients: ['1 package pork sausage', '3 beets', ' 3 carrots', '3 potatoes', 'half head cabbage', '1 cup diced tomatoes', '1 table spoon vegetable oil', '1 onion', '1 can tomato paste', '8 3/4 cups water', '3 cloves garlic', '1 teaspoon white sugar', 'salt and pepper', 'half cup sour cream', '1 tablespoon chopped fresh parsley'], 

     preparation: `Step 1. Crumble sausage into a skillet set over medium-high heat. Cook and stir until no longer pink. Remove from the heat and set aside.
     Step 2. Fill a large pot halfway with water (about 8 cups) and bring to a boil.
     Step 3. Add sausage to pot, cover pot, and return to a boil. Add beets and cook until they have lost their color. Add carrots and potatoes and simmer until tender, about 15 minutes.
     Step 4. Add cabbage and diced tomatoes to pot.
     Step 5. Heat oil in a skillet over medium heat. Add onion and cook until tender. Stir in tomato paste and remaining 3/4 cup water until well blended. Transfer to the pot.
     Step 6. Add garlic to the soup, cover, and turn off the heat. Let stand 5 minutes. Stir in sugar and season with salt and pepper.
     Step 7. Ladle into serving bowls. Garnish with sour cream and parsley.`, 
     owner: {}, 
     comments: []
    },

    { cousine: "mediterranian", 
     title: 'Paella', 
     imageUrl: 'https://www.thespruceeats.com/thmb/rWeSaLTQeF1NJePa_HP5Tabf3jo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/fresh-paella-in-pan-on-wooden-table-556668991-5843564b5f9b5851e5745d5a.jpg', 
     duration: 55, 
     ingredients: [' 2 tablespoons olive oil', '1 onion finely diced', 
     '½ tomato, finely diced',
     '1 pinch salt',
     '½ tablespoon smoked paprika',
    ' 6 fresh romano or green beans',
    '½ cup canned butter beans, drained and rinsed', 
    '½ cup white rice', 
    '6 large shrimp',
  '  6 mussels',
    '6 clams',
    '1 cup white wine',
    '2 cups seafood stock',
    '1 pinch saffron threads',
    '1 teaspoon finely chopped fresh rosemary',
    '1 cup fresh peas',
    '5 baby squid cut into rings and tentacles',
    '1 lemon cut into wedges',
    '1 tablespoon chopped fresh flat-leaf parsley'],  
     preparation: `Step 1. Heat olive oil in a large skillet or paella pan over high heat. Cook and stir onion, tomato, salt, and smoked paprika into the hot oil until softened, about 3 minutes. Add romano beans, butter beans, and rice; cook and stir until rice is coated with oil, 2 to 3 minutes.
     Step 2. Place shrimp, mussels, and clams over the top of the rice mixture. Pour in white wine and seafood stock; sprinkle in saffron threads and rosemary. Bring mixture to a simmer. Turn shellfish and continue to cook until clams and mussels have opened, and shrimp are pink and cooked through, about 5 minutes. Remove clams, mussels, and shrimp and set aside.
     Step 3. Stir peas into the paella; simmer, uncovered, until rice is tender and has absorbed the liquid, 20 to 25 minutes. Stir in squid, and return clams, mussels, and shrimp to the pan. Cook until squid is opaque and cooked through, 2 to 3 more minutes. Serve with lemon wedges and chopped parsley.`, 
     owner: {}, 
     comments: []

    }

];


const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project2";

mongoose
  .connect(MONGO_URI)
  .then(x => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);
    return Recipe.create(recipes);
  })

  .then(recipesFromDB => {
    console.log(`Created ${recipesFromDB.length}recipes`);
 
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('DB connection closed!');
  })
  .catch(err => {
    console.log(`An error occurred while creating recipes from the DB: ${err}`);
  });