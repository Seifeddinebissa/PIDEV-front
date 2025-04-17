const { Client } = require('@stomp/stompjs');
const SockJS = require('sockjs-client');
const WebSocket = require('ws'); // Ajouter cette ligne pour importer ws

const client = new Client({
    brokerURL: 'http://localhost:8088/dorra/dorra/ws/websocket',
    webSocketFactory: () => new WebSocket(client.brokerURL), // Utiliser ws comme WebSocket
    debug: (str) => {
        console.log(str);
    },
    reconnectDelay: 5000, // Reconnexion automatique après 5 secondes en cas d'échec
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});

client.onConnect = (frame) => {
    console.log('Connecté au WebSocket');
    client.subscribe('/topic/notifications', (message) => {
        console.log('Notification reçue :', message.body);
    });
};

client.onWebSocketError = (error) => {
    console.error('Erreur WebSocket :', error);
};

client.onStompError = (frame) => {
    console.error('Erreur STOMP :', frame.headers['message']);
};

client.activate(); // Démarrer la connexion