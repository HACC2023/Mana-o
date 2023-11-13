import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Modal, Form } from 'react-bootstrap';
import UserService from '../services/user.service';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [userIdToEdit, setUserIdToEdit] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        company: '',
        role: '',
    });

    const fetchData = async () => {
        try {
            const response = await UserService.getUsersPageData();
            const userData = response.data;
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
    }, [shouldUpdate]);

    const handleEditClick = (userId) => {
        setUserIdToEdit(userId);
        setShowEditModal(true);

        const userToEdit = users.find((user) => user.id === userId);
        if (userToEdit) {
            setEditFormData({
                firstName: userToEdit.first_name,
                lastName: userToEdit.last_name,
                email: userToEdit.email,
                phoneNumber: userToEdit.phone_number,
                company: userToEdit.company,
                role:  userToEdit.roles.includes('admin') ? 'admin' : 'user',
            });
        }
    };

    const handleEditSave = async () => {
        try {
            const response = await UserService.updateUser(userIdToEdit, editFormData);
            console.log(response.data.message);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userIdToEdit ? { ...user, ...editFormData } : user
                )
            );

            setShouldUpdate((prevShouldUpdate) => !prevShouldUpdate);

            setShowEditModal(false);
            setEditFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                company: '',
                role: '',
            });
        } catch (error) {
            console.error('Error updating user:', error);
            console.log('Error status:', error.response.status);
            console.log('Error data:', error.response.data);
        }
    };

    const handleEditCancel = () => {
        setUserIdToEdit(null);
        setEditFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            company: '',
            role: '',
        });
        setShowEditModal(false);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleDeleteClick = (userId) => {
        const user = users.find((user) => user.id === userId);
        setUserToDelete(user);
        setUserIdToDelete(userId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await UserService.deleteUser(userIdToDelete);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userIdToDelete));
            setShouldUpdate((prevShouldUpdate) => !prevShouldUpdate);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting user:', error);
            console.log('Error status:', error.response.status);
            console.log('Error data:', error.response.data);
        }
    };

    const handleDeleteCancel = () => {
        setUserToDelete(null);
        setUserIdToDelete(null);
        setShowDeleteModal(false);
    };

    const filteredUsers = users.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const role = user.roles.includes('admin') ? 'admin' : 'user';
        const email = user.email.toLowerCase();
        const company = user.company.toLowerCase();
        const phoneNumber = user.phone_number.toLowerCase();

        return (
            fullName.includes(searchQuery.toLowerCase()) ||
            role.includes(searchQuery.toLowerCase()) ||
            email.includes(searchQuery.toLowerCase()) ||
            company.includes(searchQuery.toLowerCase()) ||
            phoneNumber.includes(searchQuery.toLowerCase())
        );
    });

    return (
        <Container>
            <h2 className="mt-5 mb-4">Users</h2>
            {users.length > 0 ? (
                <div>
                    <Row className="mb-5">
                        <Col md={{ span: 3, offset: 9 }}>
                            <Form.Group controlId="formSearch">
                                <Form.Control
                                    type="text"
                                    placeholder="Search for users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {filteredUsers.length > 0 ? (
                        <Row>
                            {filteredUsers.map((user) => (
                                <Col key={user.id} md={4} className="mb-3">
                                    <Card style={{ width: '24rem' }}>
                                        <Card.Header className="header-bg">
                                            <h5>{`${user.first_name} ${user.last_name}`}</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Card.Text>Email: {user.email}</Card.Text>
                                            <Card.Text>Phone: {user.phone_number}</Card.Text>
                                            <Card.Text>Company: {user.company}</Card.Text>
                                            <Card.Text>
                                                Role:{' '}
                                                <b>{user.roles.includes('admin') ? 'Admin' : 'User'}</b>
                                            </Card.Text>
                                            <div className="d-flex justify-content-end">
                                                <Button
                                                    variant="primary"
                                                    style={{ marginRight: '10px' }}
                                                    onClick={() => handleEditClick(user.id)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteClick(user.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div>
                            <Alert variant="info" className="mt-5">
                                No matching users
                            </Alert>
                        </div>
                    )}
                    <Modal show={showEditModal} onHide={handleEditCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter first name"
                                        name="firstName"
                                        value={editFormData.firstName}
                                        onChange={handleEditFormChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter last name"
                                        name="lastName"
                                        value={editFormData.lastName}
                                        onChange={handleEditFormChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleEditFormChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone number"
                                        name="phoneNumber"
                                        value={editFormData.phoneNumber}
                                        onChange={handleEditFormChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCompany">
                                    <Form.Label>Company</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter company"
                                        name="company"
                                        value={editFormData.company}
                                        onChange={handleEditFormChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formRole">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="role"
                                        value={editFormData.role}
                                        onChange={handleEditFormChange}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleEditCancel}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleEditSave}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Confirmation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {userToDelete && (
                                <p>
                                    Are you sure you want to delete the user{' '}
                                    <strong>{`${userToDelete.first_name} ${userToDelete.last_name}`}</strong>?
                                </p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleDeleteCancel}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDeleteConfirm}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            ) : (
                <div>
                    <Alert variant="info" className="mt-5">
                        No users
                    </Alert>
                </div>
            )}
        </Container>
    );
};

export default Users;
