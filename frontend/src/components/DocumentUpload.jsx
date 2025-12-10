import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Notification from './Notification'

export default function DocumentUpload ( { user }) {

    const [image , setImage] = useState(null)
    const [file , setFile] = useState(null)
    const [previewUrl , setPreviewUrl] = useState(null)
    const [uploadStatus , setUploadStatus] = useState(null)
    const [notification, setNotification] = useState({ message: '', type: '' });

    const triggerNotification = (message, type) => {
    setNotification({ message, type });
  };

    const handleUpload = async () => {
        const {data, error } = await supabase.storage.from('Documents').upload(`${user.id}/uploadssss` , file)
            if(error)
            {
                triggerNotification('Error uploading file' , 'error');
            }
            else
            {
                triggerNotification('Successfully uploaded.' , 'success')
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
            <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: '', type: '' })}
            />
        </div>
    </div>
    );
}