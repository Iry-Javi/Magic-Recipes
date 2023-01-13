const { Schema, model, SchemaTypes } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },

    recipes: {
      type: [SchemaTypes.ObjectId],
      ref: 'Recipe',
      default:[]
    }

  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
