import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import StudentCard from "../components/StudentCard";
import DocumentUpload from "../components/DocumentUpload";
import DocumentList from "../components/DocumentList";
import { supabase } from "../supabaseClient";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

      const { data, error } = await supabase.storage
      .from('documents')
      .list(user.id, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

      if (error) {
      console.error('Error fetching documents:', error.message);
    } else {
      setDocuments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200">
      <Header />
      <main className="text-black p-6">
        <StudentCard user={user} />
        <DocumentUpload onUpload={fetchDocuments} />
        <DocumentList documents={documents} loading={loading} onDelete={fetchDocuments} />
      </main>
    </div>
  );
}