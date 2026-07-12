import dgram from 'node:dgram'
import { address } from './server.js';
import {clientConnect} from './client.js'
import { type } from 'node:os';

const PORT = 42424; // Pick any unused port

export function roomDiscoveryBc(timeWindow = 30000){
    const socket = dgram.createSocket('udp4');
    if(!address.ip || !address.port){
        console.log('You need to be the rooms owner')
        return;
    }
    socket.bind(() => {
    socket.setBroadcast(true);
    
    const message = Buffer.from(JSON.stringify({ 
        service: 'localShare', 
        port: address.port ,
        roomName: address.roomName
    }));

    // Broadcast every 5 seconds
    const interval = setInterval(() => {
        socket.send(message, PORT, '255.255.255.255');
    }, 2000);

    setTimeout(() => {
        clearInterval(interval)
        socket.close()
        console.log('Discovery broadcast stopped')

    }, timeWindow + 2000)
    });
    
}

export let availableRooms = new Map();

export function removeRoom(key) {
    availableRooms.delete(key)
}

export function roomDiscoveryLs(arg) {
    const client = dgram.createSocket('udp4');

    client.on('message', (msg, rinfo) => {
        try {
            const data = JSON.parse(msg.toString());
            if (data.service === 'localShare') {
                if(availableRooms.has(data.roomName)) return; 
                availableRooms.set(data.roomName, `${rinfo.address}:${data.port}`)
                console.log(availableRooms)
                if(arg === 'auto'){
                    clientConnect(data.port, rinfo.address)
                    client.close()
                }else{
                    console.log(`Discovered Room, Use /room list to see discovered rooms and /room join <roomName> to connect to the room`);
                    setInterval(() => {
                        try{client.close()}catch(e){
                            if(e.code !== 'ERR_SOCKET_DGRAM_NOT_RUNNING'){console.log(e.message)}
                        }
                    }, 10000);
                }
                
            }
        } catch (e) {
            console.error('Failed to parse data');
        }
    });
    client.bind(PORT, () => {
        console.log('Listening for localShare servers...');
    });
}