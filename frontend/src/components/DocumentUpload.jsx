import React , { useEffect , useState } from 'react'
import { supabase } from '../supabaseClient';

export default function DocumentUpload () {

    const [image , setImage] = useState(null)
    const [file , setFile] = useState(null)
    const [previewUrl , setPreviewUrl] = useState(null)

    const handleUpload = {

    }
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
    }

    return(
    <div className="mb-1">
        Image <span className="font-css top">*</span>
        <div className="">
            <input 
            type="file" 
            id="file-input" 
            name="ImageStyle"
            onChange={handleFileChange}
            />
        </div>
            <img
            alt="not found"
            width={"250px"}
            src={previewUrl}
          />
        <button onClick={handleUpload}>
            Upload
        </button>
    </div>
    );
}