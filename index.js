// It is a node server which will handle socket io connections

const io = require('socket.io')(8000);
// isme hmlog socket.io port 8000 pe.
// ye jo socket.io server run kiye hai ye listen karega incoming events ko.

const users = {};

io.on('connection', socket => {
    // io.on jo hai socket instance hai jo bht sare socket connections ko listen karega 
    socket.on('new-user-joined', name => {
        // if any new user joined, let others user connected to the server know!
        // ye socket.on jo hai wo socket instance hai jo particular connection ko listen karega.
        // console.log("New user", name);

        // ab jo socket.on (new-user-joined) event bhej rha hai to kyy karu to iske liye niche code hai
        users[socket.id] = name;
        // matlab jitne bhi users hai usko ek key de do socket.id aur equal to name kar do.
        // aur jaise hi (new-user-joined) event chalega usk0 hmlog users variable me append kar denge

        socket.broadcast.emit('user-joined', name);
        // ye jo socket.broadcast.emit hai wo sab ko msg dega that someone joined the chat but usko nahi dega jo joined kiya hai chat ko.
    });
    // overall matlab ye hua hai ki agar (newuserjoined) wala event chala to to hmlog (users[socket.id]) se upar wala const users ko update karenge aur uske niche wale statement se sab ko bata denge ki (user-joined) jiska name ye hai. 


    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
    // if someone sends a message, broadcast it to other people
    // ab jab koi msg send kiya to hmlog sab ko bata denge that ye msg recieve kar lo (send event fire kar k) aur bata denge ek (obejet) bana k ki message jo hai wo aur kaun bheja hai uska name.


    // if someone leaves the Chat, lets other know
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });

});

// ye index.js hai wo node server pe chal rha hai aur hmlog ka ek website hai frontend wala wo live server pe chal rha hai