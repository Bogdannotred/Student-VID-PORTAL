import react from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import DocumentListAdmin from "../components/DocumentListAdmin";
import CreateUser from "../components/CreateUser";
import UserList from "../components/userList";

    export default function AdminPanel() {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-gradient-to-br from-gray-100 to-gray-300 relative"> {/* Enhanced background and padding */}
            <button
                onClick={handleGoBack}
                className="absolute top-6 left-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full shadow-lg flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h17" />
                </svg>
                <span>Back</span>
            </button>
            <h1 className="text-4xl font-extrabold mb-8 text-gray-800 drop-shadow-md">Admin Panel</h1> {/* Larger, bolder title */}
            <div className="w-full md:w-3/4 max-w-4xl bg-white p-8 rounded-xl shadow-xl mb-10 border border-gray-200 hover:border-blue-300 transition duration-300 ease-in-out"> {/* Refined component container */}
                <DocumentListAdmin />
            </div>
            <div className="w-full md:w-1/2 max-w-md bg-white p-8 rounded-xl shadow-xl mb-10 border border-gray-200 hover:border-blue-300 transition duration-300 ease-in-out"> {/* Refined component container */}
                <CreateUser/>
            </div>
            <div className="w-full md:w-11/12 max-w-6xl bg-white p-8 rounded-xl shadow-xl border border-gray-200 hover:border-blue-300 transition duration-300 ease-in-out"> {/* Refined component container */}
                <UserList/>
            </div>
        </div>
    );
}