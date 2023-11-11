import React from 'react';
import AuthService from '../services/auth.service';
import {Link} from 'react-router-dom';


const Home = () => {
    const currentUser = AuthService.getCurrentUser();

    return (
        <div className="main-content" style={{flex: 1}}>
            <strong>{currentUser.first_name} {currentUser.last_name}'s</strong> Homepage

            {currentUser.roles.includes('admin') && (
                <div>
                    <Link to="/unapprovedusers">Approve Users</Link>
                </div>
            )}
        </div>
    );
}

export default Home;
