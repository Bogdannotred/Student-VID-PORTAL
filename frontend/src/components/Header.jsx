import React from "react";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Header() {
  const [data, setData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) return;
    const FetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setData(user);
    };
    FetchUser();
  }, []);

  function handleAvatarClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  function handleLogOut() {
    supabase.auth.signOut().then(() => {
      window.location.href = "/";

    });
  }

  return (
    <div className="relative bg-gray-100 min-h-screen pb-24">
      <header className="bg-blue-600 text-white h-20 p-4 shadow-md w-full flex justify-start items-center relative z-10">
        <h1 className="text-3xl font-bold">Student Vid</h1>
      </header>
      <div className="absolute left-1/2 top-20 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div 
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-0 
          w-64 h-32 bg-white border-4 border-blue-600 border-t-0
          rounded-b-full shadow-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top z-10
          ${isDropdownOpen ? 'opacity-100 scale-100 pt-16' : 'opacity-0 scale-50 pt-0 pointer-events-none'}`}
        >
            <div className="relative w-full h-full">
                <div 
                    className="absolute top-[-42px] left-8 cursor-pointer group flex flex-col items-center justify-center transform -rotate-[-24deg] hover:scale-110 transition-transform"
                    onClick={() => console.log("Profile Clicked")}
                >
                     <span className="text-2xl group-hover:text-blue-600">👤</span>
                     <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600">Profile</span>
                </div>
                <div 
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer group flex flex-col items-center justify-center hover:scale-110 transition-transform"
                    onClick={() => console.log("Settings Clicked")}
                >
                     <span className="text-2xl group-hover:text-blue-600">⚙️</span>
                     <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600">Settings</span>
                </div>
                <div 
                    className="absolute top-[-42px] right-8 cursor-pointer group flex flex-col items-center justify-center transform rotate-[-24deg] hover:scale-110 transition-transform"
                    onClick={handleLogOut}
                >
                     <span className="text-2xl text-red-500 group-hover:text-red-700">🚪</span>
                     <span className="text-xs font-bold text-red-500 group-hover:text-red-700">Logout</span>
                </div>

            </div>
        </div>
        <div
          onClick={handleAvatarClick}
          className={`relative z-20 cursor-pointer w-24 h-24 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-300
             ${isDropdownOpen 
                ? 'bg-white border-4 border-blue-600'
                : 'bg-gradient-to-b from-blue-700 to-blue-500 border-4 border-gray-200'}`} 
        >
          {data?.user_metadata?.avatar_url ? (
            <img
              src={data.user_metadata.avatar_url}
              alt="User Avatar"
              className="rounded-full w-[5.5rem] h-[5.5rem] object-cover border-4 border-white"
            />
          ) : data?.email ? (
            <span className={`text-4xl font-bold ${isDropdownOpen ? 'text-blue-600' : 'text-white'}`}>
                {data.email.charAt(0).toUpperCase()}
            </span>
          ) : (
            <span className="text-4xl text-white">?</span>
          )}
        </div>

      </div>
    </div>
  );
}