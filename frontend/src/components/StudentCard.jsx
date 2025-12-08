import React from "react";
import QRCode from "react-qr-code";

  export default function StudentCard({ user }) {
  const studentName = user?.user_metadata?.full_name || "Student Necunoscut";
  const studentEmail = user?.email || "student@facultate.ro";
  const studentId = user?.id || "NO-ID"; 

  return (
    <div className="flex justify-center items-center p-6 font-poppins">
      <div className="relative w-96 h-56 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl shadow-2xl overflow-hidden text-white border border-blue-400/30">
        
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-[-50px] left-[-20px] w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col justify-between h-full p-5">
          
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-90">{user?.user_metadata?.university || 'Universitatea X'}</h2>
              <p className="text-xs opacity-80">Legitimație Digitală</p>
            </div>
            <div className="text-3xl opacity-90">🎓</div>
          </div>

          <div className="flex justify-between items-end mt-4">
          
      
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase text-blue-200 opacity-80">Nume Student</span>
              <p className="font-bold text-lg leading-tight truncate w-40">{studentName}</p>
              
              <span className="text-xs uppercase text-blue-200 mt-2 opacity-80">Specializare</span>
              <p className="text-sm font-medium opacity-90">{user?.user_metadata?.specialization || 'N/A'}</p>

              <span className="text-xs uppercase text-blue-200 mt-2 opacity-80">ID Matricol</span>
              <p className="text-sm font-mono tracking-wider opacity-90">{user?.user_metadata?.NrMatricol || 'N/A'}</p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-md">
              <QRCode 
                value={studentId} 
                size={64} 
                level="L" 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}