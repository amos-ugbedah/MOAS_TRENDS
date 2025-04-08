import React, { useEffect, useState } from "react";
import { supabase } from "../libs/supabaseClient";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const user = supabase.auth.user(); // Get the current logged-in user
      if (user) {
        // Fetch the user's role from the users table
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error(error);
          navigate("/dashboard"); // Redirect to the dashboard if there's an error
        }

        if (data.role !== 'admin') {
          navigate("/dashboard"); // Redirect if the user is not an admin
        } else {
          setUserRole(data.role);
        }
      }
    };

    checkUserRole();
  }, [navigate]);

  if (userRole !== 'admin') {
    return <div>Loading...</div>; // You can return a loading state while checking the user role
  }

  return (
    <div>
      <h2>Admin Page</h2>
      {/* Add your admin functionality here */}
    </div>
  );
};

export default AdminPage;
