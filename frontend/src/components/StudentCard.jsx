import React from "react";
import QRCode from "react-qr-code";

  export default function StudentCard({ user }) {

    const studentName = user?.user_metadata?.full_name || "N/A";
    const studentEmail = user?.email || "N/A";
    const studentUniversity = user?.user_metadata?.university || "N/A";
    const studentSpecialization = user?.user_metadata?.specialization || "N/A";
    const studentId = user?.id || "N/A";

  return (
    <div className="max-w-xl mx-auto  bg-white shadow-lg rounded-lg overflow-hidden mb-6 bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{studentName}</h2>
        <p className="text-gray-600 mb-1"><span className="font-semibold">Email:</span> {studentEmail}</p>
        <p className="text-gray-600 mb-1"><span className="font-semibold">Universitate:</span> {studentUniversity}</p>
        <p className="text-gray-600 mb-4"><span className="font-semibold">Specializare:</span> {studentSpecialization}</p>
        <div className="flex justify-center">
          <QRCode value={studentId} size={128} bgColor="#ffffff" fgColor="#000000" />
        </div>
      </div>
    </div>
  );

}