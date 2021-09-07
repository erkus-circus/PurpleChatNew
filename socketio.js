import io from 'socket.io-client'
const SERVER =  "https://lucid-detroit.com"
// const SERVER = "https://192.168.1.123"
const SERVEROPTS = {
    transports: ["websocket"],
    secure: true
}

if (!window.navigator.userAgent) {
    window.navigator.userAgent = "react-native";
}

global.clientID = {
    TTL: null,
    user: null,
    userID: null,
}

export const socket = io(SERVER, SERVEROPTS)
export const chatSocket = io(SERVER + "/chat", SERVEROPTS);
export const accountSocket = io(SERVER + "/accounts", SERVEROPTS)