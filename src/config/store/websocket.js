import { defineStore } from 'pinia';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import userStore from '@/config/store/user.js';

export const websocketStore = defineStore(
    'websocket',
    {
        state: () => ({
            client: null,
            isConnected: false,
        }),
        actions: {
            connect() {
                if (this.isConnected) {
                    console.log("Already connected");
                    return Promise.resolve();
                }
                const url = 'http://localhost:8081/erp_base/ws'
                const userId = userStore().id;
                const token = localStorage.getItem('token');
                const socket = new SockJS(url + '?userId=' + userId + '&token=' + token);
                const options = { protocols: ['v12.stomp'] }
                this.client = Stomp.over(socket, options);
                return new Promise((resolve, reject) => {
                    this.client.connect({}, () => {
                        this.isConnected = true;
                        console.log('Websocket Connected');
                        resolve(); // Resolve the promise when connected
                    }, error => {
                        this.isConnected = false;
                        console.error('Error connecting: ' + error);
                        reject(error); // Reject the promise if there is an error
                    });
                });
            },
            disconnect() {
                if (this.client) {
                    this.client.disconnect(() => {
                        this.isConnected = false;
                        console.log('WebSocket disconnected');
                    });
                }
            },
            subscribe(topic, callback) {
                if (this.client && this.isConnected) {
                    this.client.subscribe(topic, (message) => {
                        callback(message.body);
                    });
                } else {
                    console.warn('Client is not connected');
                }
            }
        },
    }
)