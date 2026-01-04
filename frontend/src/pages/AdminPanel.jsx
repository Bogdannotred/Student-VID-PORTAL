import react from "react";
import DocumentListAdmin from "../components/DocumentListAdmin";
import CreateUser from "../components/CreateUser";


    export default function AdminPanel() {


    return (
        <div className="h-screen flex flex-col items-center justify-start pt-10 bg-gray-200">
            <h1 className="text-2xl font-bold mb-4 text-black">Admin Panel</h1>
            <div className="w-3/4 max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <DocumentListAdmin />
            </div>
            <div className="h-[500px] w-[400px] pt-[50px] p-5 shadow-md bg-white mt-10 rounded-lg">
            <CreateUser/>
            </div>
        </div>
    );
}