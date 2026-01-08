import Header from "../components/Header.jsx";
import DocumentListAdmin from "../components/DocumentListAdmin";
import CreateUser from "../components/CreateUser";
import UserList from "../components/userList";

export default function AdminPanel() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
            <Header />
            <main className="flex flex-col items-center justify-start py-10 px-4">
                <h1 className="text-4xl font-extrabold mb-8 text-gray-800 drop-shadow-md">Admin Panel</h1>
                <div className="w-full md:w-1/2 max-w-md bg-white p-8 rounded-xl shadow-xl mb-10 border border-gray-200 hover:border-blue-300 transition duration-300 ease-in-out">
                    <CreateUser/>
                </div>
                <div className="w-full md:w-3/4 max-w-10xl bg-white p-8 rounded-xl shadow-xl mb-10 border border-gray-200 hover:border-blue-300 transition duration-300 ease-in-out">
                    <DocumentListAdmin />
                </div>
                <div className="w-full md:w-11/12 max-w-6xl bg-white p-8 rounded-xl shadow-xl border border-gray-200 hover:border-blue-300 transition duration-300 ease-in-out">
                    <UserList/>
                </div>
            </main>
        </div>
    );
}