const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipeId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate bookmarks
bookmarkSchema.index({ user: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
