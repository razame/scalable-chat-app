'use client'
import React, {useEffect, useCallback, useContext, useState} from 'react'
import {io, Socket} from 'socket.io-client'
// import {sendMessage} from "next/dist/client/dev/error-overlay/websocket";

interface SocketProviderProps {
    children ?: React.ReactNode,
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
    messages: string[];
}

const SocketContext = React.createContext<ISocketContext|null>(null)

export const useSocket = () => {
    const state = useContext(SocketContext)
    if(!state){
        throw new Error('state is undefined')
    }
    return state
}


export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([])
    const [message, setMessage ] = useState('')
    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
        console.log(`Sent Message: ${msg}`)
        if(socket){
            socket.emit('event:message', {message: msg})
        }
        // setMessage('');
    }, [socket])

    const onMessageReceived = useCallback((msg: string) => {
        console.log('ON Message Received', msg)
        const {message} = JSON.parse(msg) as {message: string}
        console.log('here is the message', message)
        setMessages((prev) => [...prev, message])
    }, [])

    useEffect(() => {
        const _socket = io('http://localhost:8000')
        _socket.on('message', onMessageReceived)
        setSocket(_socket)
        return () => {
            _socket.off('message', onMessageReceived)
            _socket.disconnect()
            setSocket(undefined)
        }
    }, [])
    return (
        <SocketContext.Provider value={{sendMessage, messages}}>{children}</SocketContext.Provider>
    )
}