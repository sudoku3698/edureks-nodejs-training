// Require the necessary modules
const express = require('express'); // Module for building web applications
const http = require('http'); // Module for creating HTTP servers
const socketio = require('socket.io'); // Module for real-time, bidirectional communication
const { createClient } = require('redis'); // Module for connecting to Redis database
const { format } = require('date-fns'); // Module for formatting dates

// Create an instance of the Express application
const app = express();

// Create an HTTP server from the Express application
const server = http.createServer(app);

// Create a Socket.IO server from the HTTP server
const io = socketio(server);

// Create a Redis client
const redisClient = createClient();

// Connect to the Redis database
redisClient.connect().catch(console.error);

// Listen for the 'connect' event when the client successfully connects to the Redis database
redisClient.on('connect', () => {
    console.log('connected to redis');
});

// Listen for the 'error' event when the client encounters an error connecting to the Redis database
redisClient.on('error', (err) => {
    // Log the error
    console.log('Redis Error ' + err);
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Determine the port to listen on. If the environment variable PORT is set, use that; otherwise, use 3000.
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
server.listen(PORT, () => {
    // Log a message indicating that the server is running on the specified port
    console.log(`Server running on port ${PORT}`);
});

// Listen for socket connections
io.on('connection', (socket) => {
    // Log a message indicating that a new WebSocket connection has been established
    console.log('New WebSocket connected');

    // Listen for the 'join' event
    socket.on('join', async ({ username, room }, callback) => {
        // Join the specified room
        socket.join(room);

        // Serialize the user information into a JSON string
        const user = JSON.stringify({ id: socket.id, username, room });

        // Add the user to the 'users' set in Redis
        await redisClient.sAdd('users', user);

        // Emit a 'message' event to all clients in the specified room, indicating that the user has joined the chat
        io.to(room).emit('message', formatMessage('Admin', `${username} has joined the chat`));

        // Get the list of users in the specified room from Redis
        const users = await getUsersInRoom(room);

        // Emit a 'roomUsers' event to all clients in the specified room, indicating the list of users
        io.to(room).emit('roomData', {
            room,
            users
        });

        // Invoke the callback function
        callback(null, 'Room joined successfully');
    });

    /**
     * Listen for the 'chatMessage' event when a chat message is received from a client.
     *
     * @param {string} msg - The chat message sent by the client.
     * @param {function} callback - Callback function to be invoked after the message is delivered.
     * @return {void}
     */
    socket.on("chatMessage",async (msg,callback) => {
        // Get the current user associated with the socket ID
        const user = await getCurrentUser(socket.id);

        // If user is not found, log an error and return
        if(!user){
            console.error("User not found for id: "+socket.id);
            return;
        }

        // Format the message with the user's username
        const message=formatMessage(user.username,msg);

        // Emit the message to all clients in the user's room
        io.to(user.room).emit("message",message);

        // Add the message to the Redis list for the user's room
        await redisClient.rPush(`messages:${user.room}`,JSON.stringify(message));

        // Invoke the callback function with the status 'Delivered'
        callback('Delivered');
    });

    // Listen for the 'disconnect' event when the client disconnects
    /**
     * Listen for the 'disconnect' event when the client disconnects.
     *
     * @return {void}
     */
    socket.on('disconnect', async () => {
        // Retrieve the user information associated with the socket
        const user=await removeUser(socket.io);

        // If a user is found, emit a message to all clients in the user's room
        if(user){
            io.to(user.room).emit('message',formatMessage('Admin',`${user.username} has left the chat`));
            // Get the list of users in the user's room
            const users=await getUsersInRoom(user.room);

            // Emit the room data to all clients in the user's room
            io.to(user.room).emit('roomData',{
                room:user.room,
                users
            });
        }
    });

    socket.on("sendLocation", async (coords, callback) => {
        const user = await getCurrentUser(socket.id);
        if (!user) {
            console.error("User not found for id: " + socket.id);
            return;
        }
        const location_message=`https://google.com/maps?q=${coords.latitude},${coords.longitude}`;
        console.log("location_message",location_message)
        io.to(user.room).emit("locationMessage", formatMessage(user.username, location_message));
        await redisClient.rPush(`messages:${user.room}`,JSON.stringify(location_message));
        callback('Location Shared');
    });

    // get messages in a room
    socket.on('getMessages', async (room, callback) => {
        const messages = await redisClient.lRange(`messages:${room}`, 0, -1);
        callback(messages);
    });

});




// util functions

/**
 * Formats a chat message with the given username and message.
 *
 * @param {string} username - The username of the sender.
 * @param {string} msg - The message to be formatted.
 * @return {Object} The formatted chat message object.
 */
function formatMessage(username, msg) {
    return {
        username,
        msg,
        time: format(new Date(), 'h:mm a')
    };
}

/**
 * Retrieves the user information associated with the given socket ID from Redis.
 *
 * @param {string} id - The socket ID of the user.
 * @return {Promise<Object|null>} A Promise that resolves to the user object if found, or null if not found.
 */
async function getCurrentUser(id) {
    try {
        const users = await redisClient.sMembers('users');
        const user = users.map(user => JSON.parse(user)).find(user => user.id === id);
        return user;
    } catch (err) {
        console.error('Error fetching user from Redis:', err);
        return null;
    }
}

/**
 * Retrieves the list of users in the specified room from Redis.
 *
 * @param {string} room - The name of the room.
 * @return {Promise<Array>} A Promise that resolves to an array of user objects in the room.
 */
async function getUsersInRoom(room) {
    try{
        const users = await redisClient.sMembers('users');
        const roomUsers=users.map(user => JSON.parse(user)).filter(user => user.room === room);
        return roomUsers;
    }catch(err){
        console.error('Error fetching users from Redis:',err);
        return [];
    }
}

/**
 * Removes the user with the given socket ID from the Redis 'users' set.
 *
 * @param {string} id - The socket ID of the user to be removed.
 * @return {Promise<Object|null>} A Promise that resolves to the removed user object if found, or null if not found.
 */
async function removeUser(id) {
    try {
        const users=await redisClient.sMembers('users');
        const user=users.map(user => JSON.parse(user)).find(user => user.id===id);
        if(user){
            await redisClient.sRem('users',JSON.stringify(user));
            return user;
        }
    } catch (err) {
        console.error('Error removing user from Redis:', err);
        return null;
    }
}


