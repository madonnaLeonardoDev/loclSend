//Imports

import { time, timeStamp } from 'console';
import net from 'net'
import readline from 'readline';
import { createSocket, userId } from './socket.js';


//Default PORT
export let PORT = 8000;

//Any host on same port
const HOST = '0.0.0.0';

export let usersMap = new Map()

export function serverBoot(arg = PORT){
    //server variable

    const server = net.createServer((socket) => {
    createSocket(socket, 'server')
    console.log(`New Client connected: ${userId(socket)}`)
    //Add the connected socket to usersMap
    usersMap.set(userId(socket), {
        socket: socket
    })
    //Check if the server was added to the userMap if not add
        if(!usersMap.has(`${socket.localAddress}:${socket.localPort}`)){
            usersMap.set(`${socket.localAddress}:${socket.localPort}`, {
            socket: 'server'
        })
        }
    });

//server listen

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
