import readline from 'readline';
import { executeCLICommands } from './rlCommands.js';

//readline initiation

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>>>  '
})

rl.prompt()




rl.on('line', (line) => {
    if(line.charAt(0) === '/'){
        let cmdKey;
        let cmdArgs;
        if(line.includes(" ")){
            cmdKey = line.slice(1, line.indexOf(' '))
            cmdArgs = line.slice(line.indexOf(' ') + 1)
        } else {
            cmdKey = line.slice(1);
            cmdArgs = null;
        }
        
        executeCLICommands(cmdKey, cmdArgs)
    }
})

