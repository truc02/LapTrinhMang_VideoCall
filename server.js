const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

// Lưu trữ thông tin về các phòng
const rooms = new Map();

io.on('connection', socket => {
    // Khi người dùng tạo phòng mới
    socket.on('create-room', (roomId) => {
        socket.join(roomId);
        rooms.set(roomId, { users: [socket.id] });
        socket.emit('room-created', roomId);
    });

    // Xử lý ngắt kết nối
    socket.on('disconnect', () => {
        rooms.forEach((value, key) => {
            const index = value.users.indexOf(socket.id);
            if (index > -1) {
                value.users.splice(index, 1);
                if (value.users.length === 0) {
                    rooms.delete(key);
                }
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
