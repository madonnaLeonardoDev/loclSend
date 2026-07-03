import { handleData } from "./fileHandling.js";

export let activeSocket = null;

export function userId(socket){
    return `${socket.remoteAddress}:${socket.remotePort}`
}

export function createSocket(socket, type = null){    
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
        activeSocket.end()})
        console.log('Socket Closed Succesfully')
        activeSocket = null
    }