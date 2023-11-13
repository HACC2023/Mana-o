import AuthService from '../services/auth.service';
import React, { useEffect, useState } from 'react';
import UserService from '../services/user.service';
import { Col, Container, Row, Card, Button, Modal, Form } from 'react-bootstrap';
import { MDBIcon } from 'mdb-react-ui-kit';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Profile() {
    const user = AuthService.getCurrentUser();
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        company: '',
        role: 'user', // Default role
    });

    useEffect(() => {
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

        fetchData();
    }, []);

    // Check if currentUser exists before accessing its properties
    const currentUser = users ? users.find((e) => e.id === user.id) : null;

    const handleEditClick = () => {
        // Populate edit form data with current user data
        setEditFormData({
            firstName: currentUser.first_name || '',
            lastName: currentUser.last_name || '',
            email: currentUser.email || '',
            phoneNumber: currentUser.phone_number || '',
            company: currentUser.company || '',
            role: currentUser.roles.includes('admin') ? 'admin' : 'user',
        });

        setShowEditModal(true);
    };

    const handleEditFormChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
    };

    const handleEditSave = async () => {
        try {
            console.log('Attempting to update user:', currentUser.id, editFormData);

            const response = await UserService.updateUser(currentUser.id, editFormData);
            console.log('Update successful:', response.data.message);

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


    return (
        <Container className="py-5">
            <Row>
                <Col>
                    <h3>{currentUser ? `${currentUser.first_name} ${currentUser.last_name}'s Profile` : 'Loading...'}</h3>
                </Col>
            </Row>

            <Row>
                <Col lg="8">
                    {loading ? (
                        <p>Loading user data...</p>
                    ) : currentUser ? (
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Text>
                                    <strong>First Name:</strong> {currentUser.first_name}
                                </Card.Text>
                                <hr />
                                <Card.Text>
                                    <strong>Last Name:</strong> {currentUser.last_name}
                                </Card.Text>
                                <hr />
                                <Card.Text>
                                    <strong>Email:</strong> {currentUser.email}
                                </Card.Text>
                                <hr />
                                <Card.Text>
                                    <strong>Phone:</strong> {currentUser.phone_number}
                                </Card.Text>
                                <hr />
                                <Card.Text>
                                    <strong>Company:</strong> {currentUser.company}
                                </Card.Text>
                                <hr />
                                <Card.Text>
                                    <strong>Role:</strong> {currentUser.roles.includes('admin') ? 'Admin' : 'User'}
                                </Card.Text>
                                <hr />

                                {/* Add Edit button with edit icon */}
                                <Button onClick={handleEditClick} variant="primary">
                                    <MDBIcon fas icon="edit" /> Edit
                                </Button>
                            </Card.Body>
                        </Card>
                    ) : (
                        <p>User data not found.</p>
                    )}
                </Col>
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
        </Container>
    );
}
