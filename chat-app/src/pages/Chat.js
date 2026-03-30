import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Connect to your Render backend URL
const socket = io("https://chat-app-backend-e7xd.onrender.com");

export default function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Listen for incoming messages from the server
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const msgData = {
        text: message,
        sender: user.username,
        time: new Date().toLocaleTimeString(),
      };

      // Send message to the server
      socket.emit('send_message', msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage('');
    }
  };

  if (!user) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Redirecting...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1a1a2e', color: 'white', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '20px', background: '#16213e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Logged in as: {user.username}</h3>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px' }}>Logout</button>
      </div>

      {/* Message Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.sender === user.username ? 'flex-end' : 'flex-start',
            background: msg.sender === user.username ? '#4f46e5' : '#252541',
            padding: '10px 15px', borderRadius: '10px', maxWidth: '70%'
          }}>
            <small style={{ opacity: 0.7 }}>{msg.sender}</small>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} style={{ padding: '20px', background: '#16213e', display: 'flex', gap: '10px' }}>
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..." 
          style={{ flex: 1, padding: '12px', borderRadius: '5px', border: 'none' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px' }}>Send</button>
      </form>
    </div>
  );
}