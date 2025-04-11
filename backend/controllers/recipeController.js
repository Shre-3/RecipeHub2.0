const Recipe = require("../models/Recipe");
const { validationResult } = require("express-validator");

// Create new recipe
exports.createRecipe = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("creator", "username")
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's recipes
exports.getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ creator: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if user owns the recipe
    if (recipe.creator.toString() !== req.user.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if user owns the recipe
    if (recipe.creator.toString() !== req.user.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await recipe.remove();
    res.json({ message: "Recipe removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
