import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from '../lib/supabaseClient.js';


export default function DocumentListAdmin () {

    const { user } = useAuth();
    const [signedUrl, setSignedUrl] = useState();
    const [status , setStatus] = useState();
    const [date , setDate] = useState();
    const [id , setId] = useState();
    const [subject , setSubject] = useState([]);
    const [currentData , setCurrentData] = useState()
    const [paths , setPaths] = useState("")
    const [issuedName , setIssuedName] = useState("")

        const fetchData = async () => {
                const { data : datas, error } = await supabase
            .from('requests')
            .select('*')
            .eq('student_id', user.id)
            if (!datas || datas.length === 0) return; 
            setCurrentData(datas);
            const path = datas.map(item => item.file_path.replace('Documents/', ''));
            const dates = datas.map(item => item.created_at.slice(0,-13).replace("T" , " "))
            const status = datas.map(item => item.status);
            const id = datas.map(item => item.id);
            const names = datas.map(item => item.subject); 
            const issued = datas.map(item => item.issued_by); 
            setIssuedName(issued);
            setStatus(status);
            setDate(dates);
            setSubject(names);
            setId(id);
            setPaths(path);

            return path;
        }
 
        const getSignedUrl = async () => {
            try {
                
                const pathsThen = await fetchData()
                    const { data , error : createSignedUrlError } = await supabase.storage
                        .from('Documents')
                        .createSignedUrls(pathsThen, 1000);
                        const signedUrlsArray = data.map(item => item.signedUrl);

                        setSignedUrl(signedUrlsArray);
                }
                catch (error) {
                    console.error('Error fetching file path:', error);
            }
        };

        const handleActions = async (id , action) => {

            if(action === 'accept')
            {
                const { error } = await supabase
                    .from('requests')
                    .update({ status: 'accept' })
                    .eq('id', id)
                    fetchData()
            }
            else
            {
                const { error } = await supabase
                    .from('requests')
                    .update({ status: 'denied' })
                    .eq('id', id)
                    fetchData()
            }
        }

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
                    <thead className='text-black border-b-2 border-gray-300'>
                        <tr>
                            <th className='px-3 py-2'>Document Issued by</th>
                            <th className='px-3 py-2'>Document Image</th>
                            <th className='px-3 py-2'>Document Name</th>
                            <th className='px-3 py-2'>Document Status</th>
                            <th className='px-3 py-2'>Document Date</th>
                            <th className='px-3 py-2'>Document View</th>
                            <th className='px-3 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {signedUrl && signedUrl.map((url, index) => (
                            <tr className = '' key = {index}>
                                <td className='w-20'>
                                    <a className='text-black'>
                                        {issuedName[index]}
                                    </a>
                                </td>
                                <td className='w-20'>
                                    <img className='rounded object-cover w-[80px] h-[100px] border border-gray-200 shadow-sm'  src={url} alt={`Document ${index + 1}`} />
                                </td>
                                <td >
                                    <a className='text-black font-bold'>{subject[index]}</a>
                                </td>
                                <td >
                                    <button className='bg-blue-300  '>{status[index]}</button>
                                </td>
                                <td>
                                    <a className='text-black font-bold'>{date[index]}</a>
                                </td>
                                <td>
                                    <a className='text-black font-bold' href={url}>View Image</a>
                                </td>
                                <td className='flex gap-3 justify-center items-center p-5'>
                                    <button onClick={() => handleActions(id[index], 'accept')} className='bg-green-700 px-4 py-2'>Accept</button>
                                    <button onClick={() => handleActions(id[index], 'denied')} className='bg-red-700 px-4 py-2'>Deny</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}