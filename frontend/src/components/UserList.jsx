import { useEffect, useState, useMemo } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabaseClient.js';
import { toast } from 'react-toastify';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [university, setUniversity] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [year, setYear] = useState("");
    const [faculty, setFaculty] = useState("");

    const fetchUsers = async () => {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) {
            console.error("Error fetching users:", error);
            return;
        }

        const usersWithAvatars = await Promise.all(
            data.users.map(async (user) => {
                let avatarUrl = user.user_metadata?.avatar_url;
                if (avatarUrl && !avatarUrl.startsWith('http://googleusercontent.com')) {
                    let cleanPath = avatarUrl;
                    if (avatarUrl.includes('/Documents/')) {
                        cleanPath = avatarUrl.split('/Documents/')[1].split('?')[0];
                    }

                    const { data: signedUrlData } = await supabase.storage
                        .from('Documents')
                        .createSignedUrl(cleanPath, 3600);

                    avatarUrl = signedUrlData?.signedUrl;
                }
                
                return { ...user, display_avatar: avatarUrl }
          ;
            })
            
        );
        setUsers(usersWithAvatars);
        
    };
    

    const filteredUsers = useMemo(() => {  
        return users.filter((user) => 
            (user.user_metadata?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleEditing = (user) => {
        if (editingId === user.id && isEditing) {
            setEditingId(null);
            setIsEditing(false);
            setName("");
            setEmail("");
            setUniversity("");
            setSpecialization("");
            setYear("");
            setFaculty("");
        } else {
            setEditingId(user.id);
            setIsEditing(true);
            setName(user.user_metadata.name || "");
            setEmail(user.email || "");
            setUniversity(user.user_metadata.university || "");
            setSpecialization(user.user_metadata.specialization || "");
            setYear(user.user_metadata.year || "");
            setFaculty(user.user_metadata.faculty || "");
        }
    };



    const handleAccept = async (user) => {
        let storagePath = user.user_metadata.avatar_url;
        if (storagePath && storagePath.includes('/Documents/')) {
            storagePath = storagePath.split('/Documents/')[1].split('?')[0];
        }

        const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            email: email,
            user_metadata: {
                ...user.user_metadata,
                name: name,
                university: university,
                specialization: specialization,
                year: year,
                faculty: faculty,
                avatar_url: storagePath 
            }
        });

        if (error) {
            toast.error(error.message);
        } else {
            setIsEditing(false);
            fetchUsers();
            toast.success("Edited successfully");
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div className="w-full mx-auto p-3 bg-white rounded-lg shadow-md text-black">
            <h2 className="text-xl font-semibold flex justify-center w-full mb-4">Users</h2>
            <div className='flex justify-center mb-4'>
                <input
                    className='bg-gray-100 p-2 rounded border-2 border-blue-400 w-full md:w-1/2'
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className='border-b-2 border-gray-300'>
                        <tr>
                            <th className='px-3 py-2'>Name</th>
                            <th className='px-3 py-2'>Email</th>
                            <th className='px-3 py-2'>Image</th>
                            <th className='px-3 py-2'>University</th>
                            <th className='px-3 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className='border-b border-gray-100 hover:bg-gray-50'>
                                <td className='px-3 py-2'>
                                    {editingId === user.id && isEditing ? 
                                        <input className='border rounded p-1 w-full' value={name} onChange={e => setName(e.target.value)} /> 
                                        : (user.user_metadata.name || 'N/A')}
                                </td>
                                <td className='px-3 py-2'>
                                    {editingId === user.id && isEditing ? 
                                        <input className='border rounded p-1 w-full' value={email} onChange={e => setEmail(e.target.value)} /> 
                                        : user.email}
                                </td>
                                
                                {/* IMAGE BOX - Fixed Fallback */}
                                <td className='px-3 py-2 flex justify-center'>
                                    {user.display_avatar ? (
                                        <img
                                            src={user.display_avatar}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                            {user.user_metadata.name ? user.user_metadata.name.charAt(0).toUpperCase() : 'N/A'}
                                        </div>
                                    )}
                                </td>

                                <td className='px-3 py-2'>
                                    {editingId === user.id && isEditing ? 
                                        <input className='border rounded p-1 w-full' value={university} onChange={e => setUniversity(e.target.value)} /> 
                                        : (user.user_metadata.university || 'N/A')}
                                </td>

                                <td className='px-3 py-2'>
                                    <div className='flex justify-center gap-1'>
                                        <button className='bg-blue-300 px-2 py-1 rounded' onClick={() => handleEditing(user)}>
                                            {editingId === user.id && isEditing ? "Cancel" : "Edit"}
                                        </button>
                                        {editingId === user.id && isEditing && (
                                            <button className='bg-green-500 text-white px-2 py-1 rounded' onClick={() => handleAccept(user)}>Save</button>
                                        )}
                                        <button className='bg-red-700 text-white px-2 py-1 rounded' onClick={() => {
                                            if(window.confirm("Delete user?")) supabaseAdmin.auth.admin.deleteUser(user.id).then(() => fetchUsers())
                                        }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}