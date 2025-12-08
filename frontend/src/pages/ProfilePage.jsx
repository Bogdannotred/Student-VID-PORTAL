import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ProfileForm from "../components/ProfileForm";
import StudentCard from "../components/StudentCard";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="text-black p-6 bg-gray-100">
        <Link to="/HomePage" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        {user && <StudentCard user={user} />}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Profile</h2>
        <ProfileForm onUserLoaded={setUser} />
      </main>
    </div>
  );
}