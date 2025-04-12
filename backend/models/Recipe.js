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
      quantity: Number,
      unit: String,
      description: String,
    },
  ],
  instructions: [String],
  image_url: String,
  cooking_time: Number,
  servings: Number,
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
  sourceUrl: String,
});

module.exports = mongoose.model("Recipe", recipeSchema);
