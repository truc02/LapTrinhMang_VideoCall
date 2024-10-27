const socket = io('/');
let localStream;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    document.getElementById('roomInfo').textContent = `Room ID của bạn: ${roomId}`;

    if (roomId) {
        socket.emit('join-room', roomId);
    }

    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        document.getElementById('localVideo').srcObject = localStream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Không thể truy cập camera hoặc microphone. Vui lòng kiểm tra cài đặt quyền.');
    }

    // Event listeners for controls
    document.getElementById('toggleVideo').addEventListener('click', toggleVideo);
    document.getElementById('toggleAudio').addEventListener('click', toggleAudio);
    document.getElementById('leaveCall').addEventListener('click', leaveCall);
});

// Toggle video stream
function toggleVideo() {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    document.getElementById('toggleVideo').textContent = videoTrack.enabled ? 'Tắt Camera' : 'Bật Camera';
}

// Toggle audio stream
function toggleAudio() {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    document.getElementById('toggleAudio').textContent = audioTrack.enabled ? 'Tắt Mic' : 'Bật Mic';
}

// Leave the call
function leaveCall() {
    localStream.getTracks().forEach(track => track.stop());
    socket.emit('leave-room', roomId);
    window.location.href = 'index.html'; // Redirect to the homepage or another page
}

// Xử lý sự kiện khi người dùng khác tham gia
socket.on('user-joined', (userId) => {
    console.log('Người dùng khác đã tham gia:', userId);
    addRemoteVideo(userId);
});

// Thêm video của người dùng khác
function addRemoteVideo(userId) {
    const videoGrid = document.querySelector('.video-grid');
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    const videoElement = document.createElement('video');
    videoElement.id = `video-${userId}`;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoItem.appendChild(videoElement);
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = `Người dùng ${userId}`;
    videoItem.appendChild(label);
    videoGrid.appendChild(videoItem);
}
