const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: function () {
      return !this.isAIGenerated;
    },
  },
  ingredients: [
    {
      quantity: {
        type: Number,
        required: function () {
          return this.isAIGenerated;
        },
      },
      unit: {
        type: String,
        required: function () {
          return this.isAIGenerated;
        },
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  instructions: [
    {
      type: String,
      required: true,
    },
  ],
  image_url: {
    type: String,
    required: function () {
      return !this.isAIGenerated;
    },
  },
  cooking_time: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAIGenerated: {
    type: Boolean,
    default: false,
  },
  sourceUrl: {
    type: String,
    required: function () {
      return !this.isAIGenerated;
    },
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
