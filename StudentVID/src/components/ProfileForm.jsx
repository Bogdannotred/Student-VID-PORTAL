import React from "react";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { toast } from 'react-toastify';
export default function ProfileForm() {
      const [file , setFile] = useState(null)
      const [previewUrl , setPreviewUrl] = useState(null)
      const { user } = useAuth();
      
      const handleUpload = async () => {
          try {
             if (!file) {
                  toast.error("Please select a file to upload.");
                  return;
              }
              const filePath = `profile_photos/${user.id}/avatar.jpg`;
              const { data: storageData, error : storageError } = await supabase.storage.from('Documents').upload(filePath, file, {
                upsert: true
              });
              if (storageError) {
                  throw storageError;
              }

              const { error: updateError } = await supabase.auth.updateUser({
                data: {
                  avatar_path: filePath,
                }
              })
  
              if (updateError) {
                  throw updateError;
              }

              toast.success("Profile photo updated successfully!");
          } catch (err) {
              toast.error("Update error: " + err.message);
          }
      }
  
      const handleFileChange = (e) => {
          const selected = e.target.files[0];
          setFile(selected);
          setPreviewUrl(URL.createObjectURL(selected));
      }

  return (
   <div className="absolute bg-white w-full h-2/4 shadow-2xl flex flex-col justify-center items-center p-8">
        <div className="text-black m-2 font-bold text-lg ">
            Upload a profile photo
        </div>
            
        <label 
            htmlFor="file-upload"
            className='bg-gray-200 w-80 h-40 flex flex-col justify-center items-center border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mb-4 shadow-md'
        >
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
            ) : (
                <div className="flex flex-col items-center justify-center text-center px-4">
                    <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm">PNG, JPG or PDF (max. 10MB)</p>
                </div>
            )}
        </label>
        <input 
            className='hidden'
            type="file" 
            id="file-upload" 
            name="ImageStyle"
            onChange={handleFileChange}
        />
        <div className='flex items-center justify-center'>
            <button 
                className='shadow-xl bg-blue-600 text-white font-bold px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed' 
                onClick={handleUpload}
                disabled={!file}
            >
                Upload
            </button>
        </div>
    </div>
  );
}