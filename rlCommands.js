import net from 'net'
import { time, timeStamp } from 'console';
import  fs  from 'fs';
import path from 'path';
import {rl} from './main.js';
import { postMessage } from './postMsg.js';
import { clientSocket, closeSocket, userId } from './socket.js';
import { broadCastPacket } from './fileHandling.js';
import { availableRooms, removeRoom } from './roomHostBroadcast.js';

//socket writing function



function checkValidArguments(args, argsArray, range) {
    let state;
        if(!args){
            return false;
        }
        for(let i = 0; i <= range; i++){
                if(!argsArray[i]){
                    return false;
                }
        }
        return true;

}
function isValidHost(host) {
    const isIp = net.isIP(host) !== 0;
    const isHostname = /^[a-zA-Z0-9.-]+$/.test(host);
    return isIp || isHostname;
}

//FILE SAVING DIRECTORY

let targetDirectory = null;

export function getTargetDir(){
    return targetDirectory;
}

// rlCommands list
const rlCommands = {
    'test': (args, argsArray) => {
    },
    'room': async (args, argsArray) =>{
                        if(!checkValidArguments(args, argsArray, 1)) {
                            console.log('Invalid Command see /help');
                            return;
                        };
                        if(argsArray[0] == 'create'){
                            const {serverBoot} = await import('./server.js')
                            if(/^\d+$/.test(argsArray[1]) && argsArray[1].length >= 1 && argsArray[1].length <= 5 && argsArray[2]){
                                if(argsArray[2].length > 2){
                                    console.log(`Creating room ${argsArray[2]} on port ${argsArray[1]}`)
                                    serverBoot(argsArray[1], argsArray[2])
                                    return;
                                }else{
                                    console.log('Choose a Room name of at least 3 chars');
                                    return;
                                }  
                            }
                            console.log('Invalid PORT or room name')
                            return;
                        }
                        if(argsArray[0] == 'join'){
                            const {clientConnect} = await import('./client.js');
                            
                                try{
                                    const roomNameValue = availableRooms.get(argsArray[1]).split(':')
                                    await clientConnect(roomNameValue[1], roomNameValue[0]);
                                    return;
                                }catch(e){
                                    removeRoom(argsArray[1])
                                    console.log(availableRooms)
                                }
                            if(/^\d+$/.test(argsArray[2]) && argsArray[2].length >= 1 && argsArray[2].length <= 5){
                                if(isValidHost(argsArray[1]) && argsArray[1]){
                                    console.log(`Connecting to room ${argsArray[1]}:${argsArray[2]}`)
                                    await clientConnect(argsArray[2], argsArray[1]).catch((err) => {
                                        console.log(err.message) 
                                        return;
                                    })
                                }else{
                                    console.log('Invalid Host')
                                }
                                
                            return;
                            }
                            console.log('Invalid PORT')
                        }
                        if(argsArray[0] == 'list'){
                            if(availableRooms.size === 0){
                                console.log('No rooms discovered, use /discover listen to discover new rooms');
                                return
                            } else {
                                console.log(availableRooms.keys())
                                return
                            }
                        }
                        console.log('Invalid Argument')
                        return;
                    },
    'help': () => {console.log('to be made still...')},
    'exit': () => {  
                                    closeSocket()
                                    
                                },
    'msg': (args) => {
                        if(!checkValidArguments(args)){
                            console.log('Invalid Command see /help')
                            return
                        }
                                postMessage('MSG', args)
                                console.log(`>>> ${args}`)
                        },
    'file': (args, argsArray) => {
                            if(!checkValidArguments(args, argsArray, 0)){
                            console.log('Invalid Command see /help')
                            return
                            }
                            if(argsArray[0] == 'path'){
                                if(!argsArray[1]){
                                    console.log(`Insert a valid File Path`)
                                    return;
                                }
                               targetDirectory = argsArray[1];
                                if(targetDirectory === ''){
                                    console.log("Choose a File Path");
                                    return;
                                }
                                console.log(`Path set to ${targetDirectory}`)
                                return;
                            } 
                                const filePath = args;
                                fs.readFile(args, (err, data) => {
                                    if(err){
                                        console.log(`The following error occured: ${err.message}`);
                                        return;
                                    }

                                postMessage('SERVER-FILE', {
                                    fileName: path.basename(filePath),
                                    file: data.toString('base64')
                                })

                                })
                        },
    'discover': async (args, argsArray) => {
        if(!checkValidArguments(args, argsArray, 0)){
                            console.log('Invalid Command see /help')
                            return;
        }
        if(argsArray[0] === 'shout'){
            const {roomDiscoveryBc} = await import('./roomHostBroadcast.js')
            roomDiscoveryBc()
            return;
        }
        if(argsArray[0] === 'listen'){
            const {roomDiscoveryLs} = await import('./roomHostBroadcast.js')
            roomDiscoveryLs(checkValidArguments(argsArray[1]))
            return;
        }
        console.log('Insert a valid argument')
    },
    'role': async (args, argsArray) => {
        if(!checkValidArguments(args, argsArray, 1)){
                            console.log('Invalid Command see /help')
                            return;
        };
        const {hasAdmin, promote, demote, getUserPermissions} = import('./permissions.js')
        if(argsArray[0] === 'promote'){
        promote(argsArray[1]);
        return
        }
        if(argsArray[0] === 'demote'){
            demote(argsArray[1])
            return
        }
        if(argsArray[0] === 'get'){
            getUserPermissions(argsArray[1])
        }
        console.log('Invalid Argument');
    }
    
}

export function executeCLICommands(key, args){
    const cmd = rlCommands[key]
    let argsArray;
    if(args && args.split(' ') !== ''){
        argsArray = args.split(' ');
    } else {
        argsArray = null;
    }
    
    if(!cmd){ 
        console.log('Command not found use /help to see all the available commands');
        return
    } 
        rlCommands[key](args, argsArray)
}

