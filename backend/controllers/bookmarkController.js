const User = require("../models/User");
const Recipe = require("../models/Recipe");

// Add recipe to bookmarks
exports.addBookmark = async (req, res) => {
  try {
    const { recipeId } = req.body;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Add to user's bookmarks if not already bookmarked
    const user = await User.findById(req.user.userId);
    if (user.bookmarks.includes(recipeId)) {
      return res.status(400).json({ message: "Recipe already bookmarked" });
    }

    user.bookmarks.push(recipeId);
    await user.save();

    res.json({ message: "Recipe bookmarked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove recipe from bookmarks
exports.removeBookmark = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const user = await User.findById(req.user.userId);
    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== recipeId
    );

    await user.save();
    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's bookmarked recipes
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("bookmarks")
      .select("bookmarks");

    res.json(user.bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
