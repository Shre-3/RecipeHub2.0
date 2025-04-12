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
import { AIRecipeDetail } from "./AIRecipeDetail";
import { RegularRecipeDetail } from "./RegularRecipeDetail";
import { RecipeContent } from "./RecipeContent";

export function RecipeDetail({ recipe, loading, error }) {
  const { user } = useAuth();
  const [servings, setServings] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!recipe || !user) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_API_BOOKMARKS}/check/${
            recipe._id || recipe.id
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsBookmarked(response.data.isBookmarked);
      } catch (err) {
        setIsBookmarked(false);
      }
    };

    checkBookmarkStatus();
    setServings(recipe?.servings || 1);
  }, [recipe, user]);

  const toggleBookmark = async () => {
    try {
      setIsBookmarkLoading(true);
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

      if (!isBookmarked) {
        const transformedRecipe = {
          title: recipe.name || recipe.title,
          description: recipe.description || recipe.name || recipe.title,
          ingredients: recipe.ingredients.map((ing) => ({
            quantity: ing.quantity || 0,
            unit: ing.unit || "",
            description: ing.description || "",
          })),
          instructions: recipe.instructions || [],
          cooking_time: recipe.cookTime || recipe.cooking_time || 30,
          servings: recipe.servings || 4,
          image_url: recipe.image,
          sourceUrl: recipe.sourceUrl || "",
          isExternalRecipe: true,
          external_id: recipe.id,
          publisher: recipe.publisher,
          isAIGenerated: recipe.isAIGenerated,
        };

        const recipeResponse = await axios.post(
          `${baseUrl}/api/recipes`,
          transformedRecipe,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        recipe._id = recipeResponse.data._id;

        await axios.post(
          `${baseUrl}/api/bookmarks`,
          {
            recipe: {
              id: recipeResponse.data._id,
              sourceUrl: recipe.sourceUrl || "",
              isAIGenerated: recipe.isAIGenerated || false,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setIsBookmarked(true);
      } else {
        if (!recipe._id) {
          const checkResponse = await axios.get(
            `${baseUrl}/api/recipes/external/${recipe.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          recipe._id = checkResponse.data._id;
        }

        await axios.delete(`${baseUrl}/api/bookmarks/${recipe._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setIsBookmarked(false);
      }

      window.dispatchEvent(new CustomEvent("bookmarkUpdated"));
    } catch (err) {
      alert("Unable to update bookmark. Please try again.");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!recipe) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <UtensilsCrossed className="w-6 h-6 mr-2" />
        <p>Select a recipe to view details</p>
      </div>
    );
  }

  const handleServingsChange = (delta) => {
    const newServings = Math.max(1, servings + delta);
    setServings(newServings);
  };

  const sharedProps = {
    recipe,
    servings,
    onServingsChange: handleServingsChange,
    user,
    isBookmarked,
    onBookmark: toggleBookmark,
    isBookmarkLoading,
  };

  return recipe.isAIGenerated ? (
    <AIRecipeDetail {...sharedProps} />
  ) : (
    <RegularRecipeDetail {...sharedProps} />
  );
}
