import Header from "../components/Header";
import StudentCard from "../components/StudentCard";
import DocumentUpload from "../components/DocumentUpload";
import DocumentListUser from "../components/DocumentListUser";

export default function HomePage({ user }) {


  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Header user={user} />
      <div className="text-black p-6">
        <StudentCard user={user} />
      </div>
      <div className="text-black m-10">
        <DocumentListUser/>
      </div>
      <div className="text-black">
        <DocumentUpload/>
      </div>


    </div>
  );
}