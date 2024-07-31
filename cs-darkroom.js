import io from 'socket.io-client'
import readline from 'readline'
import chalk from 'chalk'
import figlet from 'figlet'

const socket = io('https://general-chat-node.tu4rl4.easypanel.host/')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.clear()
console.log(chalk.green(figlet.textSync('CS-Darkroom', { font: 'Slant' })))

const prompt = () => {
  process.stdout.write(chalk.cyan('⚡ '))
}

socket.on('connect', () => {
  console.log(chalk.yellow('🔒 Secure connection established'))
  console.log(chalk.magenta('Enter your hacker alias:'))
  prompt()
})

socket.on('message', (message) => {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  console.log(
    chalk.green(`[${new Date().toLocaleTimeString()}] `) + chalk.white(message)
  )
  prompt()
})

socket.on('disconnect', () => {
  console.log(chalk.red('❌ Connection terminated'))
  rl.close()
})

socket.on('error', (err) => {
  console.error(chalk.red(`⚠️ Connection error: ${err.message}`))
})

rl.on('line', (input) => {
  if (!socket.nameSet) {
    socket.emit('setName', input)
    socket.nameSet = true
    console.log(chalk.yellow('Identity confirmed. Entering the matrix...'))
  } else {
    socket.emit('chatMessage', input)
  }
  prompt()
})

process.on('SIGINT', () => {
  console.log(chalk.yellow('\nInitiating disconnect sequence...'))
  socket.disconnect(() => {
    console.log(chalk.red('Disconnected. Exiting the matrix.'))
    process.exit(0)
  })
})
