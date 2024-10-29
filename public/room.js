const socket = io('/');
let localStream;

// Xử lý khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    const createRoomButton = document.getElementById('createRoom');
    const joinRoomButton = document.getElementById('joinRoom');
    const roomInput = document.getElementById('roomInput');

    createRoomButton.addEventListener('click', async () => {
        checkCameraAccess();
        createRoom();
    });

    joinRoomButton.addEventListener('click', async () => {
        checkCameraAccess();
       joinRoom();
    });
});