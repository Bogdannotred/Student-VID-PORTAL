import { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from '../lib/supabaseClient.js';

export default function DocumentListUser() {
    const { user } = useAuth();
     const [documents, setDocuments] = useState([]);

   
    const fetchDocuments = useCallback(async () => {
        if (!user) return;

        const { data: requests, error: requestsError } = await supabase
            .from('requests')
            .select('*')
     
            .eq('student_id', user.id);

        if (requestsError) {
            console.error('Error fetching requests:', requestsError);
            return;
        }
     
        if (!requests || requests.length === 0) {
            setDocuments([]);
            return;
  
        }

     
        const filePaths = requests.map(r => r.file_path?.replace('Documents/', '')).filter(Boolean);
        const responseFilePaths = requests.map(r => r.response_file_path?.replace('Documents/', '')).filter(Boolean);

  
        let fileUrlMap = new Map();
        if (filePaths.length > 0) {
            const { data: fileUrlsData, error: fileUrlsError } = await supabase.storage.from('Documents').createSignedUrls(filePaths, 3600);
            if (fileUrlsError) {
                console.error('Error getting file URLs:', fileUrlsError);
            } else {
  
                fileUrlMap = new Map(fileUrlsData?.map(d => [d.path, d.signedUrl]));
            }
        }

           let responseFileUrlMap = new Map();
            if (responseFilePaths.length > 0) {


              const { data: responseFileUrlsData, error: responseFileUrlsError } = await supabase.storage.from('Documents').createSignedUrls(responseFilePaths, 3600);
                 if (responseFileUrlsError) {

 
     
                    console.error('Error getting response file URLs:', responseFileUrlsError);
 

            } else {
                     responseFileUrlMap = new Map(responseFileUrlsData?.map(d => [d.path, d.signedUrl]));
    
                    }
        }

        const documentsWithUrls = requests.map(request => ({
            ...request,
    
            fileUrl: request.file_path ? fileUrlMap.get(request.file_path.replace('Documents/', '')) : null,
    
             responseFileUrl: request.response_file_path ? responseFileUrlMap.get(request.response_file_path.replace('Documents/', '')) : null,
         }));

        setDocuments(documentsWithUrls);
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchDocuments();
  
        }
    }, [user, fetchDocuments]);

    const handleCancelRequest = async (doc) => {
        if (window.confirm("Are you sure you want to cancel this document request? This action cannot be undone.")) {
 
            
            const filePath = doc.file_path?.replace('Documents/', '');
            if (filePath) {
                const { error: storageError } = await supabase.storage.from('Documents').remove([filePath]);
                 if (storageError) {
        
                    console.error("Error deleting file from storage:", storageError);
                    alert(`Error deleting document file: ${storageError.message}`);
                    return;
                }
            }
    

            
            const { error: dbError } = await supabase
                .from('requests')
                    .delete()


        
        
                   .eq('id', doc.id);
    
            if (dbError) {
                console.error('Error canceling request:', dbError);

        
        
                alert(`Error canceling request: ${dbError.message}`);
            } else {
                 alert('Request cancelled successfully.');
                fetchDocuments();
            }
        }
    };
     const handleMarkAsRead = async (id) => {
           const { error } = await supabase.from('requests').update({ response_read: true }).eq('id', id);
        if (!error) {
     fetchData();
            alert('Response marked as read.');
        }
    };
    return (
        
       <div className="max-w-4xl mx-auto p-3 bg-white rounded-lg shadow-md">
        
            <h2 className="text-xl font-semibold text-black flex justify-center align-center w-full">Your Documents</h2>
            <div className='text-black flex justify-center align-center w-full overflow-x-auto mt-4'>
                <table className="w-full">
                     <thead className='text-black border-b-2 border-gray-300'>
                        <tr>
            
                            <th className='px-3 py-2'>Document Issued by</th>
                            <th className='px-3 py-2'>Document Image</th>
                 
                            <th className='px-3 py-2'>Response Image</th>
                            <th className='px-3 py-2'>Response Acknowledgment</th>
                            <th className='px-3 py-2'>Document Name</th>
                            <th className='px-3 py-2'>Document Status</th>
                            <th className='px-3 py-2'>Document Date</th>
                             <th className='px-3 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {documents.map((doc) => (
                             <tr className='border-b border-gray-200' key={doc.id}>
                                <td className='w-20 p-2 text-black'>{doc.issued_by}</td>
                
                
                               <td className='w-20 p-2'>
                                    {doc.fileUrl && (
                                        <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                                         <img className='rounded object-cover w-[80px] h-[100px] border border-gray-200 shadow-sm mx-auto' src={doc.fileUrl} alt="Document" />
                                        </a>
               
               )}
                                </td>
                                <td className='w-20 p-2'>
                                    {doc.responseFileUrl && (
                                    <img className='rounded object-cover w-[80px] h-[100px] border border-gray-200 shadow-sm mx-auto' src={doc.responseFileUrl} alt="Response" />
                                    )}
                            </td>



                             <td className='p-2'>
                                    {doc.responseFileUrl ? (
                                         <>
                                            {!doc.response_read ? (
                                                <button
                                                    onClick={() => handleMarkAsRead(doc.id)}
                                                    className='bg-green-500 text-white px-3 py-1 rounded text-sm'
                                                >
                                           Mark as Read
                                                </button>
                                            ) : (
                                                <span className='text-green-700 font-bold'>Read</span>
                                            )}
                                        </>
                                  ) : (
                                        <span className='text-gray-500'>No response yet</span>
                                    )}

                                </td>
                                <td className="p-2 font-bold text-black">{doc.subject}</td>
                                <td className="p-2">

                                    <button className='bg-blue-300 p-1 rounded text-sm text-black'>{doc.status}</button>
                              </td>

                                <td className="p-2 text-black">

                                    {doc.created_at ? doc.created_at.slice(0, 10) : ""}
                                </td>

                                <td className="p-2">
                                      {doc.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancelRequest(doc)}
                                        className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm'
                                        >

                                            Cancel
                                        </button>

                                    )}
                                </td>
                            </tr>

                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
