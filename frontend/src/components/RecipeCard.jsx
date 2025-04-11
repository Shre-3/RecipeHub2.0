import React from "react";
import { Clock, Users, Sparkles } from "lucide-react";

export function RecipeCard({ recipe, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "bg-[#1f5129] text-[#f4f1e7]"
          : "bg-[#f0e4cc] hover:bg-[#1f5129]/10"
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {!recipe.isAIGenerated && recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full sm:w-24 h-24 rounded-md object-cover"
          />
        ) : recipe.isAIGenerated ? (
          <div className="flex items-center justify-center w-full sm:w-24 h-24 rounded-md bg-[#1f5129]/5">
            <Sparkles className="w-8 h-8 text-[#1f5129]/40" />
          </div>
        ) : (
          <div className="w-full sm:w-24 h-24 rounded-md bg-[#1f5129]/5" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold mb-2">{recipe.name}</h3>
            {recipe.isAIGenerated && (
              <Sparkles className="w-4 h-4 text-[#1f5129]" />
            )}
          </div>
          {recipe.cookTime && recipe.servings && (
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
          )}
        </div>
      </div>
    </div>
  );
}
