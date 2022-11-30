import { v4 as uuidv4 } from 'uuid';

export const setItem = (key, value) => {
    if(typeof window !== 'undefined'){
        window.localStorage.setItem(key, value)
   }
}

export const getItem = (key) => {
    if(typeof window !== 'undefined'){
        return window.localStorage.getItem(key)
   }
}

export const getSessionId = () => {
    if(typeof window !== 'undefined'){
        const sessionId = getItem('sessionId')
        if(sessionId){
            return sessionId
        }
        const newSessionId = uuidv4() // uuidv4 is a function that generates a random uuid 
        setItem('sessionId', newSessionId)
        return newSessionId
   }
}