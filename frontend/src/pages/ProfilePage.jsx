import Header from "../components/Header";
import ProfileForm from "../components/ProfileForm";
import StudentCard from "../components/StudentCard";

export default function ProfilePage( { user }) {
  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      <div>
        <StudentCard user = { user } />
      </div>
      <div>
        <ProfileForm user={ user } />
      </div>
    </div>
  );
}