import React from "react";
import LogoWithText from "../assets/LogoWithText.png"
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabaseClient.js";
import { toast } from "react-toastify";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login for:", email, "with password length:", password.length); // Debugging
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Login successful!'); 
      navigate('/HomePage');
    }
  };

    const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: '/HomePage', 
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Google login successfuly!');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 font-poppins min-h-screen flex flex-col items-center justify-center p-4">
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
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full text-white px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900"
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
              className="w-full px-4 py-3  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 px-4 mb-4 shadow-md">
            Sign In
          </button>
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 shadow-md"
        >
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              className="h-6 w-6 mr-2" 
              alt="Google" 
            />
            Sign in with Google
          </button>
        </form>
      </div>  
    </div>
  );
}