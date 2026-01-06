import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../lib/supabaseClient.js';
import { useMemo } from 'react';
import { toast } from 'react-toastify';




export default function userList () {

    const [users , setUsers] = useState([])
    const [searchTerm , setSearchTerm] = useState("")
    const [editingId , setEditingId] = useState();
    const [isEditing , setIsEditing] = useState(false);
    const [name , setName] = useState("")
    const [email , setEmail] = useState("")
    const [university , setUniveristy] = useState("")   
    const [specialization , setSpecialization] = useState("")
    const [year, setYear] = useState("")
    const [faculty, setFaculty] = useState("")
    

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


    const handleEditing = (user)  => {
        setEditingId(user.id)
        setIsEditing(true)
        setName(user.user_metadata.name || "")
        setEmail(user.email || "")
        setUniveristy(user.user_metadata.university || "")
        setSpecialization(user.user_metadata.specialization || "")
        setYear(user.user_metadata.year || "")
        setFaculty(user.user_metadata.faculty || "")
        fetchUsers()
    }

    const handleAccept = async (user)  =>{
        const { data , error } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            {
                email: email ,
                user_metadata: {
                    ...user.user_metadata,
                    email: email,
                    name: name,
                    full_name: name,
                    university: university,
                    specialization: specialization,
                    year: year,
                    faculty: faculty
                }
            }  
        )
        setIsEditing(false)
        fetchUsers()
        toast.success("Edited succesfuly")
    }

    const handleDelete = async (user) =>{
            const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
                user.id
            )
            if(error)
            {   
                console.log(error)
                toast.error(error)
            }       
            else
            {
                toast.success("Deleted succesfully")
            }
            fetchUsers()
    }

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
                                <th className='px-3 py-2'>Year</th>
                                <th className='px-3 py-2'>Faculty</th>
                                <th className='px-3 py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className='border-b border-gray-200 hover:bg-gray-100'>
                                    {/* NAME BOX */}
                                    <td className='px-3 py-2 text-center'>
                                        {editingId == user.id && isEditing ? (
                                            <input 
                                                className='w-full bg-gray-200 rounded border-black border-2 border-dotted text-center px-1' 
                                                placeholder="Name"
                                                defaultValue={user.user_metadata.name} 
                                                onChange={(e) => setName(e.target.value)}
                                            />                              
                                        ) : (
                                            user.user_metadata.name || 'N/A'
                                        )}
                                    </td>

                                    {/* EMAIL BOX */}
                                    <td className='px-3 py-2 text-center'>
                                        {editingId == user.id && isEditing ? (
                                            <input 
                                                className='w-full bg-gray-200 rounded border-black border-2 border-dotted text-center px-1' 
                                                placeholder="Email"
                                                defaultValue={user.email}
                                                onChange={(e) => setEmail(e.target.value)} 
                                            />                                          
                                        ) : (
                                            user.email || 'N/A'
                                        )}
                                    </td>

                                    {/* IMAGE BOX (Non-editable) */}
                                    <td className='px-3 py-2 flex justify-center'>
                                            <img
                                                src={user.user_metadata.avatar_url}
                                                alt="User Avatar"
                                                className="w-10 h-10 rounded-full"
                                            />
                                    </td>

                                    {/* UNIVERSITY BOX */}
                                    <td className='px-3 py-2 text-center'>
                                        {editingId == user.id && isEditing ? (
                                            <input 
                                                className='w-full bg-gray-200 rounded border-black border-2 border-dotted text-center px-1' 
                                                placeholder="University"
                                                defaultValue={user.user_metadata.university} 
                                                onChange={(e) => setUniveristy(e.target.value)}
                                            />                                           
                                        ) : (

                                            user.user_metadata.university || 'N/A'
                                        )}
                                    </td>
                                    {/* SPECIALIZATION BOX */}
                                    <td className='px-3 py-2 text-center'>
                                        {editingId == user.id && isEditing ? (
                                            <input 
                                                className='w-full bg-gray-200 rounded border-black border-2 border-dotted text-center px-1' 
                                                placeholder="Specialization"
                                                defaultValue={user.user_metadata.specialization} 
                                                onChange={(e) => setSpecialization(e.target.value)}
                                            />                             
                                        ) : (

                                            user.user_metadata.specialization || 'N/A'
                                        )}
                                    </td>

                                    {/* YEAR BOX */}
                                    <td className='px-3 py-2 text-center'>
                                        {editingId == user.id && isEditing ? (
                                            <input 
                                                className='w-full bg-gray-200 rounded border-black border-2 border-dotted text-center px-1' 
                                                placeholder="Year"
                                                defaultValue={user.user_metadata.year} 
                                                onChange={(e) => setYear(e.target.value)}
                                            />                             
                                        ) : (

                                            user.user_metadata.year || 'N/A'
                                        )}
                                    </td>

                                    {/* FACULTY BOX */}
                                    <td className='px-3 py-2 text-center'>
                                        {editingId == user.id && isEditing ? (
                                            <input 
                                                className='w-full bg-gray-200 rounded border-black border-2 border-dotted text-center px-1' 
                                                placeholder="Faculty"
                                                defaultValue={user.user_metadata.faculty} 
                                                onChange={(e) => setFaculty(e.target.value)}
                                            />                             
                                        ) : (

                                            user.user_metadata.faculty || 'N/A'
                                        )}
                                    </td>

                                    {/* ACTIONS BOX */}
                                    <td className='px-3 py-2 text-center'>
                                        <div className='flex justify-center gap-1'>
                                            <button className='bg-blue-300 px-2 py-1 rounded' onClick={() => {handleEditing(user); setIsEditing(!isEditing);}}>
                                                {editingId === user.id & isEditing ?  "Cancel" : "Edit"}
                                            </button>
                                            <button className='bg-green-500 text-white px-2 py-1 rounded' onClick={() => handleAccept(user)}>Accept</button>
                                            <button className='bg-red-700 text-white px-2 py-1 rounded' onClick={() => handleDelete(user)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}