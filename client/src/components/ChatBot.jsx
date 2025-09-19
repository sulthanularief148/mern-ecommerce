import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(prev => !prev);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        const botReply = generateBotReply(input);

        setMessages(prev => [...prev, userMessage, botReply]);
        setInput('');
    };

    const generateBotReply = (msg) => {
        let reply = "I'm just a demo bot. You said: " + msg;

        // Optional: add basic reply logic
        if (msg.toLowerCase().includes('hello')) {
            reply = "Hello there! 👋";
        } else if (msg.toLowerCase().includes('help')) {
            reply = "Sure, I'm here to assist you. What do you need help with?";
        }

        return { sender: 'bot', text: reply };
    };

    return (
        <div className="chatbot-container">
            <div className={`chatbot-box ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">
                    <span>ChatBot</span>
                    <button onClick={toggleChat}>✖</button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="chatbot-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>

            <div className="chatbot-toggle" onClick={toggleChat}>
                💬
            </div>
        </div>
    );
};

export default ChatBot;
