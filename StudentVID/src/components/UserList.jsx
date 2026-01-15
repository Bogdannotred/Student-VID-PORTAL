import { useEffect, useState, useMemo } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabaseClient.js';
import { toast } from 'react-toastify';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [editForm, setEditForm] = useState({
        name: "",
        specialization: "",
        year: "",
        university: "",
        faculty: ""
    });

    const fetchUsers = async () => {
        setLoading(true);
         const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        
        if (error) {
            toast.error("Error fetching users");
             setLoading(false);
            return;
        }

        const usersWithAvatars = await Promise.all(
            data.users.map(async (user) => {
                const rawPath = user.user_metadata?.avatar_path;
                 let displayAvatar = null;
 
                if (rawPath) {
                    const cleanPath = rawPath.replace(/^Documents\//, '').replace(/^\//, '').split('?')[0];
                    const { data: signedData } = await supabase.storage
                        .from('Documents')
                        .createSignedUrl(cleanPath, 3600);
                    displayAvatar = signedData?.signedUrl;
                }
                return { ...user, display_avatar: displayAvatar };
            })
        );

        setUsers(usersWithAvatars);
         setLoading(false);
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setEditForm({
            name: user.user_metadata?.name || "",
            specialization: user.user_metadata?.specialization || "",
             year: user.user_metadata?.year || "",
            university: user.user_metadata?.university || "",
            faculty: user.user_metadata?.faculty || ""
        });
    };

    const handleSave = async (user) => {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            user_metadata: { ...user.user_metadata, ...editForm }
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("User updated");
            setEditingId(null);
            fetchUsers();
        }
    };

    const handleDelete = async (id) => {
               if (window.confirm("Are you sure?")) {
            await supabaseAdmin.auth.admin.deleteUser(id);
             fetchUsers();
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

     const filteredUsers = useMemo(() => {
        return users.filter(u => 
               (u.user_metadata?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const inputStyle = "bg-gray-800 text-white p-1 rounded border-none w-full text-sm";

      return (
            <div className="p-5 bg-gray-50   min-h-screen text-gray-800 font-sans">
              <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                     <div className="flex justify-between  items-center mb-6 border-b pb-4">
                      <h1 className="text-2xl font-bold">Student Management System</h1>
                      <input 
                        type="text"
                          placeholder="Search students..."
                         className="border border-gray-300 p-2 rounded w-72 focus:outline-none focus:border-blue-500"
                         value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 border">Photo</th>
                            <th className="p-3 border">Name</th>
                                <th className="p-3 border">Specialization</th>
                             <th className="p-3 border">Year</th>
                            <th className="p-3 border">University</th>
                            <th className="p-3 border">Faculty</th>
                             <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                         <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="p-10 text-center">Fetching records...</td></tr>
                         ) : filteredUsers.map(user => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-3 border text-center">
                                     <div className="flex justify-center">
                                        {user.display_avatar ? (
                                            <img 
                                                src={user.display_avatar} 
                                                className="w-10 h-10 rounded-full border object-cover"
                                                alt="User"
                                                 onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full    bg-blue-600 text-white flex items-center justify-center font-bold text-lg border">
                                                {user.user_metadata?.name?.charAt(0).toUpperCase() || "S"}
                                             </div>
                                        )}
                                    </div>
                                 </td>
                                <td className="p-3 border">
                                    {editingId === user.id ? 
                                        <input className={inputStyle} value={editForm.name}   onChange={(e) => setEditForm({...editForm, name: e.target.value})} /> 
                                        : user.user_metadata?.name }
                                </td>
                                <td className="p-3 border">
                                    {editingId === user.id ? 
                                        <input className={inputStyle} value= {editForm.specialization} onChange={(e) => setEditForm({...editForm, specialization: e.target.value})} /> 
                                               : user.user_metadata?.specialization }
                                </td>
                                    <td className="p-3 border text-center">
                                    {editingId === user.id ? 
                                        <input className={inputStyle} value={editForm.year} onChange={(e) =>   setEditForm({...editForm, year: e.target.value})} /> 
                                                : user.user_metadata?.year }
                                </td>
                                 <td className="p-3 border">
                                    {editingId === user.id ? 
                                        <input className={inputStyle} value={editForm.university} onChange={(e) =>   setEditForm({...editForm, university: e.target.value})} /> 
                                                   : user.user_metadata?.university || "N/A"}
                                   </td>
                                <td className="p-3 border">
                                              {editingId === user.id ? 
                                        <input className={inputStyle} value={editForm.faculty} onChange={(e) => setEditForm({...editForm, faculty: e.target.value})} /> 
                                        : user.user_metadata?.faculty || "N/A"}
                                   </td>
                                <td className="p-3 border">
                                       <div className="flex gap-4 justify-center     font-bold text-sm">
                                           {editingId === user.id ? (
                                               <button onClick={() => handleSave(user)} className="text-green-600 hover:underline">SAVE</button>
                                          ) : (
                                            <button onClick={() => handleEdit(user)} className="text-blue-600  bg-hover:underline">EDIT</button>
                                               )}
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">DELETE</button>
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