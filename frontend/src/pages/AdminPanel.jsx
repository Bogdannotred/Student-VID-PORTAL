import react from "react";
import DocumentList from "../components/DocumentList";


    export default function AdminPanel() {


    return (
        <div className="h-screen flex flex-col items-center justify-start pt-10 bg-gray-200">
            <h1 className="text-2xl font-bold mb-4 text-black">Admin Panel</h1>
            <div className="w-3/4 max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <DocumentList />
            </div>
        </div>
    );
}