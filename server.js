//Imports

import { time, timeStamp } from 'console';
import net from 'net'
import os from 'node:os'
import readline from 'readline';
import { createSocket, userId } from './socket.js';
import { broadCastPacket } from './fileHandling.js';
import { postMessage } from './postMsg.js';

//Any host on same port
export let address = {
    ip: null,
    port: null
};

export let usersMap = new Map()

function updateServerMeta(socket, roomName) {
return {
    roomName: roomName,
    ownerId: `${socket.localAddress}:${socket.localPort}`,
    activeUsersId: [...usersMap.keys()],
    roomPort: socket.localPort
}
}

function getLocalIPv4() {
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip IPv6 and internal (127.0.0.1) addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; // Fallback
}

export let serverSideRoomMeta = null;

export function serverBoot(arg, roomName){
    //server variable

    const server = net.createServer((socket) => {
    createSocket(socket, 'server')
    console.log(`New Client connected: ${userId(socket)}`)
    //Add the connected socket to usersMap
    usersMap.set(userId(socket), {
        socket: socket,
        admin: false
    })
    //Check if the server was added to the userMap if not add
        if(!usersMap.has(`${socket.localAddress}:${socket.localPort}`)){
            usersMap.set(`${socket.localAddress}:${socket.localPort}`, {
            socket: 'server'
        })
        }
    serverSideRoomMeta = updateServerMeta(socket, roomName);
    postMessage('serverMetaUpdate', serverSideRoomMeta);

    socket.on('end', () => {
        serverSideRoomMeta = null
        usersMap = new Map();
    })
    });

//server listen

   try{
    server.listen(arg, '0.0.0.0', () => {
        if(arg === 8000){
            console.log(`Server listening on default port ${'0.0.0.0'}:${arg}`);
        } else {
            console.log(`Server listening on ${'0.0.0.0'}:${arg}`);
        }
        address = {
           ip: getLocalIPv4(),
           port: arg,
           roomName: roomName
        }
    });
   } catch(e){
    console.log(`The following error occured: ${e.message}`)
   }
}
