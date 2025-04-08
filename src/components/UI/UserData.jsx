import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const UserData = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.from('users').select('id');

      if (error) {
        setError(error.message);
      } else {
        setUserData(data);
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Data</h1>
      {userData ? (
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserData;
