//Imports

import { time, timeStamp } from 'console';
import net from 'net'
import readline from 'readline';
import { createSocket } from './socket.js';


//Default PORT
export let PORT = 8000;

//Any host on same port
const HOST = '0.0.0.0';

export function setPort(newPort){
    PORT = newPort;
}

export let usersMap = new Map()

const server = net.createServer((socket) => {
    const userId = `${socket.remoteAddress}:${socket.remotePort}`;
    createSocket(socket, 'server')
    usersMap.set(userId, {
        socket: socket
    })
});

server.on('connection', (socket) => {
    const userId = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`New Client connected: ${userId}`)
    usersMap.set(userId, {
        socket: socket
    })
})





export function serverBoot(arg = PORT){
   try{
    server.listen(arg, HOST, () => {
        if(arg === 8000){
            console.log(`Server listening on default port ${HOST}:${arg}`);
        } else {
            console.log(`Server listening on ${HOST}:${arg}`);
        }
    
    });
   } catch(e){
    console.log(`The following error occured: ${e.message}`)
   }
}



export function serverReboot() {
    try{
        server.close(() => {
        console.log('Waiting 500ms to clear port...')

        setTimeout(() => {
            server.listen(PORT, HOST, () => {
                console.log(`Server listening on ${HOST}:${PORT}`);
            });
        }, 500)
    })
    } catch(e){
        console.log(`Something went wrong: ${e}`)
    }
    

}
