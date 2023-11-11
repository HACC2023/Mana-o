import React, {useState, useEffect} from 'react';
import UserService from '../services/user.service';
import {Container} from 'react-bootstrap';
import axios from 'axios';


const ApproveUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvedUsers, setApprovedUsers] = useState({});
    const [approvedUserEmails, setApprovedUserEmails] = useState([]);
    const [message, setMessage] = useState('');


    const fetchData = async () => {
        try {
            const response = await UserService.getUnapprovedUsers();
            const userData = response.data;
            console.log(userData);
            setUsers(userData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const sendEmail = (approvedUserEmails) => {
        axios
            .post('http://localhost:8080/sendEmailToApprovedUsers', {
                approvedUserEmails, // Pass the array of email addresses
            })
            .then((response) => {
                console.log(response.data.message);
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.log(error.response.data.message);
                setMessage(error.response.data.message);
            });
    };

    const handleCheckboxChange = (userId) => {
        //console.log('Checkbox clicked for user ID:', userId);
        const isUserApproved = !approvedUsers[userId];

        // Update the approvedUsers state
        setApprovedUsers((prevApprovedUsers) => ({
            ...prevApprovedUsers,
            [userId]: isUserApproved,
        }));

        setApprovedUserEmails((prevEmails) => {
            const emailToUpdate = users.find((user) => user.id === userId).email;
            if (isUserApproved) {
                console.log('Adding email:', emailToUpdate);
                return [...prevEmails, emailToUpdate];
            } else {
                console.log('Removing email:', emailToUpdate);
                return prevEmails.filter((email) => email !== emailToUpdate);
            }
        });

    };
    const approveUsers = async () => {
        const approvedUserIds = users.filter((user) => approvedUsers[user.id])
            .map((user) => user.id);
        console.log("Approved User IDs:", approvedUserIds);

        if (approvedUserIds.length > 0) {
            try {
                const updatedApprovedUsers = {...approvedUsers};
                approvedUserIds.forEach((userId) => {
                    updatedApprovedUsers[userId] = true;
                });
                setApprovedUsers(updatedApprovedUsers);

                await UserService.updateApprovedStatus(approvedUserIds);
                sendEmail(approvedUserEmails);
                await fetchData();
            } catch (err) {
                console.error("Error approving users:", err);
            }
        }
    }


    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="user-contents">
            <div className="user-table">
                <h2>Unapproved Users</h2>
                <div className="user-cards">
                    {users.map((user) => (
                        <div className="user-card" key={user.id}>
                            <div className="card-header">
                                <h3>
                                    {`${user.first_name} ${user.last_name}`}
                                </h3>
                            </div>
                            <div className="card-content">
                                <p>
                                    <strong>Email: </strong>
                                    {user.email}
                                </p>
                                <p>
                                    <strong>Phone: </strong>
                                    {user.phone_number}
                                </p>
                                <p>
                                    <strong>Company: </strong>
                                    {user.company}
                                </p>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={approvedUsers[user.id] || false}
                                        onChange={() => handleCheckboxChange(user.id)}
                                    />
                                    Approve
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={approveUsers}>Submit</button>
            </div>
        </div>
    );
};

export default ApproveUsers;

