const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const recipeSchema = new Schema(
  {
    recipetitle: {
      type: String,
      trim: true,
      required: false,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    howtocook: {
      type: String,
      required: true
    },
    owner: {
        type: String
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;