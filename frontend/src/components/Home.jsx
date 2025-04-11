import React from "react";
import { SearchBar } from "./SearchBar";
import { RecipeList } from "./RecipeList";
import { RecipeDetail } from "./RecipeDetail";
import { useRecipes } from "../hooks/useRecipes";
import { ChefHat } from "lucide-react";

const Home = () => {
  const {
    recipes,
    selectedRecipe,
    loading,
    error,
    currentPage,
    setCurrentPage,
    searchForRecipes,
    selectRecipe,
    reset,
  } = useRecipes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f5129]/10 to-[#f0e4cc]/30 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <SearchBar onSubmit={searchForRecipes} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5 bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg">
            <RecipeList
              recipes={recipes}
              selectedRecipe={selectedRecipe}
              onSelectRecipe={selectRecipe}
              loading={loading}
              error={error}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>

          <div className="lg:col-span-7 bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg">
            <RecipeDetail
              recipe={selectedRecipe}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
