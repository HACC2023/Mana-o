import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import TestMap from './components/TestMap';
import Dobor from './components/Dobor';
import Home from './components/Home';
import ApproveUsers from './components/ApproveUsers';
import ForgotPassword from './components/ForgotPassword';
import AuthService from './services/auth.service';

const USER_TYPE = {
    ADMIN: 'admin',
    USER: 'user',
};

function App() {
    const currentUser = AuthService.getCurrentUser();
    const current_user_type = currentUser ? currentUser.roles : [];

    return (
        <div className="App">
            <header className="App-header"></header>
            <div className="routes">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/home" element={<UserElement current_user_type={current_user_type}><Home /></UserElement>} />
                    <Route path="/unapprovedusers" element={<AdminElement current_user_type={current_user_type}><ApproveUsers /></AdminElement>} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/testmap" element={<TestMap />} />
                    <Route path="/dobor" element={<Dobor />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="*" element={<div>404 Page Not Found</div>} />
                </Routes>
            </div>
        </div>
    );
}

function UserElement({ children, current_user_type }) {
    if (current_user_type.includes(USER_TYPE.USER)) {
        return <>{children}</>;
    } else {
        return <Navigate to="/login" />;
    }
}

function AdminElement({ children, current_user_type }) {
    if (current_user_type.includes(USER_TYPE.ADMIN)) {
        return <>{children}</>;
    } else {
        return <Navigate to="/login" />;
    }
}

export default App;
