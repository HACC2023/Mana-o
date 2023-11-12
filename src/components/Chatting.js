import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import './Chatting.css';
import AuthService from '../services/auth.service';

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

    useEffect(() => {
        const interval = setInterval(() => setValue(new Date()), 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const joinRoom = () => {
        if (room !== "") {
            socket.emit('join room', room);
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
                room: room,
                author: user,
                username: userName,
                messages: inputMessage,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            };

            // Send the message to the server along with the room name
            await socket.emit('chat message', messageData);
            setMessageList((list) => [...list, messageData]);

            // Clear the input field
            setInputMessage('');
        }
    };

    return (
        <div className="chat-container">
            {/* Friends List on the left side */}
            <div className="friends-list">
                <h3>Join A chat</h3>
                <input
                    type="text"
                    placeholder="Enter room name"
                    value={room}
                    onChange={(event) => {
                        setRoom(event.target.value);
                    }}
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>

            {/* Chat Messages */}
            {showChat ? (
                <div className="chat-messages">
                    <h1>Room {room}</h1>
                    <div className="message-container">
                        {messageList.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.author === user ? 'own-message' : 'other-message'}`}
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
                <p>Enter a room to chat with other users, and do not let users know your chat room key.</p>
            )}
        </div>
    );
};

export default Chatting;
