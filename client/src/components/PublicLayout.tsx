import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

const PublicLayout = () => {
    const navigate = useNavigate();

    if (localStorage.getItem("token")) {
        return navigate("/home");
    }

    return <Outlet />;
}

export default PublicLayout
