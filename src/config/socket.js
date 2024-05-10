import { ref } from 'vue';
const socketUrl = 'ws://localhost:8081/erp_base/ws';
const socket = ref(null)
const reconnectInterval = 3000;
let maxReconnect = 5;

function buildSocket() {
    const customHeaders = {
        'Authorization': localStorage.getItem('token')
    };
    if (!socket.value || socket.value.readyState === WebSocket.CLOSED) {
        socket.value = new WebSocket(socketUrl, [], { headers: customHeaders });

        socket.value.onopen = function () { //連線(onopen)
            console.log("websocket connected!!");
            maxReconnect = 5; // 重置重連次數上限
            socket.value.send(JSON.stringify({topic: '/user/topic/notification'}));
        };
        socket.value.onmessage = function (msg) { //監聽訊息(onmessage)
            console.log("onmessage", msg);
        };
        socket.value.onerror = function (err) { //監聽錯誤(onerror)
            console.log("error", err);
            closeWS();
            reconnect();
        };
        socket.value.onclose = function () { //監聽關閉
            console.log('WebSocket disconnected');
        };
    }
    return socket.value;
}

function reconnect() {
    if (maxReconnect > 0) {
        maxReconnect--;
        setTimeout(() => {
            console.log("reconnect...");
            socket.value = buildSocket();
        }, reconnectInterval);
    } else {
        console.log("Max reconnect attempts reached. Cannot reconnect.");
    }
}

function closeWS(){
    if (!socket.value || socket.value.readyState !== WebSocket.CLOSED) {
        socket.value.close();
    }
}

export default buildSocket;