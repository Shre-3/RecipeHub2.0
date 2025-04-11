const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Bookmark = require("../models/Bookmark");
const Recipe = require("../models/Recipe");
const axios = require("axios");

// Get all bookmarks for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.userId });

    // Fetch recipe details for each bookmark
    const recipesPromises = bookmarks.map(async (bookmark) => {
      try {
        // First check if it's an AI-generated recipe in our database
        const localRecipe = await Recipe.findById(bookmark.recipeId);
        if (localRecipe) {
          return {
            id: localRecipe._id,
            name: localRecipe.title,
            ingredients: localRecipe.ingredients,
            instructions: localRecipe.instructions,
            image: localRecipe.image_url,
            cookTime: localRecipe.cooking_time,
            servings: localRecipe.servings,
            isAIGenerated: localRecipe.isAIGenerated,
            sourceUrl: localRecipe.sourceUrl || "",
          };
        }

        // If not found locally, try fetching from external API
        const response = await axios.get(
          `${process.env.RECIPE_API_URL}/${bookmark.recipeId}`
        );
        const recipe = response.data.data.recipe;
        return {
          id: recipe.id,
          name: recipe.title,
          publisher: recipe.publisher || "",
          ingredients: recipe.ingredients
            ? recipe.ingredients.map((ing) => ({
                quantity: ing.quantity || null,
                unit: ing.unit || "",
                description: ing.description || "",
              }))
            : [],
          image: recipe.image_url,
          cookTime: recipe.cooking_time || null,
          servings: recipe.servings || null,
          sourceUrl: recipe.source_url || "",
          isAIGenerated: false,
        };
      } catch (error) {
        console.error(`Error fetching recipe ${bookmark.recipeId}:`, error);
        return null;
      }
    });

    const recipes = (await Promise.all(recipesPromises)).filter(
      (recipe) => recipe !== null
    );
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Check if a recipe is bookmarked
router.get("/check/:recipeId", auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      user: req.user.userId,
      recipeId: req.params.recipeId,
    });

    res.json({ isBookmarked: !!bookmark });
  } catch (err) {
    console.error("Error checking bookmark status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a bookmark
router.post("/", auth, async (req, res) => {
  try {
    const { recipeId } = req.body;

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.user.userId,
      recipeId,
    });

    if (existingBookmark) {
      return res.status(400).json({ message: "Recipe already bookmarked" });
    }

    const bookmark = new Bookmark({
      user: req.user.userId,
      recipeId,
    });

    await bookmark.save();
    res.json({ message: "Bookmark added successfully" });
  } catch (err) {
    console.error("Error adding bookmark:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a bookmark
router.delete("/:recipeId", auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user.userId,
      recipeId: req.params.recipeId,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({ message: "Bookmark removed successfully" });
  } catch (err) {
    console.error("Error removing bookmark:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
