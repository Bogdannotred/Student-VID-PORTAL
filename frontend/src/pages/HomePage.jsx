import React, { useState } from "react";
import Header from "../components/Header";
import StudentCard from "../components/StudentCard";
import DocumentUpload from "../components/DocumentUpload";

export default function HomePage() {

  
  return (
    <div className="min-h-screen bg-gray-200">
      <Header />
      <main className="text-black p-6">
        <StudentCard />
      </main>
        <DocumentUpload />
    </div>
  );
}