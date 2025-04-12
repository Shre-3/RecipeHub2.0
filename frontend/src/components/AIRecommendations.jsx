import React, { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
import { RecipeCard } from "./RecipeCard";

export function AIRecommendations({ onSelectRecipe }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    cuisineTypes: [],
    cookingTime: "any",
    difficulty: "any",
  });

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Low-Carb",
    "Keto",
    "Paleo",
    "Nut-Free",
  ];

  const cuisineOptions = [
    "Italian",
    "Mexican",
    "Chinese",
    "Indian",
    "Japanese",
    "Thai",
    "Mediterranean",
    "American",
    "French",
    "Middle Eastern",
  ];

  const handlePreferenceChange = (category, value) => {
    setPreferences((prev) => {
      if (category === "dietaryRestrictions" || category === "cuisineTypes") {
        // Toggle the value in the array
        const currentValues = [...prev[category]];
        const index = currentValues.indexOf(value);

        if (index === -1) {
          currentValues.push(value);
        } else {
          currentValues.splice(index, 1);
        }

        return {
          ...prev,
          [category]: currentValues,
        };
      } else {
        // For other categories, just set the value
        return {
          ...prev,
          [category]: value,
        };
      }
    });
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_AI}/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRecommendations(response.data);
    } catch (err) {
      setError("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-[#1f5129]" />
        <h2 className="text-xl font-bold text-[#1f5129]">
          AI Recipe Recommendations
        </h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1f5129] mb-3">
          Your Preferences
        </h3>

        <div className="mb-4">
          <h4 className="font-medium text-emerald-800 mb-2">
            Dietary Restrictions
          </h4>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <button
                key={option}
                onClick={() =>
                  handlePreferenceChange("dietaryRestrictions", option)
                }
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  preferences.dietaryRestrictions.includes(option)
                    ? "bg-[#1f5129] text-white"
                    : "bg-[#1f5129]/10 text-[#1f5129] hover:bg-[#1f5129]/20"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-emerald-800 mb-2">Cuisine Types</h4>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((option) => (
              <button
                key={option}
                onClick={() => handlePreferenceChange("cuisineTypes", option)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  preferences.cuisineTypes.includes(option)
                    ? "bg-[#1f5129] text-white"
                    : "bg-[#1f5129]/10 text-[#1f5129] hover:bg-[#1f5129]/20"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-emerald-800 mb-2">Cooking Time</h4>
          <div className="flex gap-2">
            {[
              "any",
              "quick (< 30 min)",
              "medium (30-60 min)",
              "long (> 60 min)",
            ].map((option) => (
              <button
                key={option}
                onClick={() => handlePreferenceChange("cookingTime", option)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  preferences.cookingTime === option
                    ? "bg-[#1f5129] text-white"
                    : "bg-[#1f5129]/10 text-[#1f5129] hover:bg-[#1f5129]/20"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-emerald-800 mb-2">Difficulty</h4>
          <div className="flex gap-2">
            {["any", "easy", "medium", "hard"].map((option) => (
              <button
                key={option}
                onClick={() => handlePreferenceChange("difficulty", option)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  preferences.difficulty === option
                    ? "bg-[#1f5129] text-white"
                    : "bg-[#1f5129]/10 text-[#1f5129] hover:bg-[#1f5129]/20"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={fetchRecommendations}
          className="w-full py-2 bg-[#1f5129] text-white rounded-md hover:bg-[#1f5129]/90 transition-colors"
        >
          Get Recommendations
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 text-[#1f5129] animate-spin" />
        </div>
      )}

      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      {recommendations.length > 0 && !loading && (
        <div>
          <h3 className="text-lg font-semibold text-[#1f5129] mb-4">
            Recommended for You
          </h3>
          <div className="space-y-4">
            {recommendations.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => onSelectRecipe(recipe)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
