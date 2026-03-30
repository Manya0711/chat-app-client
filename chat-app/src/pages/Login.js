import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Login() {
  // FIX: Changed 'email' to 'username' to match your Backend & MongoDB
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send the login request
      const { data } = await API.post('/auth/login', form);
      
      // 2. DEBUG: This will show in your browser console (F12) 
      console.log("Server Response Data:", data);

      // 3. SAFETY CHECK: Only call login if we actually got a user object
      if (data && data.user && data.token) {
        login(data.user, data.token);
        navigate('/chat');
      } else {
        setError("Server sent incomplete data. Check Console.");
      }
    } catch (err) {
      console.error("Login Error Details:", err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, textAlign: 'center', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2 style={{ marginBottom: '20px' }}>Login</h2>
      {error && <p style={{ color: 'red', fontSize: '14px', background: '#fee', padding: '10px', borderRadius: '5px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Username" 
          type="text" // Changed from email to text
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })} 
          style={{ display: 'block', width: '100%', marginBottom: 15, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
          required
        />
        <input 
          placeholder="Password" 
          type="password" 
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} 
          style={{ display: 'block', width: '100%', marginBottom: 20, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
          required
        />
        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Login
        </button>
      </form>
      
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        No account? <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
      </p>
    </div>
  );
}