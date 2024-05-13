import { defineStore } from 'pinia';

const notificationStore = defineStore(
    'notification',
    {
        state: () => ({
            message:[]
        }),
        actions: {
            setMessage(message){
                console.log(message);                
            }
        },
    }
)

export default notificationStore;