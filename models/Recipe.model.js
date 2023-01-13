const { Schema, model, SchemaTypes } = require("mongoose");

const recipeSchema = new Schema(
  {
    cuisine: {
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
    // owner: {
    //   type: SchemaTypes.ObjectId,
    //   ref: 'User',
    // },
    comments: 
    [{ type: Schema.Types.ObjectId, ref: "Comment" }]
  },
  {
      
    timestamps: true
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;