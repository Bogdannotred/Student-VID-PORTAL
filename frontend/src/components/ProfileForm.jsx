import React from "react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
 
export default function ProfileForm({ user }) {
  
  const [fullName , setFullName ] = useState("")
  const [university , setUniversity ] = useState("")
  const [specialization , setSpecialization] = useState("")


  const updateProfile = async (e) => {
    e.preventDefault();
    const { data , error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        university: university,
        specialization: specialization
      },
    });
    window.location.reload();
  }
  return (
    <div>
      <form onSubmit={updateProfile} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
            value = {fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="university">
            University
          </label>
          <input
            type="text"
            id="university"
            name="university"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your university"
            value = {university}
            onChange={(e) => setUniversity(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="specialization">
            Specialization
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your specialization"
            value = {specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Save Profile
        </button>
      </form> 
    </div>
  );
}