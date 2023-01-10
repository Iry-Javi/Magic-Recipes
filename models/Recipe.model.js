const { Schema, model, SchemaTypes } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const recipeSchema = new Schema(
  {
    cousine: {
      type: String,
      required: true,
      enum: ['latinamerican', 'mediterranian', 'asian', 'italian', 'slavic']
    },
    title: {
      type: String,
      trim: true,
      required: false,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    duration: { 
      type: Number, min: 0 
    },
    ingredients: { 
      type: [ String ] 
    },
    preparation: {
      type: String,
      required: true
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
    comments: 
    [{ type: Schema.Types.ObjectId, ref: "Comment" }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;