import React from "react";
import QRCode from "react-qr-code";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function StudentCard() {

  const { user } = useAuth();

  const studentName = user?.user_metadata?.full_name || "Nume Student";
  const studentEmail = user?.email || "email@student.ro";
  const studentUniversity = user?.user_metadata?.university || "Universitatea";
  const studentSpecialization = user?.user_metadata?.specialization || "Specializare";
  const studentId = user?.id || "N/A";

  return (
    <div className="flex justify-center items-center py-10">
      <div className="relative w-[500px] h-[300px] bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden text-white border border-white/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-purple-400 opacity-20 blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-12 bg-white/10 backdrop-blur-sm flex items-center justify-between px-6 border-b border-white/10">
          <span className="text-xs font-bold tracking-widest uppercase opacity-80">Legitimație Student</span>
          <div className="w-12 h-3 bg-gray-900/40 rounded-full mx-auto absolute left-1/2 transform -translate-x-1/2 top-4"></div>
          <span className="text-xs font-mono opacity-70">2024-2025</span>
        </div>
        <div className="flex flex-row h-full pt-16 px-6 pb-6 gap-6">
          <div className="flex flex-col justify-between items-center w-1/3">
            <div className="w-28 h-28 bg-white/90 rounded-lg shadow-inner flex items-center justify-center border-2 border-white/30">
              <span className="text-6xl filter drop-shadow-md">🧑‍🎓</span> 
            </div>
            <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded flex items-center justify-center overflow-hidden border border-yellow-600/50 shadow-sm mt-auto mb-2 self-start">
              <div className="w-full h-full grid grid-cols-3 gap-[1px] bg-yellow-600/20">
                 <div className="border-r border-yellow-600/40"></div>
                 <div className="border-r border-yellow-600/40"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between w-2/3">
            
            <div className="space-y-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-blue-100 opacity-80">Nume & Prenume</p>
                <h2 className="text-lg font-bold leading-tight drop-shadow-sm truncate">{studentName}</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-1">
                <div>
                   <p className="text-[10px] uppercase tracking-wider text-blue-100 opacity-80">Universitate</p>
                   <p className="text-sm font-medium truncate">{studentUniversity}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-wider text-blue-100 opacity-80">Specializare</p>
                   <p className="text-sm font-medium truncate">{studentSpecialization}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end mt-2">
              <div className="flex flex-col">
                 <p className="text-[9px] uppercase tracking-wider text-blue-100 opacity-60">ID Unic</p>
                 <p className="font-mono text-[10px] opacity-80 truncate w-32">{studentId}</p>
              </div>
              
              <div className="bg-white p-1 rounded">
                <QRCode 
                  value={studentId} 
                  size={54} 
                  bgColor="#ffffff" 
                  fgColor="#000000" 
                  level="M" 
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}