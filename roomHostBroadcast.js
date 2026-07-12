import dgram from 'node:dgram'
import { address } from './server.js';
import {clientConnect} from './client.js'

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
        port: address.port 
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

export function roomDiscoveryLs() {
    const client = dgram.createSocket('udp4');

    client.on('message', (msg, rinfo) => {
        try {
            const data = JSON.parse(msg.toString());
            if (data.service === 'localShare') {
                console.log(`Server found at: ${rinfo.address}:${data.port}`);
                clientConnect(data.port, rinfo.address)
                client.close();
            }
        } catch (e) {
            console.error('Failed to parse discovery packet');
        }
    });
    client.bind(PORT, () => {
        console.log('Listening for localShare servers...');
    });
}