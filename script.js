// --------------------
// In-browser "database"
// --------------------
let users = JSON.parse(localStorage.getItem('users')) || {};
let chats = JSON.parse(localStorage.getItem('chats')) || {};
let currentUser = localStorage.getItem('currentUser') || null;
let currentChat = null;

// --------------------
// Elements
// --------------------
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

const friendNameInput = document.getElementById('friend-name');
const addFriendBtn = document.getElementById('add-friend-btn');
const friendsList = document.getElementById('friends-list');
const requestsList = document.getElementById('requests-list');
const usersDatalist = document.getElementById('users-list');

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
// Redirect if not logged in
// --------------------
if(!currentUser || !users[currentUser]){
    window.location.href = 'login.html';
}

userDisplay.innerText = currentUser;

// --------------------
// Logout
// --------------------
logoutBtn.onclick = () => {
    currentUser = null;
    currentChat = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};

// --------------------
// Render Users for Autocomplete
// --------------------
function renderUserAutocomplete(){
    usersDatalist.innerHTML = '';
    Object.keys(users).forEach(u => {
        if(u !== currentUser && !users[currentUser].friends.includes(u)){
            const option = document.createElement('option');
            option.value = u;
            usersDatalist.appendChild(option);
        }
    });
}
renderUserAutocomplete();

// --------------------
// Friends System
// --------------------
function renderFriends(){
    friendsList.innerHTML = '';
    (users[currentUser].friends || []).forEach(f => {
        const li = document.createElement('li');
        li.innerText = f;
        friendsList.appendChild(li);
    });
}

function renderFriendRequests(){
    requestsList.innerHTML = '';
    (users[currentUser].friendRequests || []).forEach(req => {
        const li = document.createElement('li');
        li.innerText = req + " ";

        const acceptBtn = document.createElement('button');
        acceptBtn.innerText = "Accept";
        acceptBtn.onclick = () => {
            // Add each other as friends
            users[currentUser].friends.push(req);
            users[req].friends.push(currentUser);
            // Remove from requests
            users[currentUser].friendRequests = users[currentUser].friendRequests.filter(r => r !== req);
            localStorage.setItem('users', JSON.stringify(users));
            renderFriends();
            renderFriendRequests();
            renderUserAutocomplete();
        };

        const rejectBtn = document.createElement('button');
        rejectBtn.innerText = "Reject";
        rejectBtn.onclick = () => {
            users[currentUser].friendRequests = users[currentUser].friendRequests.filter(r => r !== req);
            localStorage.setItem('users', JSON.stringify(users));
            renderFriendRequests();
            renderUserAutocomplete();
        };

        li.appendChild(acceptBtn);
        li.appendChild(rejectBtn);
        requestsList.appendChild(li);
    });
}

// Add friend (send request)
addFriendBtn.onclick = () => {
    const friend = friendNameInput.value;
    if(users[friend] && friend !== currentUser && 
       !users[currentUser].friends.includes(friend) &&
       !users[friend].friendRequests.includes(currentUser)) {

        users[friend].friendRequests.push(currentUser);
        localStorage.setItem('users', JSON.stringify(users));
        renderFriendRequests();
        renderUserAutocomplete();
        alert(`Friend request sent to ${friend}!`);
    } else {
        alert('Cannot send request.');
    }
};

renderFriends();
renderFriendRequests();

// --------------------
// Chat System
// --------------------
function renderChats(){
    chatsList.innerHTML = '';
    (users[currentUser].chats || []).forEach(c => {
        const li = document.createElement('li');
        li.innerText = c;
        li.onclick = () => openChat(c);
        chatsList.appendChild(li);
    });
}
renderChats();

createChatBtn.onclick = () => {
    const chatName = chatNameInput.value;
    if(chatName && !chats[chatName]){
        chats[chatName] = { members: [currentUser], messages: [] };
        users[currentUser].chats.push(chatName);
        localStorage.setItem('chats', JSON.stringify(chats));
        localStorage.setItem('users', JSON.stringify(users));
        renderChats();
    } else {
        alert('Chat already exists or empty!');
    }
};

function openChat(c){
    currentChat = c;
    chatMessages.innerHTML = '';
    chats[c].messages.forEach(m => {
        const div = document.createElement('div');
        div.classList.add('chat-message');
        div.innerText = `${m.sender}: ${m.text}`;
        chatMessages.appendChild(div);
    });
}

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
function renderNotes(){
    notesList.innerHTML = '';
    (users[currentUser].notes || []).forEach(n => {
        const li = document.createElement('li');
        li.classList.add('note-item');
        li.innerText = n;
        notesList.appendChild(li);
    });
}
renderNotes();

saveNoteBtn.onclick = () => {
    const note = noteText.value;
    if(note){
        users[currentUser].notes.push(note);
        localStorage.setItem('users', JSON.stringify(users));
        noteText.value = '';
        renderNotes();
    }
};
