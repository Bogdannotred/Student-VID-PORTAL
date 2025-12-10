import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'


export default function DocumentUpload ( { user }) {

    const [image , setImage] = useState(null)
    const [file , setFile] = useState(null)
    const [previewUrl , setPreviewUrl] = useState(null)
    const [current_user , setCurrent_user] = useState(null)

    const handleUpload = async () => {
        const {data, error } = await supabase.storage.from('Documents').upload(`${user.id}/uploads` , file)
        if(error)
        {
            console.log(error)
        }
        else
        {
            console.log("Uploaded succesfuly")
        }
        }

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
    }
    
    return(
    <div className="absolute bg-white w-full h-1/4 shadow-2xl flex flex-col justify-center items-center p-8">
        <label 
            htmlFor="file-upload"
            className='bg-gray-200 w-80 h-40 flex flex-col justify-center items-center border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mb-4'
        >
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
            ) : (
                <div className="flex flex-col items-center justify-center text-center px-4">
                    <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
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