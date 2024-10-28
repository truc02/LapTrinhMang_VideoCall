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

// Kiểm tra quyền truy cập camera
async function checkCameraAccess() {
    // Đặt video và audio thành true để yêu cầu truy cập camera và microphone
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    document.getElementById('localVideo').srcObject = localStream;
    return true;
}


// Tạo phòng mới
function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 10);
    socket.emit('create-room', roomId);
    displayRoomId(roomId);
    waitForOthersToJoin(roomId);
}

// Hiển thị Room ID
function displayRoomId(roomId) {
    document.getElementById('joinContainer').classList.add('hidden');
    document.getElementById('callContainer').classList.remove('hidden');
    document.getElementById('roomInfo').textContent = `Room ID của bạn: ${roomId}`;
}

// Chờ người khác tham gia
function waitForOthersToJoin(roomId) {
    socket.on('user-joined', (userId) => {
        console.log('Người dùng khác đã tham gia:', userId);
        alert(`Người dùng ${userId} đã tham gia phòng ${roomId}`);
    });
}

// Tham gia phòng
function joinRoom() {
    const roomId = roomInput.value.trim();
    if (roomId) {
        socket.emit('join-room', roomId);
        joinRoomById(roomId);
    } else {
        alert('Vui lòng nhập Room ID.');
    }
}

// Tham gia phòng bằng ID
function joinRoomById(roomId) {
    document.getElementById('joinContainer').classList.add('hidden');
    document.getElementById('callContainer').classList.remove('hidden');
    document.getElementById('roomInfo').textContent = `Room ID của bạn: ${roomId}`;
}
