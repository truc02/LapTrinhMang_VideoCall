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

async function checkCameraAccess() {
    // Đặt video và audio thành true để yêu cầu truy cập camera và microphone
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    document.getElementById('localVideo').srcObject = localStream;
    return true;
}