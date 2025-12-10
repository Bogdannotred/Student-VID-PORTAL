import React from "react";
import { useState } from "react";
 
export default function ProfileForm({ user }) {
  
  const [fullName , setFullName ] = useState("")
  const [university , setUniversity ] = useState("")
  const [specialization , setSpecialization] = useState("")

  function handleSubmit() {
    
  }

  return (
    <div>
      <form className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
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
          onSubmit={handleSubmit}
        >
          Save Profile
        </button>
      </form> 
    </div>
  );
}
