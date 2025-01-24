import React from 'react';
import { Clock, Users } from 'lucide-react';

export function RecipeCard({ recipe, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-[#1f5129] text-[#f4f1e7]'
          : 'bg-[#f0e4cc] hover:bg-[#1f5129]/10'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full sm:w-24 h-24 rounded-md object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold mb-2">{recipe.name}</h3>
          {recipe.cookTime && recipe.servings && (
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {recipe.cookTime} mins
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {recipe.servings} servings
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}