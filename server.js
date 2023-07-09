const express = require('express');
const path = require('path');
const app = express();

const messages = [];
const users = [];

const socket = require('socket.io');

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});


const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('login', (user) => {
    users.push({ name: user.user, id: socket.id });
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: user.user + ' has joined the conversation!',
    });
    console.log('new user', 'name:' + user.user, 'id:' + socket.id);
  });

  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    const userDisconnected = users.find((user) => user.id === socket.id);
    const userIndex = users.findIndex((user) => user.id === socket.id);
    if (userDisconnected) {
      socket.broadcast.emit('message', { author: 'Chat Bot', content: userDisconnected.name + ' has left the conversation... :(' });
      console.log('Oh,' + userDisconnected.name + ' has left');
    }
    users.splice(userIndex, 1);
  });

  console.log("I've added a listener on message and disconnect events \n");
});


app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.get('/users', (req, res) => {
  res.send(users);
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

