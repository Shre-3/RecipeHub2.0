import React, { useState, useEffect } from "react";
import axios from "axios";
import { RecipeList } from "./RecipeList";
import { RecipeDetail } from "./RecipeDetail";
import { Loader2 } from "lucide-react";

export function BookmarkedRecipes() {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBookmarkedRecipes();

    // Add event listener for bookmark updates
    const handleBookmarkUpdate = () => {
      fetchBookmarkedRecipes();
      setSelectedRecipe(null); // Clear selected recipe when it's removed
    };

    window.addEventListener("bookmarkUpdated", handleBookmarkUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("bookmarkUpdated", handleBookmarkUpdate);
    };
  }, []);

  const fetchBookmarkedRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(import.meta.env.VITE_API_BOOKMARKS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookmarkedRecipes(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Failed to load bookmarked recipes");
      setLoading(false);
    }
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f5129]/10 to-[#f0e4cc]/30 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1f5129] mb-6">
          Your Bookmarked Recipes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5 bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="w-8 h-8 text-[#1f5129] animate-spin" />
              </div>
            ) : bookmarkedRecipes.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p>No bookmarked recipes yet.</p>
                <p className="mt-2">
                  Start exploring recipes and bookmark your favorites!
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
              isAIGenerated={selectedRecipe?.isAIGenerated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
