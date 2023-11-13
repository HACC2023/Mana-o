import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import './Chatting.css';
import AuthService from '../services/auth.service';
import {Container, Row, Col, Card, Alert, Button, Modal, Form} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';


const ENDPOINT = 'http://localhost:8080';


const Chatting = () => {
    const currentUser = AuthService.getCurrentUser();
    const [socket, setSocket] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [room, setRoom] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const user = currentUser.email;
    const userName = `${currentUser.first_name} ${currentUser.last_name}`;

    const [friendEmail, setFriendEmail] = useState('');
    const [chatTitle, setChatTitle] = useState('');
    const [channel, setChannel] = useState('');
    const [activeChannel, setActiveChannel] = useState(null);
    let updatedChannel = '';

    const joinChannel = () => {
        if (room !== '' || friendEmail !== '') {
            if (room === '') {
                updatedChannel =
                    friendEmail < user
                        ? `${friendEmail}_${user}`
                        : `${user}_${friendEmail}`;
                setChatTitle(friendEmail); // Set chat title to friend's name
            } else {
                updatedChannel = room;
                setChatTitle("Room: " + room);

            }
            setChannel(updatedChannel);
            setActiveChannel(updatedChannel); // Set the active channel
            socket.emit('join channel', updatedChannel);
            setShowChat(true);
        }
    };

    const switchChannel = (newChannel) => {
        // Leave the current channel
        socket.emit('leave channel', channel);
    };

    useEffect(() => {
        const newSocket = io(ENDPOINT);
        setSocket(newSocket);

        // Clean up the socket connection when the component is unmounted
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            // Listen for incoming messages
            socket.on('receive message', (message) => {
                setMessageList((list) => [...list, message]);
            });
        }
    }, [socket]);

    const handleSendMessage = async () => {
        if (socket && inputMessage.trim() !== '') {
            const messageData = {
                channel: channel,
                author: user,
                username: userName,
                messages: inputMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ':' +
                    String(new Date(Date.now()).getMinutes()).padStart(2, '0'),
            };

            // Send the message to the server along with the room name
            await socket.emit('chat message', messageData);
            setMessageList((list) => [...list, messageData]);

            // Clear the input field
            setInputMessage('');
        }
    };

    const handleBackClick = () => {
        // Reset the room and friendEmail states when going back to friend list
        setRoom('');
        setFriendEmail('');

        // Leave the current channel if in chat view
        if (showChat) {
            socket.emit('leave channel', channel);
            setShowChat(false);
            setMessageList([]);
        }
    };

    return (
        <Container>
            <h2 className="mt-4 mb-3">Message</h2>
            <div className="back-button">
                {showChat ? (
                    <button onClick={handleBackClick} className="icon-button">
                        <i className="bi bi-arrow-left-circle"></i>
                    </button>
                ) : (
                    <></>
                )}

            </div>
            <div className="chat-container">
                {!showChat ? (
                    <div className="friends-list">
                        <div className="row justify-content-center">
                            {/* Card 1 */}
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="card border-success" style={{minWidth: '18rem'}}>
                                    <div className="card-header bg-transparent border-success">Join a Discussion Room
                                    </div>
                                    <div className="card-body text-success">
                                        <h5 className="card-title">This is a Group Meeting room</h5>
                                        <p className="card-text">
                                            Enter Your Room name
                                        </p>
                                        <input
                                            type="text"
                                            placeholder="Enter Room name"
                                            value={room}
                                            onChange={(event) => {
                                                setRoom(event.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="card-footer bg-transparent border-success">
                                        <button
                                            className="btn btn-primary join-button"
                                            onClick={joinChannel}
                                        >
                                            Join
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="card border-success" style={{minWidth: '18rem'}}>
                                    <div className="card-header bg-transparent border-success">Chat with a
                                        Friend/Teammate
                                    </div>
                                    <div className="card-body text-success">
                                        <h5 className="card-title">This Is a Private Message</h5>
                                        <p className="card-text">
                                            Enter Your Friend's Email
                                        </p>
                                        <input
                                            type="text"
                                            placeholder="Enter friend's Email"
                                            value={friendEmail}
                                            onChange={(event) => {
                                                setFriendEmail(event.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="card-footer bg-transparent border-success">
                                        <button
                                            className="btn btn-primary join-button"
                                            onClick={joinChannel}
                                        >
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="chat-messages">
                        {activeChannel ? (
                            <h1 className="mb-3">{chatTitle}</h1>
                        ) : (
                            <h1>No Channel Selected</h1>
                        )}
                        <div className="message-container">
                            {messageList.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${
                                        message.author === user
                                            ? 'own-message'
                                            : 'other-message'
                                    }`}
                                >
                                    <div className="message-header">
                                        <span className="username">
                                            {message.username}
                                        </span>
                                        <span className="time">
                                            {message.time}
                                        </span>
                                    </div>
                                    <div className="message-content">
                                        {message.messages}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input and Send Button */}
                        <div className="message-input-container mt-3">
                            <input
                                type="text"
                                placeholder="Type message here"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Chatting;
