import React from 'react';
import AuthService from '../services/auth.service';
import { Link } from 'react-router-dom';

const Home = () => {
    const currentUser = AuthService.getCurrentUser();

    return(
        <div className = "home-contents">
            <div className = "bar">
                <strong>{currentUser.first_name} {currentUser.last_name}'s</strong> Homepage
            </div>
            <div>
                <Link to="/approveUsers">Approve Users</Link>
            </div>
        </div>

    );
}
export default Home;