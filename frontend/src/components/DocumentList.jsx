import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from '../lib/supabaseClient.js';

export default function DocumentList () {

    const { user } = useAuth();
    const [signedUrl, setSignedUrl] = useState();
    const [status , setStatus] = useState();

        const getSignedUrl = async () => {
            try {
                const { data : datas, error } = await supabase
                    .from('requests')
                    .select('*')
                    .eq('student_id', user.id)
                    if (!datas || datas.length === 0) return;
                    const paths = datas.map(item => item.file_path.replace('Documents/', ''));
                    const status = datas.map(item => item.status);
                    setStatus(status);
                    const { data , error : createSignedUrlError } = await supabase.storage
                        .from('Documents')
                        .createSignedUrls(paths, 1000);
                        const signedUrlsArray = data.map(item => item.signedUrl);
                        setSignedUrl(signedUrlsArray);
                        console.log(data);
                }
                catch (error) {
                    console.error('Error fetching file path:', error);
            }

        };

        useEffect(() => {
            if (user)
            {
                getSignedUrl();
            }
        }, [user]);

    return(
    <>
        <div className="flex gap-4">
            <h2 className="text-xl font-semibold">Documents</h2>
            {signedUrl && 
                <ul className='flex-collumn gap-5'>
                    {signedUrl.map(url => (
                        <img className="border rounded" src={url} alt="Document" />
                    ))}
                </ul>
            }
            {status &&
                <ul className="flex-collumn gap-5">
                    {status.map((stat, index) => (
                        <li key={index} className="text-gray-700">Status of Document {index + 1}: {stat}</li>
                    ))}
                </ul>
            }
        </div>
    </>
    );
}