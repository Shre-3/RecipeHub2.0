import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/layout/Navbar";
import { SearchBar } from "./components/SearchBar";
import { RecipeList } from "./components/RecipeList";
import { RecipeDetail } from "./components/RecipeDetail";
import { BookmarkedRecipes } from "./components/BookmarkedRecipes";
import { AIRecommendations } from "./components/AIRecommendations";
import { AIRecipeGenerator } from "./components/AIRecipeGenerator";
import { useRecipes } from "./hooks/useRecipes";
import { ChefHat } from "lucide-react";

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !["/login", "/register"].includes(location.pathname);
  const [resetKey, setResetKey] = useState(0);

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

  const handleReset = () => {
    reset();
    setCurrentPage(1);
    setResetKey((prev) => prev + 1);
  };

  const MainContent = () => (
    <div className="min-h-screen bg-[#f4f1e7] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
          linear-gradient(30deg, #1f5129 12%, transparent 12.5%, transparent 87%, #1f5129 87.5%, #1f5129),
          linear-gradient(150deg, #1f5129 12%, transparent 12.5%, transparent 87%, #1f5129 87.5%, #1f5129),
          linear-gradient(30deg, #1f5129 12%, transparent 12.5%, transparent 87%, #1f5129 87.5%, #1f5129),
          linear-gradient(150deg, #1f5129 12%, transparent 12.5%, transparent 87%, #1f5129 87.5%, #1f5129),
          linear-gradient(60deg, #f0e4cc 25%, transparent 25.5%, transparent 75%, #f0e4cc 75%, #f0e4cc),
          linear-gradient(60deg, #f0e4cc 25%, transparent 25.5%, transparent 75%, #f0e4cc 75%, #f0e4cc)
        `,
          backgroundSize: "80px 140px",
          backgroundPosition: "0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px",
          opacity: 0.07,
        }}
      ></div>

      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <SearchBar onSubmit={searchForRecipes} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-5">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-[#1f5129]/10">
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
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-[#1f5129]/10">
                <RecipeDetail
                  recipe={selectedRecipe}
                  loading={loading}
                  error={error}
                  isAIGenerated={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AIRecommendationsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1f5129]/10 to-[#f0e4cc]/30 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5">
            <AIRecommendations onSelectRecipe={selectRecipe} />
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

  const AIGeneratorPage = () => {
    const [generatedRecipe, setGeneratedRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f5129]/10 to-[#f0e4cc]/30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-5 bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg">
              <AIRecipeGenerator
                onRecipeGenerated={setGeneratedRecipe}
                setLoading={setLoading}
                setError={setError}
              />
            </div>
            <div className="lg:col-span-7 bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg">
              <RecipeDetail
                recipe={generatedRecipe}
                loading={loading}
                error={error}
                isAIGenerated={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f1e7]">
      {showNavbar && <Navbar onReset={handleReset} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <BookmarkedRecipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-recipe-generator"
          element={
            <ProtectedRoute>
              <AIGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-recommendations"
          element={
            <ProtectedRoute>
              <AIRecommendationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
