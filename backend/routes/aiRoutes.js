const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const aiController = require("../controllers/aiController");

// @route   POST api/ai/recommendations
// @desc    Get AI-powered recipe recommendations
router.post("/recommendations", auth, aiController.getRecommendations);

// @route   POST api/ai/substitutions
// @desc    Get ingredient substitutions
router.post("/substitutions", auth, aiController.getSubstitutions);

// @route   POST api/ai/generate-recipe
// @desc    Generate a custom recipe
router.post("/generate-recipe", auth, aiController.generateRecipe);

module.exports = router;
