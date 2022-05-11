const express = require('express');
const db = require('./db');
const path = require('path');
const socket = require('socket.io');


const app = express();

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});


const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    db.messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('login', (login) => {
    console.log('someone logged in')
    db.users.push(login);
    socket.broadcast.emit('addUser', {author: 'Chat Bot', userName: login.name});
    console.log(db.users);
  })
  console.log('I\'ve added a listener on message event \n');
  socket.on('disconnect', () => {
    for (const user of db.users) {
      const indexOf = db.users.indexOf(user);

      if (user.id === socket.id) {
        socket.broadcast.emit('removeUser', {author: 'Chat Bot', userName: db.users[indexOf].name});
        db.users.splice(indexOf, 1);
      }
    }
    console.log('Oh, socket ' + socket.id + ' has left');
  });
  console.log('I\'ve added a listener on message and disconnect events \n');
  
});

