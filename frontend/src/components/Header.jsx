import { supabase } from "../lib/supabaseClient";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  

  function handleAvatarClick() {
    setIsDropdownOpen(!isDropdownOpen);
    console.log(user , isAdmin);
  }

async function handleLogOut() {
  try {
    await supabase.auth.signOut();
    navigate("/login"); 
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

  function handleAdminButton() {
    navigate("/admin");
  }

  return (
    <div className="relative pb-24">
  <header className="bg-blue-600 text-white h-20 p-4 shadow-md w-full flex justify-between items-center relative z-10">
  <div className="flex items-center gap-4">
    <button
      onClick={() => navigate(-1)}
      className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md"
      aria-label="Go back"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <h1 className="text-3xl font-bold">Student Vid</h1>
  </div>
  <div className="flex items-center gap-4">
    {isAdmin && (
      <button
        onClick={handleAdminButton}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full shadow-md transition-colors"
      >
        Admin Panel
      </button>
    )}
  </div>
</header>
      <div className="absolute left-1/2 top-20 transform -translate-x-1/2 -translate-y-1/2 z-30">
    
        <div
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-0 
          w-64 h-32 bg-white border-4 border-blue-600 border-t-0
          rounded-b-full shadow-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top z-10
          ${
            isDropdownOpen
              ? "opacity-100 scale-100 pt-16"
              : "opacity-0 scale-50 pt-0 pointer-events-none"
          }`}
        >
          <div className="relative w-full h-full">
            <div
              className="absolute top-[-40px] left-8 cursor-pointer group flex flex-col items-center justify-center transform -rotate-[-24deg] hover:scale-110 transition-transform"
              onClick={() => navigate("/profile")}
            >
              <span className="text-2xl group-hover:text-blue-600">👤</span>
              <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600">
                Profile
              </span>
            </div>

            <div
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2 cursor-pointer group flex flex-col items-center justify-center hover:scale-110 transition-transform"
              onClick={() => {}}
            >
              <span className="text-2xl group-hover:text-blue-600">⚙️</span>
              <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600">
                Settings
              </span>
            </div>
            <div
              className="absolute top-[-40px] right-8 cursor-pointer group flex flex-col items-center justify-center transform rotate-[-24deg] hover:scale-110 transition-transform"
              onClick={handleLogOut}
            >
              <span className="text-2xl text-red-500 group-hover:text-red-700">
                🚪
              </span>
              <span className="text-xs font-bold text-red-500 group-hover:text-red-700">
                Logout
              </span>
            </div>
          </div>
        </div>
        <div
          onClick={handleAvatarClick}
          className={`relative z-20 cursor-pointer w-24 h-24 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-300
             ${
               isDropdownOpen
                 ? "bg-white border-4 border-blue-600"
                 : "bg-gradient-to-b from-blue-700 to-blue-500 border-4 border-gray-200"
             }`}
        >
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="User Avatar"
              className="rounded-full w-[5.5rem] h-[5.5rem] object-cover border-4 border-white"
            />
          ) : user?.email ? (
            <span
              className={`text-4xl font-bold ${
                isDropdownOpen ? "text-blue-600" : "text-white"
              }`}
            >
              {user.email.charAt(0).toUpperCase()}
            </span>
          ) : (
            <span className="text-4xl text-white">?</span>
          )}
        </div>
      </div>
    </div>
  );
}