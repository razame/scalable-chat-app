import http from "http"
import SocketService from "./services/socket"

async function init(){
    const socketService = new SocketService()
    const httpServer = http.createServer()
    const port = process.env.PORT ? process.env.PORT : 8000
    socketService.io.attach(httpServer)
    httpServer.listen(port, () => {
        console.log(`Http Server started on PORT:${port}`);
    })
    socketService.initListeners()
}

init();