import {Server} from 'socket.io'
import Redis from 'ioredis'
const cred = {
    'host': 'redis-a4ed058-razame-scalable-chat-app.a.aivencloud.com',
    'port': 10826,
    'username': 'default',
    'password': 'AVNS_1CphBRy3iPmCF-EEvBx'
}
const pub = new Redis(cred)
const sub = new Redis(cred)
class SocketService {
    private _io: Server
    constructor() {
        console.log('Started Init Socket Server')
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        })
        sub.subscribe('MESSAGES')
        console.log('Ended Init Socket Server')
    }

    public initListeners(){
        const io = this.io
        console.log('Initialize Socket listeners')
        io.on('connect', socket => {
            console.log(`New Socket Connected Id: ${socket.id}`)
            socket.on('event:message', async ({message}: {message: string}) => {
                console.log(`New message received: ${message}`)
                await pub.publish('MESSAGES', JSON.stringify({message}) )
            })
        })

        sub.on('message', (channel, message) => {
            if(channel === 'MESSAGES') {
                io.emit('message', message)
                console.log(`Here is the subscribed channel's message ${message}`)
            }
        })
    }

    get io(){
        return this._io
    }
}

export default SocketService