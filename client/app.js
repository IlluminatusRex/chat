const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const socket = io();

let userName = '';

socket.on('message', ({ author, content }) => addMessage(author, content));

const login = (e) => {
  e.preventDefault();
  if (userNameInput.value !== '') {
    userName = userNameInput.value;
    socket.emit('login', { user: userName });
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  } else {
    alert('Enter your username');
  }
};

const sendMessage = (e) => {
  e.preventDefault();
  if (messageContentInput.value.length) {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value });
    messageContentInput.value = '';
  } else {
    alert('Enter your message');
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }
  message.innerHTML = `
  <h3 class="message__author">${author === userName ? 'You' : author}</h3>
  <div class="message__content">${content}</div>
  `;
  messagesList.appendChild(message);
};

loginForm.addEventListener('submit', (e) => {
  login(e);
});

addMessageForm.addEventListener('submit', (e) => {
  sendMessage(e);
});