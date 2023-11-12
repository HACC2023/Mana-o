import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import './Chatting.css';
import AuthService from '../services/auth.service';
import {
    MDBCol,
    MDBRow,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
} from 'mdb-react-ui-kit';

const ENDPOINT = 'http://localhost:8080';

const Chatting = () => {
    const currentUser = AuthService.getCurrentUser();
    const [socket, setSocket] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [room, setRoom] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [value, setValue] = useState(new Date());
    const user = currentUser.email;
    const userName = `${currentUser.first_name} ${currentUser.last_name}`;

    const [friendEmail, setFriendEmail] = useState('');
    const [chatTitle, setChatTitle] = useState('');
    const [emailOrRoom, setEmailOrRoom] = useState('');
    let updatedRoom="";

    const joinRoom = () => {

        if (room !== '' || friendEmail !== '') {
            if (room === '') {
                updatedRoom =
                    friendEmail < user
                        ? `${friendEmail}_${user}`
                        : `${user}_${friendEmail}`;
                setChatTitle(friendEmail); // Set chat title to friend's name
            } else {
                updatedRoom = room;
            }
            setEmailOrRoom(updatedRoom);
            socket.emit('join room', updatedRoom);
            setShowChat(true);
        }
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
                room: emailOrRoom,
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

    return (
        <div>
            <h1>Message</h1>

            <div className="chat-container">
                {/* Friends List on the left side */}
                <div className="friends-list">
                    <MDBRow>
                        <MDBCol>
                            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                                <MDBBreadcrumbItem>
                                    <h1>Join a room</h1>
                                </MDBBreadcrumbItem>
                            </MDBBreadcrumb>
                        </MDBCol>
                    </MDBRow>
                    <div className="input-container d-flex align-items-center">
                        <input
                            type="text"
                            placeholder="Enter room name"
                            value={room}
                            onChange={(event) => {
                                setRoom(event.target.value);
                            }}
                        />
                        <button className="btn btn-primary join-button" onClick={joinRoom}>
                            Join
                        </button>
                    </div>
                    <hr />
                    <MDBRow>
                        <MDBCol>
                            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                                <MDBBreadcrumbItem>
                                    <h1>Chat with Friend</h1>
                                </MDBBreadcrumbItem>
                            </MDBBreadcrumb>
                        </MDBCol>
                    </MDBRow>
                    <div className="input-container d-flex align-items-center">
                        <input
                            type="text"
                            placeholder="Enter friend's Email"
                            value={friendEmail}
                            onChange={(event) => {
                                setFriendEmail(event.target.value);
                            }}
                        />
                        <button className="btn btn-primary join-button" onClick={joinRoom}>
                            Chat
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                {showChat ? (
                    <div className="chat-messages">
                        {friendEmail!==""? ( <h1>{chatTitle}</h1>): (<h1>Room {room}</h1>)}
                        <div className="message-container">
                            {messageList.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${
                                        message.author === user ? 'own-message' : 'other-message'
                                    }`}
                                >
                                    <div className="message-header">
                                        <span className="username">{message.username}</span>
                                        <span className="time">{message.time}</span>
                                    </div>
                                    <div className="message-content">{message.messages}</div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input and Send Button */}
                        <div className="message-input">
                            <input
                                type="text"
                                placeholder="Type message here"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default Chatting;
