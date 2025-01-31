const BASE_URL = import.meta.env.VITE_API_URL;

export async function searchRecipes(query) {
  const response = await fetch(`${BASE_URL}?search=${query}`);
  if (!response.ok) throw new Error("Failed to fetch recipes");
  const data = await response.json();

  if (!data.data || !Array.isArray(data.data.recipes)) {
    throw new Error("Unexpected API response format");
  }
  return data.data.recipes.map(mapApiRecipe);
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
