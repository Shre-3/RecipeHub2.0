import React from "react";
import { Clock, Users, Sparkles } from "lucide-react";

export function RecipeCard({ recipe, isSelected, onClick }) {
  const isAIRecipe = recipe.isAIGenerated;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "bg-[#1f5129] text-[#f4f1e7]"
          : "bg-[#f3e8cc] hover:bg-[#1f5129]/10"
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          {isAIRecipe ? (
            <div className="flex items-center justify-center sm:w-24 h-24 rounded-md bg-[#1f5129]/5">
              <Sparkles className="w-8 h-8 text-[#1f5129]/40" />
            </div>
          ) : (
            recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.name}
                className="sm:w-24 h-24 rounded-md object-cover"
              />
            )
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold mb-2">{recipe.name}</h3>
            {isAIRecipe && (
              <Sparkles
                className={`w-4 h-4 ${
                  isSelected ? "text-[#f4f1e7]" : "text-[#1f5129]"
                }`}
              />
            )}
          </div>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.cookTime} mins
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.servings} servings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
