import io from 'socket.io-client';
import readline from 'readline';


const socket = io('https://general-chat-node.tu4rl4.easypanel.host/');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('connect', () => {
    console.log(`Connected to server`);
});

socket.on('message', (message) => {
    console.log(message);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    rl.close();
});

socket.on('error', (err) => {
    console.error(`Connection error: ${err.message}`);
});

rl.on('line', (input) => {
    if (!socket.nameSet) {
        socket.emit('setName', input);
        socket.nameSet = true;
    } else {
        socket.emit('chatMessage', input);
    }
});

process.on('SIGINT', () => {
    console.log('\nDisconnecting from server...');
    socket.disconnect(() => {
        console.log('Disconnected.');
        process.exit(0);
    });
});
