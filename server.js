import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import config from './src/game/config/config.js'

const app = express()
const server = createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*', // Adjust as needed for production
		methods: ['GET', 'POST'],
	},
})

let players = {}
let playerCount = 0

io.on('connection', (socket) => {
	console.log('a user connected:', socket.id)

	// Check if there are already 2 players connected
	if (playerCount < 2) {
		playerCount++
		let playerNumber = playerCount + 1

		players[socket.id] = {
			playerId: socket.id,
			playerNumber: playerNumber,
			y: playerNumber === 1 ? (config.height * 4) / 5 : config.height / 5,
			x: config.width / 2,
		}

		// Send current players to new player
		socket.emit('currentPlayers', players)

		// Notify other players about new player
		socket.broadcast.emit('newPlayer', players[socket.id])
	} else {
		socket.emit('gameFull')
	}

	socket.on('playerMovement', (movementData) => {
		if (players[socket.id]) {
			players[socket.id].x = movementData.x
			players[socket.id].y = movementData.y
			socket.broadcast.emit('playerMoved', players[socket.id])
		}
	})

	socket.on('disconnect', () => {
		console.log('user disconnected:', socket.id)
		if (players[socket.id]) {
			delete players[socket.id]
			playerCount--
			io.emit('playerDisconnected', socket.id)
		}
	})
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
