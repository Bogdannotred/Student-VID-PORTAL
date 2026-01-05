import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../lib/supabaseClient.js';
import { useMemo } from 'react';




export default function userList () {

    const [users , setUsers] = useState([])
    const [searchTerm , setSearchTerm] = useState("")


    const fetchUsers = async () => {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) {
            console.error("Error fetching users:", error);
            return;
        }
        setUsers(data.users);
    };


const filteredUsers = useMemo(() => {  
    return users.filter((user) => {
        const name = (user.user_metadata?.name || "").toLowerCase() ;
        const term = searchTerm.toLowerCase();
        

    return name.includes(term)

        

    });
}, [users, searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, []);

    return(
        <div className="w-full mx-auto p-3 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black flex justify-center align-center w-full">Users</h2>
            <div className='text-black flex justify-center align-center w-full overflow-x-auto mt-4 flex-col'>
                <div className='mb-4 justify-center flex'>
                    <input
                    className='bg-gray-200 mb-4 p-2 rounded border-2 border-blue-400 w-full md:w-1/2 shadow-md'
                    text='Search...'
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className='text-black border-b-2 border-gray-300 '>
                            <tr>
                                <th className='px-3 py-2'>Name</th>
                                <th className='px-3 py-2'>Email</th>
                                <th className='px-3 py-2'>Image</th>
                                <th className='px-3 py-2'>University</th>
                                <th className='px-3 py-2'>Specialization</th>
                            </tr>
                        </thead>
                        <tbody>

                            {filteredUsers.map((user) => (
                                <tr key={user.id} className='border-b border-gray-200 hover:bg-gray-100'>
                                    <td className='px-3 py-2 flex justify-center'>{user.user_metadata.name || 'N/A'}</td>
                                    <td className='px-3 py-2 flex-row justify-center'>{user.email}</td>
                                    <td className='px-3 py-2 flex-row justify-center'>
                                        {user.user_metadata.avatar_url ? (
                                            <img
                                                src={user.user_metadata.avatar_url}
                                                alt="User Avatar"
                                                className="w-10 h-10 rounded-full flex-row justify-center"
                                            />
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className='px-3 py-2 flex-row justify-center align-items'>{user.user_metadata.university || 'N/A'}</td>
                                    <td className='px-3 py-2 flex-row justify-center align-items'>{user.user_metadata.specialization || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}