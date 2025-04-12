import React from "react";
import { Clock, Users, Plus, Minus, Bookmark } from "lucide-react";
import { RecipeContent } from "./RecipeContent";

export function RegularRecipeDetail({
  recipe,
  servings,
  onServingsChange,
  user,
  isBookmarked,
  onBookmark,
  isBookmarkLoading,
}) {
  return (
    <div>
      {/* Title and bookmark */}
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold text-[#1f5129]">{recipe.name}</h2>
        {user && (
          <button
            onClick={onBookmark}
            disabled={isBookmarkLoading}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked
                ? "text-[#1f5129] bg-[#1f5129]/10"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Bookmark
              className={`w-6 h-6 ${isBookmarkLoading ? "animate-pulse" : ""}`}
              fill={isBookmarked ? "#1f5129" : "none"}
              stroke={isBookmarked ? "#1f5129" : "currentColor"}
            />
          </button>
        )}
      </div>

      {/* Image */}
      <div className="mt-4">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Time and servings */}
      <div className="mt-4 flex items-center gap-6 text-[#1f5129]">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span>{recipe.cookTime} mins</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => onServingsChange(-1)}
              disabled={servings <= 1}
              className="p-1 rounded-full hover:bg-[#1f5129]/10 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span>{servings} servings</span>
            <button
              onClick={() => onServingsChange(1)}
              className="p-1 rounded-full hover:bg-[#1f5129]/10"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recipe content */}
      <RecipeContent recipe={recipe} servings={servings} />
    </div>
  );
}
