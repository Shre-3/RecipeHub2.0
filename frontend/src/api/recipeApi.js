import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function searchRecipes(query) {
  const response = await fetch(`${BASE_URL}?search=${query}`);
  if (!response.ok) throw new Error("Failed to fetch recipes");
  const data = await response.json();

  if (!data.data || !Array.isArray(data.data.recipes)) {
    throw new Error("Unexpected API response format");
  }

  // Transform the Forkify recipe format to our app's format
  return data.data.recipes.map((recipe) => ({
    id: recipe.id,
    name: recipe.title,
    description: recipe.title,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    cookTime: 30, // Default value since Forkify doesn't provide this
    servings: 4, // Default value since Forkify doesn't provide this
    ingredients: recipe.ingredients
      ? recipe.ingredients.map((ing) => ({
          quantity: ing.quantity || 0,
          unit: ing.unit || "",
          description: ing.description || "",
        }))
      : [],
    instructions: recipe.cooking_instructions || [],
    isBookmarked: false,
  }));
}

export async function getRecipeById(id) {
  if (!id) {
    throw new Error("ID is required to fetch a recipe");
  }

  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch recipe details");
  const data = await response.json();

  if (!data.data || !data.data.recipe) {
    throw new Error("Recipe not found");
  }
  return mapApiRecipe(data.data.recipe);
}

export async function saveRecipe(recipe) {
  const token = localStorage.getItem("token"); // or however you store the token

  const transformedRecipe = {
    title: recipe.name,
    description: recipe.description,
    ingredients: recipe.ingredients.map((ing) => ({
      quantity: ing.quantity,
      unit: ing.unit,
      description: ing.description,
    })),
    instructions: recipe.instructions,
    cooking_time: recipe.cookTime,
    servings: recipe.servings,
    image_url: recipe.image,
    isAIGenerated: recipe.isAIGenerated,
    source_url: recipe.sourceUrl,
  };

  const response = await fetch(`${BASE_URL}/api/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(transformedRecipe),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to save recipe");
  }

  const data = await response.json();
  return mapApiRecipe(data.recipe);
}

function mapApiRecipe(apiRecipe) {
  return {
    id: apiRecipe.id,
    name: apiRecipe.title,
    publisher: apiRecipe.publisher || "",
    ingredients: apiRecipe.ingredients
      ? apiRecipe.ingredients.map((ing) => ({
          quantity: ing.quantity || null,
          unit: ing.unit || "",
          description: ing.description || "",
        }))
      : [],
    image: apiRecipe.image_url,
    cookTime: apiRecipe.cooking_time || null,
    servings: apiRecipe.servings || null,
    sourceUrl: apiRecipe.source_url || "",
  };
}
