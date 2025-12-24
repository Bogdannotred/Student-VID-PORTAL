import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast }  from 'react-toastify'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function DocumentUpload () {

    const [file , setFile] = useState(null)
    const [previewUrl , setPreviewUrl] = useState(null)
    const { user } = useAuth();
    const [inputSubject , setInputSubject] = useState("") 
    
    const handleUpload = async () => {
        try {
            if(inputSubject.length > 0)
            {
            const { data: storageData, error : storageError } = await supabase.storage.from('Documents').upload(`request_uploads/${user.id}/${Date.now()}`, file);
            const { error : dbError} = await supabase
                .from('requests')
                .insert({ 
                    issued_by : user.user_metadata.full_name,
                    student_id: user.id,
                    file_path: storageData.fullPath, 
                    status: 'pending' ,
                    subject : inputSubject
                });
            toast.success("File uploaded successfully!");
            console.log(user)
            }
            else
            {
                toast.error("Complete the subject input")
            }
        } catch (err) {
            toast.error("Upload error: " + err.message);
        }
    }
    const handleTableUpload = async () => {
        try {

            } catch (err) {
                console.log("Table Upload Error:", err);
            }
    }



    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
    }
    return(
    <div className="absolute bg-white w-full h-2/4 shadow-2xl flex flex-col justify-center items-center p-8">
        <div className="text-black m-2">
            Upload a request
        </div>
        <input 
            className="w-1/5 mb-5 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-blue-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
            placeholder="Subject"
            value={inputSubject}
            onChange={(e) => setInputSubject(e.target.value)}
            />
            
        <label 
            htmlFor="file-upload"
            className='bg-gray-200 w-80 h-40 flex flex-col justify-center items-center border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mb-4'
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
            onChange={(e) => {
                handleFileChange(e);
                handleTableUpload();
            }}
        />
        <div className='flex items-center justify-center'>
            <button 
                className='bg-blue-600 text-white font-bold px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed' 
                onClick={handleUpload}
                disabled={!file}
            >
                Upload
            </button>
        </div>
    </div>
    );
}