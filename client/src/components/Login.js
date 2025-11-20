import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);

  const base = 'http://localhost:5000/api';

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post(`${base}/register`, { name, email, password });
        setMsg({ type: 'success', text: 'Registered. You can now login.' });
        setIsRegister(false);
      } else {
        const res = await axios.post(`${base}/login`, { email, password });
        const { user } = res.data;
        onLogin(user);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error' });
    }
  };

  return (
    <form onSubmit={submit}>
      {isRegister && <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />}
      <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button className="btn" type="submit">{isRegister ? 'Register' : 'Login'}</button>
      <div style={{marginTop:8,display:'flex',gap:8}}>
        <button type="button" className="btn" style={{background:'#e6e9ef',color:'#111'}} onClick={()=>setIsRegister(!isRegister)}>
          {isRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
      {msg && <div className={msg.type === 'error' ? 'error' : 'success'}>{msg.text}</div>}
    </form>
  );
}
