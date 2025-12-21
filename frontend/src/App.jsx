import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { supabase } from "./supabaseClient";
import AdminLogin from "./pages/AdminLogin";
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
     <><ToastContainer /><Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/homepage" element={<HomePage user={user} />} />
      <Route path="/profile" element={<ProfilePage user={user} />} />
      <Route path="/admin" element={<AdminLogin user={user} />} />
    </Routes></>
    
  );
}

export default App;
