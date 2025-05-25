"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import MainForm from "@/components/MainForm";
import RecipeCard from "@/components/RecipeCard";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [recipeData, setRecipeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

   const [user, setUser] = useState(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

  const fetchRecipes = async (ingredients) => {
    try {
      const userId = user?.id;
      const response = await axios.post(`http://localhost:5000/api/recipe/recommendation`, { ingredients, userId}); // Use environment variable for API URL
      setRecipeData(response.data);
      console.log("response",response.data);
      
    } catch (err) {
      setError("Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (token) {  //token
      setIsAuthenticated(true);
    } else {
      router.push("/auth/login"); // Redirect to login page if not authenticated
    }
  }, []);

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="h-[100vh]">
      <Navbar />
      <div className="w-full flex ">
        {" "}
        <div className="h-[90vh] w-full  flex flex-col">
          <div className="h-[90%] w-full flex flex-wrap justify-center items-center gap-4 p-4 sm:p-2">
            <RecipeCard recipe={recipeData} />
          </div>
          <div className="w-full  flex justify-center ">
            <MainForm fetchRecipes={fetchRecipes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
