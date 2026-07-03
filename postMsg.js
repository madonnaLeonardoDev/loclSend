import { activeSocket } from "./socket.js";

export function postMessage(type, content){
    if(!activeSocket){
        console.log('No client connected to the pipe');
        return;
    } 
    const packet = {
        type: type,
        content: content,
        timeStamp: Date.now()
    }

    activeSocket.write(JSON.stringify(packet) + '\n')
    console.log('SUCCESFULLY SENT the following packet')
    console.log(packet)
}