"use client"
import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [userName, setUserName] = useState('');
    const [message, setMessage] = useState('');
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // #0: Kết nối WebSocket khi component được mount
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => console.log('Connected to server');
        socket.onmessage = handleServerMessage;
        setWs(socket);

        return () => socket.close();
    }, []);

    const handleServerMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        console.log('Received from server:', data);

        // #1.1: Hiển thị lỗi nếu tên đã tồn tại
        if (data.type === 'error') {
            alert(data.message);
        }

        // #1.2: Kết nối thành công và đóng form nhập tên
        if (data.type === 'success') {
            setIsChatVisible(true);
        }

        // #2 + #5: Hiển thị thông báo từ server khi người dùng mới tham gia
        if (data.type === 'serverMessage') {
            let messageToShow = data.message;
            if (data.name) {
                messageToShow = data.name === userName ? `You ${data.message}` : `${data.name} ${data.message}`;
            }
            setMessages((prev) => [...prev, `<p class="server-message">${messageToShow}</p>`]);
            scrollToBottom();
        }

        // #4: Hiển thị tin nhắn từ các client
        if (data.type === 'chat') {
            const displayName = data.sender === userName ? 'You' : data.sender;
            setMessages((prev) => [...prev, `<p><strong>${displayName}:</strong> ${data.message}</p>`]);
            scrollToBottom();
        }
    };

    const submitName = () => {
        if (ws && userName.trim()) {
            // #1: Gửi tên lên server khi người dùng submit
            ws.send(JSON.stringify({ type: 'setName', name: userName }));
        }
    };

    const sendMessage = () => {
        if (ws && message.trim()) {
            // #3: Gửi nội dung tin nhắn lên server
            ws.send(JSON.stringify({ type: 'chat', text: message }));
            setMessage('');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <style>
                {`
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        height: 100vh;
                        flex-direction: column;
                    }

                        h1 {
                            text-align: center;
                            color: #555;
                        }

                    #nameForm {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        display: block;
                    }

                    #nameForm input {
                        padding: 12px 15px;
                        width: 300px;
                        border: 1px solid #ddd;
                        border-radius: 25px;
                        font-size: 16px;
                        margin-bottom: 10px;
                        transition: all 0.3s ease;
                    }

                    #nameForm input:focus {
                        outline: none;
                        border-color: #007bff;
                        box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
                    }

                    #nameForm button {
                        padding: 12px 20px;
                        background-color: #007bff;
                        border: none;
                        color: white;
                        border-radius: 25px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }

                    #nameForm button:hover {
                        background-color: #0056b3;
                    }

                    #chat {
                        display: flex;
                        flex-direction: column;
                        height: 90vh;
                        width: 80vh;
                        word-wrap: break-word;
                    }

                    #messages {
                        flex-grow: 1;
                        overflow-y: auto;
                        padding: 10px;
                        border: 1px solid #ccc;
                        margin-bottom: 10px;
                        background-color: #fff;
                    }

                    #inputArea {
                        display: flex;
                        padding: 10px;
                        background-color: #fff;
                    }

                    #message {
                        flex-grow: 1;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        margin-right: 10px;
                    }

                    #sendButton {
                        padding: 10px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        cursor: pointer;
                        border-radius: 5px;
                    }

                    #sendButton:hover {
                        background-color: #0056b3;
                    }

                    .server-message {
                        text-align: center;
                        color: #888;
                        font-style: italic;
                    }
                `}
            </style>
            <h1>GROUP CODER</h1>
            <div>
                {!isChatVisible ? (
                    <div id="nameForm">
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && submitName()}
                        />
                        <button onClick={submitName}>Submit</button>
                    </div>
                ) : (
                    <div id="chat">
                        <div id="messages" dangerouslySetInnerHTML={{ __html: messages.join('') }} />
                        <div ref={messagesEndRef}></div>
                        <div id="inputArea">
                            <input
                                id="message"
                                type="text"
                                placeholder="Type a message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button id="sendButton" onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
