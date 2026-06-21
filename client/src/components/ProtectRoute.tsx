import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = () => {
  
    console.log("Token in ProtectRoute:", localStorage.getItem("token")); // Debugging line
    if (!localStorage.getItem("token")) {
        
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
}

export default ProtectRoute
