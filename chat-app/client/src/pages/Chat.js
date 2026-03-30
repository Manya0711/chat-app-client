import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// This connects to your Render Backend
const socket = io("https://chat-app-backend-e7xd.onrender.com");

export default function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Listen for messages coming from OTHER users
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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // 1. Send it to the server so others see it
      socket.emit('send_message', msgData);
      
      // 2. Add it to our own screen immediately
      setMessages((prev) => [...prev, msgData]);
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', color: 'white' }}>
      {/* Top Bar */}
      <div style={{ padding: '15px 20px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>💬 Global Chat</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>{user?.username}</span>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Message List */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No messages yet. Start the conversation!</p>}
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.sender === user?.username ? 'flex-end' : 'flex-start',
            background: msg.sender === user?.username ? '#4f46e5' : '#334155',
            padding: '10px 15px', borderRadius: '12px', maxWidth: '70%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '4px' }}>{msg.sender} • {msg.time}</div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} style={{ padding: '20px', background: '#1e293b', display: 'flex', gap: '10px' }}>
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..." 
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '10px 25px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
      </form>
    </div>
  );
}