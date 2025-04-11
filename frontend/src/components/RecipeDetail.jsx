import React, { useState, useEffect } from "react";
import {
  Clock,
  Users,
  Plus,
  Minus,
  ExternalLink,
  UtensilsCrossed,
  Bookmark,
} from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export function RecipeDetail({ recipe, loading, error, isAIGenerated }) {
  const { user } = useAuth();
  const [servings, setServings] = useState(recipe?.servings || 1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [savedRecipeId, setSavedRecipeId] = useState(null);

  useEffect(() => {
    if (recipe?.id) {
      checkBookmarkStatus();
    }
  }, [recipe?.id]);

  const checkBookmarkStatus = async () => {
    if (!recipe?.id && !recipe?._id) return;

    try {
      const token = localStorage.getItem("token");
      const idToCheck = recipe._id || recipe.id;

      const response = await axios.get(
        `http://localhost:5000/api/bookmarks/check/${idToCheck}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsBookmarked(response.data.isBookmarked);
    } catch (err) {
      console.error("Error checking bookmark status:", err);
      setIsBookmarked(false);
    }
  };

  const toggleBookmark = async () => {
    if (!recipe?.id && !recipe?._id) return;

    setIsBookmarkLoading(true);
    try {
      const token = localStorage.getItem("token");
      let recipeIdToUse = recipe._id || recipe.id;

      // If it's a new AI-generated recipe that hasn't been saved yet
      if (isAIGenerated && !savedRecipeId) {
        // Save AI-generated recipe first
        const recipeData = {
          title: recipe.name,
          description: recipe.name,
          ingredients: recipe.ingredients.map((ing) => ({
            quantity: Number(ing.quantity) || 0,
            unit: ing.unit || "",
            description: ing.description || "",
          })),
          instructions: recipe.instructions.map((i) => i.toString()),
          cooking_time: Number(recipe.cookTime) || 30,
          servings: Number(recipe.servings) || 4,
          image_url: recipe.image || "https://via.placeholder.com/300",
          isAIGenerated: true,
          sourceUrl: "",
        };

        const saveResponse = await axios.post(
          "http://localhost:5000/api/recipes",
          recipeData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!saveResponse.data._id) {
          throw new Error("No recipe ID returned from save");
        }

        recipeIdToUse = saveResponse.data._id;
        setSavedRecipeId(recipeIdToUse);
      }

      // Use the current bookmark state to determine action
      if (!isBookmarked) {
        // Add bookmark
        await axios.post(
          "http://localhost:5000/api/bookmarks",
          { recipeId: recipeIdToUse },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsBookmarked(true);
      } else {
        // Remove bookmark
        await axios.delete(
          `http://localhost:5000/api/bookmarks/${recipeIdToUse}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsBookmarked(false);
      }

      // If we're in the BookmarkedRecipes view and removing a bookmark
      if (window.location.pathname === "/bookmarks" && isBookmarked) {
        window.dispatchEvent(new CustomEvent("bookmarkUpdated"));
      }
    } catch (err) {
      console.error("Error in toggleBookmark:", err);
      if (err.response?.data) {
        console.error("Server error details:", err.response.data);
      }
      // Revert the bookmark state if the operation failed
      setIsBookmarked(!isBookmarked);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const adjustQuantity = (quantity) => {
    if (!quantity) return "";
    const originalServings = recipe?.servings || 1;
    return (parseFloat(quantity) * (servings / originalServings))
      .toFixed(2)
      .replace(/\.?0+$/, "");
  };

  const incrementServings = () => {
    setServings((prev) => prev + 1);
  };

  const decrementServings = () => {
    setServings((prev) => (prev > 1 ? prev - 1 : 1));
  };

  React.useEffect(() => {
    if (recipe?.servings) {
      setServings(recipe.servings);
    }
  }, [recipe]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#1f5129]">
        <UtensilsCrossed className="w-12 h-12 mb-4" />
        <div className="text-xl">Select a recipe to view details</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1f5129] mb-4">
          {recipe.name}
        </h2>
        {!isAIGenerated && recipe.image && (
          <div className="relative group">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-64 object-cover rounded-xl shadow-md"
            />
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-[#1f5129] mt-4">
          {recipe.cookTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.cookTime} mins
            </span>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <button
              onClick={decrementServings}
              className="p-1 rounded-full hover:bg-[#1f5129]/10"
              disabled={servings <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span>{servings} servings</span>
            <button
              onClick={incrementServings}
              className="p-1 rounded-full hover:bg-[#1f5129]/10"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={toggleBookmark}
              disabled={isBookmarkLoading}
              className="p-1 rounded-full hover:bg-[#1f5129]/10 ml-2"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked ? "fill-current" : "fill-none"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#f0e4cc]/30 p-4 rounded-lg backdrop-blur-sm">
        <h3 className="font-semibold text-lg text-[#1f5129] mb-3">
          Ingredients
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-[#1f5129]">
          {recipe.ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="transition-all duration-200 hover:translate-x-1"
            >
              {adjustQuantity(ingredient.quantity)} {ingredient.unit}{" "}
              {ingredient.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions section - clean step format */}
      {isAIGenerated && recipe.instructions && (
        <div className="bg-[#f0e4cc]/30 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="font-semibold text-lg text-[#1f5129] mb-3">
            Cooking Instructions
          </h3>
          <div className="space-y-2 text-[#1f5129]">
            {recipe.instructions.map((step, index) => (
              <div
                key={index}
                className="transition-all duration-200 hover:translate-x-1"
              >
                {/* Remove any existing "Step X:" from the text and add our own format */}
                Step {index + 1}: {step.replace(/^Step \d+:?\s*/i, "")}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Only show View Full Recipe link for non-AI recipes */}
      {!isAIGenerated && recipe.sourceUrl && (
        <div className="pt-4">
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1f5129] text-white rounded-lg hover:bg-[#1f5129]/90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span>View Full Recipe</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
