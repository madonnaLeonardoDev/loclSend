import { time, timeStamp } from 'console';
import  fs  from 'fs';
import net from 'net'
import path from 'path';
import readline from 'readline';
import { getTargetDir } from './rlCommands.js';
import os from 'os';
import { createSocket } from './socket.js';

export const client = new net.Socket(); 

export function setPort(newPort){
    PORT = newPort;
}


export function clientConnect(arg, host = null) {
    createSocket(client);
    console.log(`Attempting connection to ${host}:${arg}...`);

    // 1. Catch all errors generically to prevent process crashes
    client.on('error', (err) => {
        console.error(`Socket error: ${err.message}`);
    });

    // 2. Initiate the connection
    client.connect(arg, host, () => {
        console.log(`Connected to ${host}:${arg}`);
    });
}
