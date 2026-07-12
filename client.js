import { time, timeStamp } from 'console';
import  fs  from 'fs';
import net from 'net'
import path from 'path';
import readline from 'readline';
import { getTargetDir } from './rlCommands.js';
import os from 'os';
import { createSocket } from './socket.js';
import { threadCpuUsage } from 'process';

export const client = new net.Socket(); 

export function setPort(newPort){
    PORT = newPort;
}


export function clientConnect(arg, host = null) {
    return new Promise((res, rej) => {
        createSocket(client);
    console.log(`Attempting connection to ${host}:${arg}...`);

    client.on('error', (err) => {
        console.error(`Socket error: ${err.message}`);
        rej(new Error(err.message))
    });

    // 2. Initiate the connection
    client.connect(arg, host, () => {
        console.log(`Connected to ${host}:${arg}`);
        res()
    });
    })
    
    
}
