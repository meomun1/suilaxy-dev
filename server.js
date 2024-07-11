import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*', // Allow all origins for simplicity. Adjust as needed.
		methods: ['GET', 'POST'],
	},
})

io.on('connection', (socket) => {
	console.log('a user connected')

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})

	socket.on('message', (msg) => {
		console.log('message: ' + msg)
		io.emit('message', msg) // Broadcast the message to all clients
	})

	socket.on('sceneStart', (scene) => {
		console.log('Scene started: ' + scene)
		// You can handle specific scene start events here if needed
	})
})

server.listen(3001, () => {
	console.log('listening on *:3001')
})
