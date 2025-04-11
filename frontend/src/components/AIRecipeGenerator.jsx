import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export function AIRecipeGenerator({ onRecipeGenerated, setLoading, setError }) {
  const [ingredients, setIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [localError, setLocalError] = useState(null);

  const generateRecipe = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setLoading(true);
    setError(null);
    setLocalError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/generate-recipe",
        {
          ingredients: ingredients.split(",").map((i) => i.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Add a default image and ID
      const recipeWithDefaults = {
        ...response.data,
        id: Date.now().toString(),
        image:
          "https://source.unsplash.com/featured/?food," +
          response.data.name.replace(/\s+/g, "-"),
      };

      onRecipeGenerated(recipeWithDefaults);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to generate recipe";
      setError(errorMessage);
      setLocalError(errorMessage);
      onRecipeGenerated(null);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-[#1f5129] mb-4">
        AI Recipe Generator
      </h2>

      <form onSubmit={generateRecipe} className="space-y-4">
        <div>
          <label
            htmlFor="ingredients"
            className="block text-sm font-medium text-[#1f5129] mb-1"
          >
            Enter ingredients (comma-separated)
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken, rice, tomatoes"
            className="w-full p-2 rounded-lg bg-[#f4f1e7] border-2 border-[#1f5129] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            rows={3}
          />
        </div>

        {localError && <div className="text-red-600 text-sm">{localError}</div>}

        <button
          type="submit"
          disabled={isGenerating || !ingredients.trim()}
          className="w-full py-2 bg-[#1f5129] text-white rounded-md hover:bg-[#1f5129]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Recipe...
            </div>
          ) : (
            "Generate Recipe"
          )}
        </button>
      </form>
    </div>
  );
}
