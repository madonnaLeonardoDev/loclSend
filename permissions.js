import { usersMap } from "./server.js";


export function hasAdmin(userId){
    if(!usersMap.get(userId)){
        console.log('Invalid User ID')
    }
if(usersMap.get(userId).admin){
    return true;
}
return false;
}

export function promote(userId){
    if(!usersMap.get(userId)){
        console.log('Invalid User ID')
        return
    }
    usersMap.get(userId).admin = true;
    console.log(`${userId} promoted to admin`)
}

export function demote(userId){
    if(!usersMap.get(userId)){
        console.log('Invalid User ID')
        return
    }
    usersMap.get(userId).admin = false;
    console.log(`${userId} demoted`)
}

function getUserPermissions(userId){
    if(!usersMap.get(userId)){
        console.log('Invalid User ID')
        return
    }
    const userAdmin = usersMap.get(userId).admin;
    if(userAdmin) {
        console.log(`${userId} has admin permsissions`)
    }else {
        console.log(`${userId} does NOT have admin permissions`)
    }
    
}