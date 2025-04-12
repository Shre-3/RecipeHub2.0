import React, { useState, useEffect } from "react";
import axios from "axios";
import { RecipeList } from "./RecipeList";
import { RecipeDetail } from "./RecipeDetail";
import { Loader2, BookmarkIcon, ChefHat } from "lucide-react";

export function BookmarkedRecipes() {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBookmarkedRecipes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

      const response = await axios({
        method: "get",
        url: `${baseUrl}/api/bookmarks`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Raw bookmarks response:", response.data);

      // Transform the bookmarked recipes to match our app's format
      const formattedRecipes = response.data.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.name,
        image: recipe.isAIGenerated ? null : recipe.image,
        sourceUrl: recipe.sourceUrl,
        cookTime: recipe.cookTime || 30,
        servings: recipe.servings || 4,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        isBookmarked: true,
        _id: recipe.id,
        publisher: recipe.publisher,
        isExternalRecipe: true,
        isAIGenerated: recipe.isAIGenerated === true,
      }));

      console.log("Formatted bookmarked recipes:", formattedRecipes);
      setBookmarkedRecipes(formattedRecipes);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Failed to load bookmarked recipes");
      setBookmarkedRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBookmarkedRecipes();
  }, []);

  // Listen for bookmark updates
  useEffect(() => {
    const handleBookmarkUpdate = () => {
      console.log("Bookmark update event received");
      fetchBookmarkedRecipes();
    };

    window.addEventListener("bookmarkUpdated", handleBookmarkUpdate);
    return () =>
      window.removeEventListener("bookmarkUpdated", handleBookmarkUpdate);
  }, []);

  const handleSelectRecipe = (recipe) => {
    console.log("Selected recipe:", recipe);
    setSelectedRecipe(recipe);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f5129]/10 to-[#f0e4cc]/30 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1f5129] mb-6 flex items-center gap-3">
          <BookmarkIcon className="w-8 h-8" />
          Your Bookmarked Recipes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5 bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="w-8 h-8 text-[#1f5129] animate-spin" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : bookmarkedRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ChefHat className="w-16 h-16 text-[#1f5129]/30 mb-4" />
                <h3 className="text-lg font-semibold text-[#1f5129] mb-2">
                  No Bookmarked Recipes Yet
                </h3>
                <p className="text-gray-600 max-w-sm">
                  Start exploring recipes and bookmark your favorites to see
                  them here!
                </p>
              </div>
            ) : (
              <RecipeList
                recipes={bookmarkedRecipes}
                selectedRecipe={selectedRecipe}
                onSelectRecipe={handleSelectRecipe}
                loading={loading}
                error={error}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>

          <div className="lg:col-span-7 bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg">
            <RecipeDetail
              recipe={selectedRecipe}
              loading={loading}
              error={error}
              isBookmarked={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
