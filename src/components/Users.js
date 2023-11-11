import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Modal, Form } from 'react-bootstrap';
import UserService from '../services/user.service';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [userIdToEdit, setUserIdToEdit] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        company: '',
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
    }, []);



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
            });
        }
    };

    const handleEditSave = () => {
        console.log(`Save edited data for user with ID: ${userIdToEdit}`, editFormData);
        setShowEditModal(false);
    };

    const handleEditCancel = () => {
        setUserIdToEdit(null);
        setEditFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            company: '',
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

    const handleDeleteConfirm = () => {
        console.log(`Confirmed delete for user with ID: ${userIdToDelete}`);
        setShowDeleteModal(false);
    };

    const handleDeleteCancel = () => {
        setUserToDelete(null);
        setUserIdToDelete(null);
        setShowDeleteModal(false);
    };

    return (
        <Container>
            <h2 className="mt-5 mb-4">Users</h2>
            {users.length > 0 ? (
                <div>
                    <Row>
                        {users.map((user) => (
                            <Col key={user.id} md={4} className="mb-3">
                                <Card style={{ width: '24rem' }}>
                                    <Card.Header className="header-bg">
                                        <h5>{`${user.first_name} ${user.last_name}`}</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text>Email: {user.email}</Card.Text>
                                        <Card.Text>Phone: {user.phone_number}</Card.Text>
                                        <Card.Text>Company: {user.company}</Card.Text>
                                        <div className="d-flex justify-content-end">
                                            <Button variant="primary" style={{ marginRight: '10px' }} onClick={() => handleEditClick(user.id)}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDeleteClick(user.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {/* Edit Modal */}
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
                    {/* Delete Confirmation Modal */}
                    <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Confirmation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {userToDelete && (
                                <p>
                                    Are you sure you want to delete the user <strong>{`${userToDelete.first_name} ${userToDelete.last_name}`}</strong>?
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
