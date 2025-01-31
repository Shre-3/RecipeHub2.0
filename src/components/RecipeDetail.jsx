import { React, useState } from "react";
import { UtensilsCrossed, Clock, Users, Loader2 } from "lucide-react";
import { MinusCircle, CirclePlus } from "lucide-react";

export function RecipeDetail({ recipe, loading, error }) {
  const [servings, setServings] = useState(4);
  const [adjustedIngredients, setAdjustedIngredients] = useState(
    recipe?.ingredients || []
  );

  const recalculateIngredients = (newServings) => {
    if (!recipe?.ingredients) return;

    const newIngredients = recipe.ingredients.map((ing) => ({
      ...ing,
      quantity: ing.quantity
        ? (ing.quantity / recipe.servings) * newServings
        : null,
    }));

    setAdjustedIngredients(newIngredients);
  };

  const minusOne = () => {
    setServings((prev) => {
      const newServings = Math.max(1, prev - 1);
      recalculateIngredients(newServings);
      return newServings;
    });
  };

  const plusOne = () => {
    setServings((prev) => {
      const newServings = prev + 1;
      recalculateIngredients(newServings);
      return newServings;
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-800 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-emerald-800">
        <UtensilsCrossed className="w-16 h-16 mb-4" />
        <p className="text-lg">Select a recipe to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-[#f4f1e7] rounded-lg overflow-auto">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-48 sm:h-64 object-cover rounded-lg mb-6"
      />
      <h2 className="text-2xl font-bold text-[#1f5129] mb-4">{recipe.name}</h2>

      <div className="flex gap-4 mb-6 text-emerald-800">
        {recipe.cookTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-5 h-5" />
            {recipe.cookTime} mins
          </span>
        )}
        <span className="flex items-center gap-1">
          {servings === 1 ? (
            <MinusCircle className="w-5 h-5 text-gray-400 cursor-not-allowed" />
          ) : (
            <MinusCircle
              onClick={minusOne}
              className="w-5 h-5 text-emerald-800 hover:text-emerald-600 transition-colors cursor-pointer"
            />
          )}
        </span>
        {recipe.servings && (
          <span className="flex items-center gap-1">
            <Users className="w-5 h-5" />
            {servings} servings
          </span>
        )}
        <span onClick={plusOne} className="flex items-center gap-1">
          <CirclePlus className="w-5 h-5 text-emerald-800 hover:text-emerald-600 transition-colors cursor-pointer" />
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1f5129] mb-2">Publisher</h3>
        <p className="text-emerald-800">{recipe.publisher}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1f5129] mb-2">
          Ingredients
        </h3>
        <ul className="list-disc list-inside space-y-2">
          {adjustedIngredients.map((ingredient, index) => (
            <li key={index} className="text-emerald-800">
              <span className="font-medium">
                {ingredient.quantity ? ingredient.quantity.toFixed(2) : ""}{" "}
                {ingredient.unit ? ingredient.unit + " " : ""}
              </span>{" "}
              {ingredient.description}
            </li>
          ))}
        </ul>
      </div>

      {recipe.sourceUrl && (
        <div className="mt-6">
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-[#1f5129] text-white rounded-md hover:bg-[#1f5129]/90 transition-colors"
          >
            View Original Recipe
          </a>
        </div>
      )}
    </div>
  );
}
