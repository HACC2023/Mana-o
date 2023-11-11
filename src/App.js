import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './components/Landing';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import TestMap from './components/TestMap';
import Dobor from './components/Dobor';
import Home from './components/Home';
import ApproveUsers from './components/ApproveUsers';
import Users from './components/Users';
import ForgotPassword from './components/ForgotPassword';
import AuthService from './services/auth.service';
import Sidebar from './components/Sidebar.js';
import Navbar from './components/Navbar.js';

const USER_TYPE = {
    ADMIN: 'admin',
    USER: 'user',
};

function App() {
    const currentUser = AuthService.getCurrentUser();
    const current_user_type = currentUser ? currentUser.roles : [];
    const location = useLocation();
    const [contentHeight, setContentHeight] = useState(0);

    const shouldRenderNavbarAndSidebar = () => {
        const excludedRoutes = ['/', '/about', '/login', '/register', '/testmap', '/forgotpassword'];
        return !excludedRoutes.includes(location.pathname);
    };

    useEffect(() => {
        const calculateContentHeight = () => {
            const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
            setContentHeight(window.innerHeight - navbarHeight);
        };

        calculateContentHeight();
        window.addEventListener('resize', calculateContentHeight);

        return () => {
            window.removeEventListener('resize', calculateContentHeight);
        };
    }, []);

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {shouldRenderNavbarAndSidebar() && <Navbar id="navbar" />}
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                {shouldRenderNavbarAndSidebar() && <Sidebar current_user_type={current_user_type} />}
                <div className="main-content" style={{ flex: 1, overflowY: 'auto', height: contentHeight }}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/home" element={<UserElement current_user_type={current_user_type}><Home /></UserElement>} />
                        <Route path="/unapprovedusers" element={<AdminElement current_user_type={current_user_type}><ApproveUsers /></AdminElement>} />
                        <Route path="/users" element={<AdminElement current_user_type={current_user_type}><Users /></AdminElement>} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/testmap" element={<TestMap />} />
                        <Route path="/dobor" element={<Dobor />} />
                        <Route path="/forgotpassword" element={<ForgotPassword />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

function UserElement({ children, current_user_type }) {
    if (current_user_type.includes(USER_TYPE.USER)) {
        return <>{children}</>;
    } else {
        // Redirect to login
        return <Navigate to="/" />;
    }
}

function AdminElement({ children, current_user_type }) {
    if (current_user_type.includes(USER_TYPE.ADMIN)) {
        return <>{children}</>;
    } else {
        // Redirect to login
        return <Navigate to="/" />;
    }
}

export default App;
