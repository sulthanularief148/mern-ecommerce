import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! Let’s negotiate the price of this item (₹1000). What’s your offer?' }
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

    const generateBotReply = (message) => {
        const productPrice = 1000;
        const minimumAcceptable = 900;
        const counterThreshold = 700;

        // Extract numeric offer from message
        const priceMatch = message.match(/(?:₹|rs\.?)\s*(\d+)/i) || message.match(/\b(\d{3,5})\b/);
        if (priceMatch) {
            const offeredPrice = parseInt(priceMatch[1]);

            if (offeredPrice >= minimumAcceptable) {
                return { sender: 'bot', text: `✅ Deal accepted at ₹${offeredPrice}! 🎉` };
            } else if (offeredPrice >= counterThreshold) {
                const counterOffer = Math.ceil((offeredPrice + productPrice) / 2);
                return {
                    sender: 'bot',
                    text: `🤔 Hmm... ₹${offeredPrice} is a bit low. Can we agree on ₹${counterOffer}?`
                };
            } else {
                return {
                    sender: 'bot',
                    text: `❌ Sorry, ₹${offeredPrice} is too low to consider. Please make a better offer.`
                };
            }
        }

        // Default reply if no number found
        if (message.toLowerCase().includes("hello")) {
            return { sender: 'bot', text: 'Hi! Please tell me your offer for the item.' };
        }

        return {
            sender: 'bot',
            text: 'Please enter a valid offer amount (e.g., ₹850 or "I can pay 900").'
        };
    };

    return (
        <div className="chatbot-container">
            <div className={`chatbot-box ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">
                    <span>Negotiation Bot</span>
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
                        placeholder="Make your offer..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>

            <div className="chatbot-toggle" onClick={toggleChat}>
                🤖
            </div>
        </div>
    );
};

export default ChatBot;
