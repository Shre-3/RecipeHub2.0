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
}) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (recipes.length === 0)
    return (
      <p className="flex flex-col items-center  justify-center p-8 text-[#1f5129] text-xl ">
        Search For Your Favourite Recipes
      </p>
    );

  const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const endIndex = startIndex + RECIPES_PER_PAGE;
  const currentRecipes = recipes.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            onClick={() => handlePageChange(currentPage - 1)}
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
            onClick={() => handlePageChange(currentPage + 1)}
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
