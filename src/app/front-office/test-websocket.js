const Stomp = require('@stomp/stompjs');
const SockJS = require('sockjs-client');

const socket = new SockJS('ws://localhost:8088/dorra/dorra/ws/websocket');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    console.log('Connecté au WebSocket');
    stompClient.subscribe('/topic/notifications', (message) => {
        console.log('Notification reçue :', message.body);
    });
}, (error) => {
    console.error('Erreur de connexion :', error);
});