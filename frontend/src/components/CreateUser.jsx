import { useState } from "react";
import { toast }  from 'react-toastify'
import { supabaseAdmin } from "../lib/supabaseClient";

export default function CreateUser () {

    const [email , setEmail] = useState("");
    const [name , setName] = useState("");
    const [pass , setPass] = useState("");

    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
                const { data, error } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: pass,
                user_metadata: { name: name }
                })
            
            if (error) throw error;

            toast.success("User created successfully");
        }
        catch (error) {
            console.error("Error creating user:", error);
            toast.error("Error creating user: " + error.message);
        }
    };

    return(
        <div className="bg-white w-full h-full flex-col justify-center align-center">
            <h1 className="text-black text-xl flex justify-center p-5 font-bold">Create a user</h1>
            <div className="flex justify-center ">
                <form className="flex flex-col w-full px-4" onSubmit={handleCreateUser}>
                    <label className="text-black font-bold">Enter email:</label>
                    <input
                    className="text-black bg-gray-200 border-blue-500 rounded border-2 w-full h-[50px] m-1 shadow-md"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    placeholder="Email"
                    />
                    <label className="text-black font-bold">Enter name:</label>
                    <input
                    className="text-black bg-gray-200 border-blue-500 rounded border-2 w-full h-[50px] m-1 shadow-md"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    name="name"
                    placeholder="Name"
                    />
                    <label className="text-black font-bold">Enter password:</label>
                    <input
                    className="text-black bg-gray-200 border-blue-500 rounded border-2 w-full h-[50px] m-1 shadow-md"
                    type="password"
                    onChange={(e) => setPass(e.target.value)}
                    value={pass}
                    name="password"
                    placeholder="Password"
                    />
                    <button
                    className="bg-blue-500 text-white rounded p-2 m-3"
                    type="submit"
                    >
                        Create User
                    </button>
                </form>
            </div>
        </div>
    );
}
