import React from "react";
import LogoWithText from "../assets/LogoWithText.png"
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

    const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/HomePage',
      },
    });
    if (error) {
      console.error("Error during Google login:", error.message);
    } else {
      console.log("Google login successful:", data);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 font-poppins min-h-screen flex flex-col items-center bg-gray-100">
      <header className="flex justify-center mb-8 pt-6">
        <motion.img
        className="w-60" 
        src={LogoWithText} 
        alt="Student Vid Logo" 
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 120 }}
      />
      </header>
      <div className="bg-blue-100 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition duration-200">
            Sign In
          </button>
          <Link to="/register" className="text-xl text-gray-600 mt-5 inline-block cursor-pointer hover:text-gray-800 transition duration-200 w-full text-center">
            You don't have an account? Register
          </Link>
        </form>
      </div>
    </div>
  );
}