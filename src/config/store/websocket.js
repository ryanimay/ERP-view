import { defineStore } from 'pinia';
import { Client } from '@stomp/stompjs'

export const websocketStore = defineStore(
    'websocket',
    {
        state: () => ({
            client: null,
            isConnected: false,
        }),
        actions: {
            connect(){
                if(this.isConnected){
                    console.log("Already connected");
                    return;
                }

                this.client = new Client({
                    brokerURL: 'ws://localhost:8081/erp_base/ws',
                    connectHeaders: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    onConnect: () => {
                        this.isConnected = true;
                        console.log('Websocket Connected');
                    },
                    onDisconnect: () => {
                        this.isConnected = false;
                        console.log('Disconnected');
                    },
                    onStompError: (frame) => {
                        console.error('Broker reported error: ' + frame.headers['message']);
                        console.error('Additional details: ' + frame.body);
                    }
                })
            },
            disconnect() {
              if (this.client) {
                this.client.deactivate();
                this.isConnected = false;
                console.log('Manually disconnected');
              }
            },
            subscribe(topic, callback){
                if (this.client && this.isConnected) {
                    this.client.subscribe(topic, (message) => {
                      callback(message.body);
                      console.log();
                    });
                } else {
                    console.warn('Client is not connected');
                }
            }
        },
    }
)