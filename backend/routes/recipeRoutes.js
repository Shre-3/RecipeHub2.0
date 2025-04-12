const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const recipeController = require("../controllers/recipeController");
const Recipe = require("../models/Recipe");
const auth = require("../middleware/auth");

// @route   POST api/recipes
// @desc    Create a recipe
router.post("/", auth, async (req, res) => {
  try {
    // If it's an AI-generated recipe, use different validation
    if (req.body.isAIGenerated) {
      const recipe = new Recipe({
        title: req.body.title,
        description: req.body.description || req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        cooking_time: req.body.cooking_time,
        servings: req.body.servings,
        image_url: req.body.image_url,
        isAIGenerated: true,
        creator: req.user.userId,
        sourceUrl: req.body.sourceUrl || "",
      });

      const savedRecipe = await recipe.save();
      res.json(savedRecipe);
    } else {
      // For regular recipes, use the existing validation and controller
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const recipe = new Recipe({
        ...req.body,
        creator: req.user.userId,
      });

      await recipe.save();
      res.status(201).json(recipe);
    }
  } catch (err) {
    console.error("Error saving recipe:", err);
    res
      .status(500)
      .json({ message: "Failed to save recipe", error: err.message });
  }
});

// @route   GET api/recipes
// @desc    Get all recipes
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const recipes = await Recipe.find(query)
      .populate("creator", "username")
      .sort({ createdAt: -1 });

    res.json({
      data: {
        recipes: recipes.map((recipe) => ({
          id: recipe._id,
          title: recipe.title,
          publisher: recipe.creator?.username || "",
          image_url: recipe.image_url,
          cooking_time: recipe.cooking_time,
          servings: recipe.servings,
          ingredients: recipe.ingredients,
          source_url: recipe.sourceUrl || "",
          isAIGenerated: recipe.isAIGenerated || false,
        })),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET api/recipes/user
// @desc    Get user's recipes
router.get("/user", auth, recipeController.getUserRecipes);

// @route   PUT api/recipes/:id
// @desc    Update recipe
router.put("/:id", auth, recipeController.updateRecipe);

// @route   DELETE api/recipes/:id
// @desc    Delete recipe
router.delete("/:id", auth, recipeController.deleteRecipe);

module.exports = router;
