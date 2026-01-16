// --------------------
// In-browser "database"
// --------------------
let users = JSON.parse(localStorage.getItem('users')) || {};
let chats = JSON.parse(localStorage.getItem('chats')) || {};
let currentUser = null;
let currentChat = null;

// --------------------
// Elements
// --------------------
const loginPage = document.getElementById('login-page');
const dashboard = document.getElementById('dashboard');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

const friendNameInput = document.getElementById('friend-name');
const addFriendBtn = document.getElementById('add-friend-btn');
const friendsList = document.getElementById('friends-list');

const chatNameInput = document.getElementById('chat-name');
const createChatBtn = document.getElementById('create-chat-btn');
const chatsList = document.getElementById('chats-list');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendMsgBtn = document.getElementById('send-msg-btn');

const noteText = document.getElementById('note-text');
const saveNoteBtn = document.getElementById('save-note-btn');
const notesList = document.getElementById('notes-list');

// --------------------
// Login / Signup
// --------------------
loginBtn.onclick = () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if(users[username] && users[username].password === password){
        currentUser = username;
        showDashboard();
    } else {
        alert('Invalid credentials!');
    }
};

signupBtn.onclick = () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if(!users[username]){
        users[username] = { password, friends: [], chats: [], notes: [] };
        localStorage.setItem('users', JSON.stringify(users));
        alert('User created! Login now.');
    } else {
        alert('Username already exists!');
    }
};

// --------------------
// Show Dashboard
// --------------------
function showDashboard(){
    loginPage.style.display = 'none';
    dashboard.style.display = 'block';
    userDisplay.innerText = currentUser;
    renderFriends();
    renderChats();
    renderNotes();
}

// --------------------
// Logout
// --------------------
logoutBtn.onclick = () => {
    currentUser = null;
    dashboard.style.display = 'none';
    loginPage.style.display = 'block';
};

// --------------------
// Friends System
// --------------------
addFriendBtn.onclick = () => {
    const friend = friendNameInput.value;
    if(users[friend] && friend !== currentUser && !users[currentUser].friends.includes(friend)){
        users[currentUser].friends.push(friend);
        users[friend].friends.push(currentUser); // mutual friendship
        localStorage.setItem('users', JSON.stringify(users));
        renderFriends();
        alert(`You are now friends with ${friend}!`);
    } else {
        alert('Cannot add this friend.');
    }
};

function renderFriends(){
    friendsList.innerHTML = '';
    users[currentUser].friends.forEach(f => {
        const li = document.createElement('li');
        li.classList.add('friend');
        li.innerText = f;
        friendsList.appendChild(li);
    });
}

// --------------------
// Chat System
// --------------------
createChatBtn.onclick = () => {
    const chatName = chatNameInput.value;
    if(chatName && !chats[chatName]){
        chats[chatName] = { members: [currentUser], messages: [] };
        users[currentUser].chats.push(chatName);
        localStorage.setItem('chats', JSON.stringify(chats));
        localStorage.setItem('users', JSON.stringify(users));
        renderChats();
    } else {
        alert('Chat already exists or name empty!');
    }
};

function renderChats(){
    chatsList.innerHTML = '';
    users[currentUser].chats.forEach(c => {
        const li = document.createElement('li');
        li.classList.add('friend');
        li.innerText = c;
        li.onclick = () => openChat(c);
        chatsList.appendChild(li);
    });
}

function openChat(chatName){
    currentChat = chatName;
    chatMessages.innerHTML = '';
    chats[chatName].messages.forEach(m => {
        const div = document.createElement('div');
        div.classList.add('chat-message');
        div.innerText = `${m.sender}: ${m.text}`;
        chatMessages.appendChild(div);
    });
}

// Send message
sendMsgBtn.onclick = () => {
    const text = chatInput.value;
    if(currentChat && text){
        chats[currentChat].messages.push({ sender: currentUser, text });
        localStorage.setItem('chats', JSON.stringify(chats));
        chatInput.value = '';
        openChat(currentChat);
    }
};

// --------------------
// Notes System
// --------------------
saveNoteBtn.onclick = () => {
    const note = noteText.value;
    if(note){
        users[currentUser].notes.push(note);
        localStorage.setItem('users', JSON.stringify(users));
        noteText.value = '';
        renderNotes();
    }
};

function renderNotes(){
    notesList.innerHTML = '';
    users[currentUser].notes.forEach(n => {
        const li = document.createElement('li');
        li.classList.add('note-item');
        li.innerText = n;
        notesList.appendChild(li);
    });
}
