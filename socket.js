import { handleData } from "./fileHandling.js";

export let activeSocket = null;

export let usersMap = new Map()

export function createSocket(socket, type = null){
    const userId = `${socket.remoteAddress}:${socket.remotePort}`;
    if(type === 'server'){
        console.log(`Client connected ${socket.remoteAddress}`)
    }
    
    activeSocket = socket;
    //Incoming data handling
    socket.on('data', (chunk) => {
        handleData(chunk, socket)
        });

    socket.on('end', () => {
        console.log('Client disconnected');
        activeSocket = null
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err.message);
    });
}

export async function closeSocket(){
    if(!activeSocket || activeSocket.destroyed){
        console.log('Socket was already closed or null')
        return;
    }
    console.log('Closing Socket...')
    await new Promise((resolve) => {
        if (activeSocket.destroyed) return resolve();
        activeSocket.once('close', () => resolve())
        activeSocket.end()
    }).then(() => {
        console.log('Socket Closed Succesfully')
        activeSocket = null
        return;
    })
    
}