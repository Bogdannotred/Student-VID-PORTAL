import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from '../lib/supabaseClient.js';


export default function DocumentList () {

    const { user } = useAuth();
    const [signedUrl, setSignedUrl] = useState();
    const [id , setId] = useState();
    const [status , setStatus] = useState();
    const [date , setDate] = useState();

        const getSignedUrl = async () => {
            try {
                const { data : datas, error } = await supabase
                    .from('requests')
                    .select('*')
                    .eq('student_id', user.id)
                    if (!datas || datas.length === 0) return;
                    const paths = datas.map(item => item.file_path.replace('Documents/', ''));
                    const dates = datas.map(item => item.date)
                    const status = datas.map(item => item.status);
                    const id = datas.map(item => item.file_path.replace('Documents/request_uploads/', '').split('/')[0]);
                    setId(id)
                    setStatus(status);
                    setDate(dates);
                    console.log("status" , status)
                    const { data , error : createSignedUrlError } = await supabase.storage
                        .from('Documents')
                        .createSignedUrls(paths, 1000);
                        const signedUrlsArray = data.map(item => item.signedUrl);

                        setSignedUrl(signedUrlsArray);
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
        <div className="max-w-4xl mx-auto p-3 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black flex justify-center align-center w-full">Your Documents</h2>
            <div className='text-black flex justify-center align-center w-full overflow-x-auto mt-4'>
                <table>
                    <thead className='text-black border-b-2 border-gray-300 gap-4'>
                        <tr>
                            <th className='px-3 py-2'>Document Image</th>
                            <th className='px-3 py-2'>Document ID</th>
                            <th className='px-3 py-2'>Document Status</th>
                            <th className='px-3 py-2'>Document Date</th>
                            <th className='px-3 py-2'>Document View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {signedUrl && signedUrl.map((url, index) => (
                            <tr className = 'flex justify-center' key = {index}>
                                <td className='w-20'>
                                    <img className='w-full h-auto max-w-[80px] md:max-w-[100px]' src={url} alt={`Document ${index + 1}`} />
                                </td>
                                <td>
                                    <a>{id[index]}</a>
                                </td>
                                <td>
                                    <a>{status[index]}</a>
                                </td>
                                <td>
                                    <a>{date[index]}</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}