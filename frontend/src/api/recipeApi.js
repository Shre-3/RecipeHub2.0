const BASE_URL = import.meta.env.VITE_BASE_URL;

export const searchRecipes = async (query) => {
  try {
    const { data } = await axios.get(`${BASE_URL}?search=${query}`);
    return data;
  } catch (error) {
    throw new Error("Failed to search recipes");
  }
};

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
