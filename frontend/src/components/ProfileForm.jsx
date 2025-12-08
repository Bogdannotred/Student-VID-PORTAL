import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Notification from './Notification';

  export default function ProfileForm({ onUserLoaded }) {
  const [fullName, setFullName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const [university, setUniversity] = useState('');
  const [NrMatricol, setNrMatricol] = useState('');


   useEffect(() => {
    const fetchUserProfile = async () => {
        setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFullName(user.user_metadata?.full_name || '');
        setSpecialization(user.user_metadata?.specialization || '');
        if (onUserLoaded) {
          onUserLoaded(user);
        }
        setUniversity(user.user_metadata?.university || '');
        setNrMatricol(user.user_metadata?.NrMatricol || '');
       }
      setLoading(false);
    };
    fetchUserProfile();
  }, [onUserLoaded]);

  const handleUpdateProfile = async (e) => {
      e.preventDefault();
    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
 
     if (userError) {
       console.error('Error fetching user:', userError.message);
         setNotificationMessage(`Error fetching user data: ${userError.message}`);
       setNotificationType('error');
      setLoading(false);
       return;
    }

    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          specialization: specialization,
            university: university,
          NrMatricol: NrMatricol,
        },
      });

      if (error) {
        console.error('Error updating profile:', error.message);
        setNotificationMessage(`Error updating profile: ${error.message}`);
        setNotificationType('error');
      } else {
        setNotificationMessage('Profile updated successfully!');
        setNotificationType('success');
      }
    }
    setLoading(false);
  };

      if (loading) {
    return <div className="p-6 bg-white rounded-lg shadow-md text-center text-gray-600">Loading profile...</div>;
  }

      return (
    <form onSubmit={handleUpdateProfile} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          className="bg-gray-100 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="specialization" className="block text-gray-700 text-sm font-medium mb-2">
          Specialization
        </label>
        <input
          type="text"
          id="specialization"
          className="bg-gray-100 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
      </div>
            <div className="mb-6">
        <label htmlFor="specialization" className="block text-gray-700 text-sm font-medium mb-2">
          University
        </label>
        <input
          type="text"
          id="university"
          className="bg-gray-100 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="Nr.Matricol" className="block text-gray-700 text-sm font-medium mb-2">
            Nr.Matricol
        </label>
        <input
          type="text"
          id="Nr.Matricol"
          className="bg-gray-100 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900"
          value={NrMatricol}
          onChange={(e) => setNrMatricol(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 shadow-md"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
      <Notification 
        message={notificationMessage} 
        type={notificationType} 
        onClose={() => setNotificationMessage(null)} 
      />
    </form>
  );
}