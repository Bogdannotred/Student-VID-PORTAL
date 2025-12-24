import Header from "../components/Header";
import StudentCard from "../components/StudentCard";
import DocumentUpload from "../components/DocumentUpload";
import DocumentListUser from "../components/DocumentListUser";

export default function HomePage() {


  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Header />
      <div className="text-black p-6">
        <StudentCard />
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