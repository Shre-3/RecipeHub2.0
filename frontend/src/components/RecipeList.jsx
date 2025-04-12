import React from "react";
import { RecipeCard } from "./RecipeCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RECIPES_PER_PAGE = 6;

export function RecipeList({
  recipes,
  selectedRecipe,
  onSelectRecipe,
  loading,
  error,
  currentPage,
  setCurrentPage,
  hasSearched,
}) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-[#1f5129] mb-4">
          <svg viewBox="0 0 24 24" className="w-12 h-12">
            <path
              fill="currentColor"
              d="M12.5 1.5c-1.77 0-3.33 1.17-3.83 2.87C8.14 4.13 7.58 4 7 4a4 4 0 0 0-4 4v1h18V8a4 4 0 0 0-4-4c-.58 0-1.14.13-1.67.37-.5-1.7-2.06-2.87-3.83-2.87M7 6c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5S7.28 6 7 6m10 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5M3 10v9c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4v-9z"
            />
          </svg>
        </div>
        <p className="text-xl text-center text-[#1f5129]">
          Welcome to Recipe Hub!
        </p>
        <p className="text-sm mt-2 text-[#1f5129] opacity-70">
          Search above to discover amazing recipes
        </p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return <div className="text-center p-4">No recipes found</div>;
  }

  const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const currentRecipes = recipes.slice(
    startIndex,
    startIndex + RECIPES_PER_PAGE
  );

  return (
    <div>
      <div className="space-y-4 mb-6">
        {currentRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSelected={selectedRecipe?.id === recipe.id}
            onClick={() => onSelectRecipe(recipe)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-emerald-800/10">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-emerald-800 hover:bg-emerald-800/10"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-sm text-emerald-800">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-emerald-800 hover:bg-emerald-800/10"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
