import io from 'socket.io-client'

// Assuming the intention is to dynamically select the PORT based on some condition
// For example, checking if the app is running in a development environment
let PORT = 'https://render-socket-t2rl7mbmfa-as.a.run.app/'

const socket = io(PORT)

export default socket
