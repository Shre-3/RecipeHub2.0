const axios = require("axios");
const auth = require("../middleware/auth");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get AI-powered recipe recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const { dietaryRestrictions, cuisineTypes, cookingTime, difficulty } =
      req.body;

    // In a real implementation, this would use a machine learning model
    // For now, we'll use the external API with some filtering

    // Get a list of recipes from the external API
    const response = await axios.get(`${process.env.RECIPE_API_URL}?search=`);

    if (!response.data || !response.data.data || !response.data.data.recipes) {
      return res
        .status(500)
        .json({ message: "Failed to fetch recipes from external API" });
    }

    let recipes = response.data.data.recipes;

    // Apply filters based on user preferences
    // This is a simplified example - in a real app, you'd use more sophisticated filtering

    // Filter by cooking time if specified
    if (cookingTime && cookingTime !== "any") {
      const maxTime =
        cookingTime === "quick (< 30 min)"
          ? 30
          : cookingTime === "medium (30-60 min)"
          ? 60
          : 120;

      recipes = recipes.filter(
        (recipe) => recipe.cooking_time && recipe.cooking_time <= maxTime
      );
    }

    // In a real implementation, you would:
    // 1. Use a machine learning model to rank recipes based on user preferences
    // 2. Consider dietary restrictions and cuisine types
    // 3. Take into account user history and ratings

    // For now, we'll just return a subset of recipes
    const recommendations = recipes.slice(0, 5).map((recipe) => ({
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
    }));

    res.json(recommendations);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get AI-powered ingredient substitutions
exports.getSubstitutions = async (req, res) => {
  try {
    const { ingredient } = req.body;

    if (!ingredient) {
      return res.status(400).json({ message: "Ingredient is required" });
    }

    // In a real implementation, this would use a database of substitutions
    // For now, we'll return some mock data

    const substitutions = {
      egg: [
        { name: "Flaxseed meal", ratio: "1 tbsp + 3 tbsp water = 1 egg" },
        { name: "Chia seeds", ratio: "1 tbsp + 3 tbsp water = 1 egg" },
        { name: "Applesauce", ratio: "1/4 cup = 1 egg" },
        { name: "Banana", ratio: "1/4 cup mashed = 1 egg" },
      ],
      milk: [
        { name: "Almond milk", ratio: "1:1" },
        { name: "Soy milk", ratio: "1:1" },
        { name: "Oat milk", ratio: "1:1" },
        { name: "Coconut milk", ratio: "1:1" },
      ],
      butter: [
        { name: "Olive oil", ratio: "3/4 cup = 1 cup butter" },
        { name: "Coconut oil", ratio: "1:1" },
        { name: "Applesauce", ratio: "1/2 cup = 1 cup butter" },
      ],
      flour: [
        { name: "Almond flour", ratio: "1:1" },
        { name: "Coconut flour", ratio: "1/4 cup = 1 cup flour" },
        { name: "Oat flour", ratio: "1:1" },
      ],
    };

    // Return substitutions for the requested ingredient or a default message
    const result = substitutions[ingredient.toLowerCase()] || [
      {
        name: "No specific substitutions found",
        ratio: "Consider using a similar ingredient",
      },
    ];

    res.json(result);
  } catch (error) {
    console.error("Error getting substitutions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const generateRecipePrompt = (ingredients) => {
  return `Create a recipe using these ingredients: ${ingredients.join(", ")}. 
  Format the response as a JSON object with the following structure:
  {
    "name": "Recipe name",
    "ingredients": [{"quantity": number, "unit": "string", "description": "string"}],
    "instructions": ["step 1", "step 2", ...],
    "cookTime": number (in minutes),
    "servings": number
  }`;
};

exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "At least one ingredient is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef. You must respond ONLY with valid JSON without any additional text, comments or explanations. The JSON must strictly follow the specified structure.",
        },
        {
          role: "user",
          content: `Create a detailed recipe using these ingredients: ${ingredients.join(
            ", "
          )}. 
          Respond with ONLY a JSON object in this exact structure (no comments or explanations):
          {
            "name": "Recipe Name",
            "ingredients": [
              {
                "quantity": 1,
                "unit": "cup",
                "description": "ingredient description"
              }
            ],
            "instructions": [
              "Step 1: Detailed cooking instruction",
              "Step 2: Detailed cooking instruction"
            ],
            "cookTime": 30,
            "servings": 4
          }`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    try {
      const recipe = JSON.parse(completion.choices[0].message.content);
      res.json(recipe);
    } catch (parseError) {
      console.error("JSON Parse Error:", completion.choices[0].message.content);
      res.status(500).json({
        message: "Failed to parse recipe data",
        debug:
          process.env.NODE_ENV === "development"
            ? completion.choices[0].message.content
            : undefined,
      });
    }
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({
      message: "Failed to generate recipe",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.generateImage = async (req, res) => {
  try {
    const { recipeName } = req.body;

    if (!recipeName) {
      return res.status(400).json({ message: "Recipe name is required" });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A professional, appetizing food photography style image of ${recipeName}. The image should be well-lit, showing the dish from a top-down or 45-degree angle on a clean, minimal background. No text or watermarks.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ message: "Failed to generate image" });
  }
};
