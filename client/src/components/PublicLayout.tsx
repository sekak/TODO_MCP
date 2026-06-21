import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PublicLayout = () => {

    if (localStorage.getItem("token")) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default PublicLayout
