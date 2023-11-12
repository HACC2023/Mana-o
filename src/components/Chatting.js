import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Grid, GridItem, Box, Input, Flex, Button, Text } from '@chakra-ui/react';
import AuthService from '../services/auth.service';

const ENDPOINT = 'http://localhost:8080';

const Chatting = () => {
    const currentUser = AuthService.getCurrentUser();
    const [socket, setSocket] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [room, setRoom] = useState('');
    const [selectedFriend, setSelectedFriend] = useState(null);
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
    const joinRoom = ()=>{
        if(room !==""){
            socket.emit("join room", room)
            setShowChat(true);

        }
    }


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
                console.log(message);
                setMessageList((list)=>[...list, message]);
            });
        }
    }, [socket]);

    const handleSendMessage = async () => {
        //if (socket && inputMessage.trim() !== '' && room.trim() !== '') {
        if (socket && inputMessage.trim() !== '') {
            const messageData = {
                room: room,
                author:currentUser.email,
                username: userName,
                messages:inputMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            // Send the message to the server along with the room name
            await socket.emit('chat message', messageData);
            setMessageList((list)=>[...list, messageData]);

            // Clear the input field
            setInputMessage('');
        }
    };

    return (
        <Grid templateColumns="repeat(12, 1fr)" h="100vh">
            {/* Friends List on the left side */}
            <GridItem colSpan={3} borderRight="1px solid gray" p={4}>
                <Text fontWeight="bold" mb={4}>
                    Start to chat with others
                </Text>
                {/* Add your friends list or other content here */}
                <Flex direction="column">
                    <h3>Join A chat</h3>
                    <Input
                        type="text"
                        placeholder="Enter room name"
                        value={room}
                        onChange={(event)=> {setRoom(event.target.value)}}
                    />
                    <Button onClick={joinRoom}>Join Room</Button>
                </Flex>

            </GridItem>
            <GridItem colSpan={9} p={4}>
                {showChat ? (
                    <Flex direction="column" h="100%">
                        {/* Chat Messages */}
                        <h1>Room {room}</h1>
                        <Box flex="1" overflowY="auto">
                            {messageList.map((message) => (
                                <Box
                                    key={message.id}
                                    textAlign={message.author === user ? 'right' : 'left'}
                                    mb={2}
                                >
                                    <Text fontWeight="bold">
                                        {message.username}: {message.messages}
                                    </Text>
                                </Box>
                            ))}
                        </Box>

                        {/* Message Input and Send Button */}
                        <Flex>
                            <Input
                                type="text"
                                placeholder="Type message here"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                            />
                            <Button ml={2} onClick={handleSendMessage}>
                                Send
                            </Button>
                        </Flex>
                    </Flex>
                ) : (
                    <p>
                        Enter a room to chat with other users, and do not let users know your chat room key.
                    </p>
                )}
            </GridItem>
        </Grid>
    );
};

export default Chatting;
