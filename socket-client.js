const socket = io();

socket.on('newMessage', (data) => {
    console.log('Received new message:', data);

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<strong>${data.username}:</strong> ${data.message} <em>(${data.timestamp})</em>`;

    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.prepend(messageDiv);
});

