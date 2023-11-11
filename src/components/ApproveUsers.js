import React, {useState, useEffect} from 'react';
import UserService from '../services/user.service';
import {Container, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ApproveUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvedUsers, setApprovedUsers] = useState({});
    const [approvedUserEmails, setApprovedUserEmails] = useState([]);
    const [message, setMessage] = useState('');
    const [selectAll, setSelectAll] = useState(false);

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
        const isUserApproved = !approvedUsers[userId];

        setApprovedUsers((prevApprovedUsers) => ({
            ...prevApprovedUsers,
            [userId]: isUserApproved,
        }));

        setApprovedUserEmails((prevEmails) => {
            const emailToUpdate = users.find((user) => user.id === userId).email;
            if (isUserApproved) {
                return [...prevEmails, emailToUpdate];
            } else {
                return prevEmails.filter((email) => email !== emailToUpdate);
            }
        });

        const allSelected = users.every((user) => approvedUsers[user.id]);
        setSelectAll(allSelected);
        if (!isUserApproved) {
            setSelectAll(false);
        }
    };

    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        const updatedApprovedUsers = {};
        users.forEach((user) => {
            updatedApprovedUsers[user.id] = newSelectAll;
        });
        setApprovedUsers(updatedApprovedUsers);

        const emailsToUpdate = newSelectAll
            ? users.map((user) => user.email)
            : [];
        setApprovedUserEmails(emailsToUpdate);
    };

    const approveUsers = async () => {
        const approvedUserIds = users
            .filter((user) => approvedUsers[user.id])
            .map((user) => user.id);
        console.log('Approved User IDs:', approvedUserIds);

        if (approvedUserIds.length > 0) {
            try {
                await UserService.updatedApprovedStatus(approvedUserIds);
                sendEmail(approvedUserEmails);
                await fetchData();
            } catch (err) {
                console.error('Error approving users:', err);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Container>
            <h2 className="mt-5 mb-4">Unapproved Users</h2>
            {users.length > 0 ? (
                <div>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                    />
                                    Select All
                                </label>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{`${user.first_name} ${user.last_name}`}</td>
                                <td>{user.email}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.company}</td>
                                <td>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={approvedUsers[user.id] || false}
                                            onChange={() => handleCheckboxChange(user.id)}
                                        />
                                        Approve
                                    </label>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-end mt-3">
                        <Button onClick={approveUsers}>Submit</Button>
                    </div>
                </div>) : (
                <div>
                    <Alert variant="info" className="mt-5">
                        No new users need to be approved
                    </Alert>
                </div>
            )}
        </Container>
    );
};

export default ApproveUsers;