import { usersMap } from "./server.js";
import {userType} from './socket.js'
import { broadCastPacket } from "./fileHandling.js";
import { clientSocket } from "./socket.js";

export function postMessage(type, content){
    if(!usersMap.size > 0 && !clientSocket){
        console.log('No sockets found')
        return
    } 
    
    const packet = {
        type: type,
        content: content,
        timeStamp: Date.now(),
        senderType: userType,
        sender: `${clientSocket.localAddress}:${clientSocket.localPort}`
    };
    try{
        if(userType === 'server'){
        broadCastPacket(packet)
        }
    if(userType === 'client'){
        clientSocket.write(JSON.stringify(packet) + '\n')
    }
    }catch(e){
        console.log(e.message)
        return;
    }
    console.log('SUCCESFULLY SENT the following packet')
    console.log(packet)
    }

    