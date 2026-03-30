import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { username: form.username, password: form.password });
      alert("Registration Successful!");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" style={{display:'block', width:'100%', marginBottom:10, padding:10}} onChange={e => setForm({...form, username: e.target.value})} required />
        <input placeholder="Password" type="password" style={{display:'block', width:'100%', marginBottom:10, padding:10}} onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit" style={{width:'100%', padding:10, background:'#4f46e5', color:'white'}}>Register</button>
      </form>
      <Link to="/login">Login here</Link>
    </div>
  );
}