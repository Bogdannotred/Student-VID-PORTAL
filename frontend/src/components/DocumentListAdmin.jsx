import { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from '../lib/supabaseClient.js';

export default function DocumentListAdmin() {
    const { user } = useAuth();
    const [currentData, setCurrentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [uploadingId, setUploadingId] = useState(null);
    const [abortControllers, setAbortControllers] = useState({});

    const fetchData = useCallback(async () => {
        const { data: requests, error } = await supabase
            .from('requests')
            .select('*');
        if (error || !requests) {
            setCurrentData([]);
            return;
        }

        const filePaths = requests.map(r => r.file_path?.replace('Documents/', '')).filter(Boolean);
        const responseFilePaths = requests.map(r => r.response_file_path?.replace('Documents/', '')).filter(Boolean);

        let fileUrlMap = new Map();
        if (filePaths.length > 0) {
            const { data: fileUrlsData, error: fileUrlsError } = await supabase.storage.from('Documents').createSignedUrls(filePaths, 3600);
            if (fileUrlsError) {
                console.error("Error creating file signed URLs:", fileUrlsError.message);
            } else {
                fileUrlMap = new Map(fileUrlsData?.map(d => [d.path, d.signedUrl]));
            }
        }
    
        let responseFileUrlMap = new Map();
        if (responseFilePaths.length > 0) {
            const { data: responseFileUrlsData, error: responseFileUrlsError } = await supabase.storage.from('Documents').createSignedUrls(responseFilePaths, 3600);
            if (responseFileUrlsError) {
                console.error("Error creating response file signed URLs:", responseFileUrlsError.message);
            } else {
                responseFileUrlMap = new Map(responseFileUrlsData?.map(d => [d.path, d.signedUrl]));
            }
        }

        const requestsWithUrls = requests.map(request => ({
            ...request,
            fileUrl: request.file_path ? fileUrlMap.get(request.file_path.replace('Documents/', '')) : null,
            responseFileUrl: request.response_file_path ? responseFileUrlMap.get(request.response_file_path.replace('Documents/', '')) : null,
        }));

        setCurrentData(requestsWithUrls);
    }, []);

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

    const handleCancelUpload = (id) => {
        if (abortControllers[id]) {
            abortControllers[id].abort();
        }
    };

    const handleResponseUpload = async (id, file, oldResponsePath) => {
        if (!file) {
            return;
        }
        setUploadingId(id);
        const controller = new AbortController();
        setAbortControllers(prev => ({ ...prev, [id]: controller }));

        if (oldResponsePath) {
            const oldStoragePath = oldResponsePath.replace('Documents/', '');
            const { error: removeError } = await supabase.storage.from('Documents').remove([oldStoragePath]);
            if (removeError) {
                console.error('Error deleting old response file:', removeError);
            }
        }

        const filePath = `Responses/${id}-${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from('Documents')
            .upload(filePath, file, { upsert: true, signal: controller.signal });

        setAbortControllers(prev => {
            const newControllers = { ...prev };
            delete newControllers[id];
            return newControllers;
        });

        if (uploadError) {
            if (uploadError.name === 'AbortError') {
                alert('Upload cancelled.');
            } else {
                console.error('Error uploading file:', uploadError);
                alert('Error uploading file.');
            }
            setUploadingId(null);
            return;
        }

        const dbPath = `Documents/${filePath}`;

        const { error: dbError } = await supabase
            .from('requests')
            .update({ response_file_path: dbPath, response_read: false })
            .eq('id', id);

        if (dbError) {
            console.error('Error updating request:', dbError);
            alert('Error updating request record.');
        } else {
            alert('Response uploaded successfully.');
            fetchData();
        }
        setUploadingId(null);
    };

    const handleMarkAsRead = async (id) => {
        const { error } = await supabase
            .from('requests')
            .update({ response_read: true })
            .eq('id', id);

        if (error) {
            console.error('Error marking response as read:', error);
            alert(`Error marking response as read: ${error.message}`);
        } else {
            fetchData(); // Refresh data
            alert('Response marked as read.');
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, fetchData]);

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
                            <th className='px-3 py-2'>Actions</th>
                            <th className='px-3 py-2'>Add Response</th>
                            <th className='px-3 py-2'>Response Acknowledgment</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {filteredData.map((item) => {
                            return (
                                <tr className='border-b border-gray-200' key={item.id}>
                                    <td className='w-20 p-2 text-black'>{item.issued_by}</td>
                                    <td className='w-20 p-2 text-center'>
                                        {item.fileUrl && (
                                            <a href={item.fileUrl} target="_blank" rel="noreferrer">
                                                <img 
                                                    className='rounded object-cover w-[80px] h-[100px] border border-gray-200 shadow-sm mx-auto' 
                                                    src={item.fileUrl} 
                                                    alt="Document" 
                                                />
                                            </a>
                                        )}
                                    </td>
                                    <td className="p-2 font-bold text-black">{item.subject}</td>
                                    <td className="p-2">
                                        <button className='bg-blue-300 p-1 rounded text-sm text-black'>{item.status}</button>
                                    </td>
                                    <td className="p-2 text-black">
                                        {item.created_at ? item.created_at.slice(0, 10) : ""}
                                    </td>
                                    <td className='flex flex-col md:flex-row gap-3 justify-center items-center p-5'>
                                        <button onClick={() => handleActions(item.id, 'accept')} className='bg-green-700 text-white px-4 py-2 rounded'>Accept</button>
                                        <button onClick={() => handleActions(item.id, 'denied')} className='bg-red-700 text-white px-4 py-2 rounded'>Deny</button>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="file"
                                            id={`file-input-${item.id}`}
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                if (e.target.files?.length > 0) {
                                                    handleResponseUpload(item.id, e.target.files[0], item.response_file_path);
                                                }
                                            }}
                                            disabled={uploadingId !== null}
                                        />

                                        {uploadingId === item.id ? (
                                            <div className="flex items-center gap-2 justify-center">
                                                <span>Uploading...</span>
                                                <button
                                                    onClick={() => handleCancelUpload(item.id)}
                                                    className='bg-red-500 text-white px-2 py-1 rounded'
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : item.responseFileUrl ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <img 
                                                    className='rounded object-cover w-[80px] h-[100px] border border-gray-200 shadow-sm mx-auto cursor-pointer' 
                                                    src={item.responseFileUrl} 
                                                    alt="Response" 
                                                    onClick={() => {
                                                        if (uploadingId === null) {
                                                            document.getElementById(`file-input-${item.id}`).click();
                                                        }
                                                    }}
                                                />
                                                <a href={item.responseFileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View</a>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => document.getElementById(`file-input-${item.id}`).click()}
                                                className='bg-blue-500 text-white px-4 py-2 rounded'
                                                disabled={uploadingId !== null}
                                            >
                                                Upload Response
                                            </button>
                                        )}
                                    </td>
                                    <td className="p-2">
                                        {item.responseFileUrl && (
                                            <>
                                                {item.response_read ? (
                                                    <span className='text-green-700 font-bold'>Read</span>
                                                ) : (
                                                    <span className='text-red-700 font-bold'>Unread</span>
                                                )}
                                                {!item.response_read && (
                                                     <button
                                                        onClick={() => handleMarkAsRead(item.id)}
                                                        className='bg-gray-500 text-white px-2 py-1 rounded text-xs ml-2'
                                                    >
                                                        Mark Read
                                                    </button>
                                                )}
                                            </>
                                        )}
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