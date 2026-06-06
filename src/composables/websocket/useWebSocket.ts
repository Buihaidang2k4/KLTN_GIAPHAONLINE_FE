import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ref } from 'vue';


const stompClient = new Client({
    webSocketFactory: () => new SockJS('/api/ws'),
    debug: (str) => console.log(str),
    reconnectDelay: 5000
})

const notifications = ref([]);

export function useWebSocket() {
    const connect = () => {
        stompClient.onConnect = () => {
            console.log("Connect Websocket")

            // sub
            stompClient.subscribe('/user/queue/notifications', (message) => {
                const notification = JSON.parse(message.body)
                notifications.value.unshift(notification) 
                console.log("Notification:", notification)
            })
        }

        stompClient.onStompError = (frame) => {
            console.log("Stomp Error: ", frame);
        }

        stompClient.activate();
    }

    const disconnect = () => {
        stompClient.deactivate();
    }

    return { notifications, connect, disconnect };
}