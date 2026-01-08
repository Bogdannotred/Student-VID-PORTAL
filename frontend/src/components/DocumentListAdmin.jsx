import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from '../lib/supabaseClient.js';

export default function DocumentListAdmin() {
    const { user } = useAuth();
    const [currentData, setCurrentData] = useState([]);
    const [signedUrls, setSignedUrls] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('requests')
            .select('*');
        if (error || !data) return [];
        setCurrentData(data);
        return data;
    };

    const getSignedUrl = async () => {
        try {
            const data = await fetchData();
            if (data.length === 0) return;

            const paths = data.map(item => item.file_path.replace('Documents/', ''));
            const { data: signedData, error } = await supabase.storage
                .from('Documents')
                .createSignedUrls(paths, 3600);
            if (signedData) {
                setSignedUrls(signedData.map(item => item.signedUrl));
            }
        } catch (error) {
            console.error('Error fetching signed URLs:', error);
        }
     
    };

    const handleActions = async (id, action) => {
        const newStatus = action === 'accept' ? 'accept' : 'denied';
        const { error } = await supabase
            .from('requests')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchData();
        }
    };

    useEffect(() => {
        if (user) {
            getSignedUrl();
        }
    }, [user]);

    const filteredData = currentData.filter((item) => {
        const search = searchTerm.toLowerCase();
        return (
            item.issued_by?.toLowerCase().includes(search) ||
            item.subject?.toLowerCase().includes(search) 
            
        );
    });

    return (
        <div className="w-full mx-auto p-3 bg-white rounded-lg shadow-md flex-col justify-center align-center">
            <h2 className="text-xl font-semibold text-black flex justify-center align-center w-full">Your Documents</h2>
            <div className='flex justify-center w-full pt-[10px]'>
                <input
                    className='bg-gray-200 w-full md:w-[300px] h-[35px] p-2 rounded shadow-md text-black'
                    placeholder='Search by name or issuer...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='text-black flex justify-center align-center w-full overflow-x-auto mt-4'>
                <table className="w-full">
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
                        {filteredData.map((item) => {
                            const originalIndex = currentData.findIndex(d => d.id === item.id);
                            const url = signedUrls[originalIndex];

                            return (
                                <tr className='border-b border-gray-200' key={item.id}>
                                    <td className='w-20 p-2 text-black'>{item.issued_by}</td>
                                    <td className='w-20 p-2 text-center'>
                                        {url && (
                                            <img 
                                                className='rounded object-cover w-[80px] h-[100px] border border-gray-200 shadow-sm mx-auto' 
                                                src={url} 
                                                alt="Document" 
                                            />
                                        )}
                                    </td>
                                    <td className="p-2 font-bold text-black">{item.subject}</td>
                                    <td className="p-2">
                                        <button className='bg-blue-300 p-1 rounded text-sm text-black'>{item.status}</button>
                                    </td>
                                    <td className="p-2 text-black">
                                        {item.created_at ? item.created_at.slice(0, 10) : ""}
                                    </td>
                                    <td className="p-2">
                                        <a className='text-blue-600 font-bold' href={url} target="_blank" rel="noreferrer">View Image</a>
                                    </td>
                                    <td className='flex flex-col md:flex-row gap-3 justify-center items-center p-5'>
                                        <button onClick={() => handleActions(item.id, 'accept')} className='bg-green-700 text-white px-4 py-2 rounded'>Accept</button>
                                        <button onClick={() => handleActions(item.id, 'denied')} className='bg-red-700 text-white px-4 py-2 rounded'>Deny</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}