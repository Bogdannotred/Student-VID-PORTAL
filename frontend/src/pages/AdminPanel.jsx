import react from "react";
import DocumentListAdmin from "../components/DocumentListAdmin";
import CreateUser from "../components/CreateUser";
import UserList from "../components/userList";

    export default function AdminPanel() {


    return (
        <div className="h-auto flex flex-col items-center justify-start pt-10 bg-gray-200 px-4">
            <h1 className="text-2xl font-bold mb-4 text-black">Admin Panel</h1>
            <div className="w-full md:w-3/4 max-w-4xl bg-white p-6 rounded-lg shadow-md mb-10">
                <DocumentListAdmin />
            </div>
            <div className="w-full md:w-1/2 max-w-md bg-white p-6 rounded-lg shadow-md mb-10">
                <CreateUser/>
            </div>
            <div className="w-full md:w-11/12 max-w-6xl bg-white p-6 rounded-lg shadow-md">
                <UserList/>
            </div>
        </div>
    );
}