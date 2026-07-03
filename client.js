import { time, timeStamp } from 'console';
import  fs  from 'fs';
import net from 'net'
import path from 'path';
import readline from 'readline';
import { getTargetDir } from './rlCommands.js';
import os from 'os';
import { createSocket } from './socket.js';

function getLocalIPv4() {
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Filter: Must be IPv4, not the loopback (internal) address
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}
export const client = new net.Socket(); 

export let PORT = 8000;
const HOST = getLocalIPv4()

export function setPort(newPort){
    PORT = newPort;
}

export function clientConnect(arg = PORT) {
    createSocket(client);
    console.log(`Attempting connection to ${HOST}:${arg}...`);

    // 1. Catch all errors generically to prevent process crashes
    client.on('error', (err) => {
        console.error(`Socket error: ${err.message}`);
    });

    // 2. Initiate the connection
    client.connect(arg, HOST, () => {
        console.log(`Connected to ${HOST}:${arg}`);
    });
}
