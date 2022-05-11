const socket = io();

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

const login = (e) => {
  e.preventDefault();
  
  if (userNameInput.value === '') {
    alert('This field can not be empty')
  } else {
    userName = userNameInput.value
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('login', { name: userName, id: socket.id });
  }
}

const addMessage = (author, content) => {
  const message = document.createElement('li');
  const messageAuthor = document.createElement('h3');
  const messageContent = document.createElement('div');

  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) {
    message.classList.add('message--self');
  } else if (author === 'Chat Bot') {
    message.classList.add('message--ChatBot');
  }
  messageAuthor.classList.add('message__author');
  messageContent.classList.add('message__content');

  if (author === userName) {
    messageAuthor.innerHTML = 'You';
  } else if (author === 'Chat Bot') {
    messageAuthor.innerHTML = 'Chat Bot'
  }
  else {
    messageAuthor.innerHTML = author;
  }

  messageContent.innerHTML = content;

  message.insertAdjacentElement('afterbegin', messageAuthor);
  message.insertAdjacentElement('beforeend', messageContent);
  messagesList.insertAdjacentElement('beforeend', message);
}

const sendMessage = (e) => {
  e.preventDefault();

  if (messageContentInput.value === '') {
    alert('This field can not be empty');
  } else {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value })
    messageContentInput.value = ''
  }
}

socket.on('message', ({ author, content }) => addMessage(author, content))
socket.on('addUser', ({ author, userName }) => {
  const content = userName + ' has joined the conversation!'
  addMessage(author, content);
})
socket.on('removeUser', ({ author, userName }) => {
  const content = userName + ' has left the conversation... :('
  addMessage(author, content)
})

loginForm.addEventListener('submit', e => login(e));
addMessageForm.addEventListener('submit', e => sendMessage(e));


