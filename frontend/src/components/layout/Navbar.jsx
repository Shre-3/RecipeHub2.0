import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ChefHat, Bookmark, Sparkles } from "lucide-react";

const Navbar = ({ onReset }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (onReset) {
      onReset();
    }
    navigate("/recipes");
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={handleLogoClick}
              className="flex items-center focus:outline-none"
            >
              <ChefHat className="h-8 w-8 text-[#1f5129]" />
              <span className="ml-2 text-xl font-bold text-[#1f5129]">
                Recipe Hub
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/ai-recipe-generator"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/ai-recipe-generator"
                      ? "bg-[#1f5129] text-white"
                      : "text-[#1f5129] hover:bg-[#1f5129]/10"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  AI Recipe Generator
                </Link>
                <Link
                  to="/bookmarks"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/bookmarks"
                      ? "bg-[#1f5129] text-white"
                      : "text-[#1f5129] hover:bg-[#1f5129]/10"
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  Bookmarks
                </Link>
                <span className="text-gray-700">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-[#1f5129] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1f5129]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f5129]"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="bg-[#1f5129] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1f5129]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f5129]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#1f5129] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1f5129]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f5129]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
