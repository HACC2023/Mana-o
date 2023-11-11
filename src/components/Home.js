import React from 'react';
import AuthService from '../services/auth.service';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';  // Adjust the path accordingly
import Navbar from './Navbar';  // Assuming you have a Navbar component

const Home = () => {
    const currentUser = AuthService.getCurrentUser();

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <Sidebar />
            <div className="main-content" style={{ flex: 1 }}>
                <Navbar />
                <div className="bar">
                    <strong>{currentUser.first_name} {currentUser.last_name}'s</strong> Homepage
                </div>
                {currentUser.roles.includes('admin') && (
                    <div>
                        <Link to="/unapprovedusers">Approve Users</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
