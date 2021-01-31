// ye website alag hai aur nodeserver dono alag hai. Homlog ye website ko nodeserver se connect karenge. Client.js me java script likh k
// matlab ye jo nodeserver folder ko chor k jo hai wo mera website hai aur wo nodeserver hai aur hmko dono ko connect karna hai

const socket = io('http://localhost:8000');


// get DOM that will play on receiving messages
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageinp');
const messageContainer = document.querySelector(".container");
// upar wale ka matlab hai agar hmlog k paas msg aayenge to usko class (container) me daalenge

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');


// Function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}


const name = prompt("Enter your name to join");
// Ask new user for his/her name and let the server know.
// ye isse ek prompt aayega aur usme jo daalenge wo name me save ho jayega.
// aur jaise hi user apna name daalega waise hi hmlog ek mesaage denge jo aur event me same wahi denge jo hmlog index.js i.e,(nodeserver) me diye the.
socket.emit('new-user-joined', name);
// ye jo name pass kiye hai ussi name ko le k Index.js wala socket.on le k aage chalega.


socket.on('user-joined', name =>{
    append(`${name} joined the chat`,'right');
});
// if new user joined, receive his/her name from the server.
// ab jo indexedDB.js me broadcast kiye hai uske baad hmlog ko user-joined event ko listen bhi karna parega.


socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
});
// If server sends a message, receive it.


socket.on('leave', name =>{
    append(`${name} left the chat`, 'left');
});
// if user leaves the chat, append info to the container 



// If the form gets submitted, send server the message.
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // isse hmlog send button click karne se page reload nahi hoga
    
    const message = messageInput.value;
    // isme message variable me message ko store karwa diye hai
    
    append(`You: ${message}`, 'right');
    // iske help se hmlog append karwa diye hai message ko with passing the message variable in the right
    
    socket.emit('send', message);
    // isse hmlog message bhejne k baad server ko bata bhi diye that message bheje hai by firing an event (send) and giving the mesaage varible

    messageInput.value = '';
    // ye upar wala hmlog isiliye lagaye hai taaki jab hmlog message ko send kar de to uske baad hmlog ka message wala container blank ho jaye.
});