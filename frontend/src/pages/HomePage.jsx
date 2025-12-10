import React, { useState } from "react";
import Header from "../components/Header";
import StudentCard from "../components/StudentCard";
import DocumentUpload from "../components/DocumentUpload";
import { supabase } from "../supabaseClient";

export default function HomePage({ user }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gray-200">
      <Header user={user}/>
      <main className="text-black p-6">
        <StudentCard user={user} />
      </main>
      <div className="flex justify-center">
        <DocumentUpload/>
      </div>
    </div>
  );
}