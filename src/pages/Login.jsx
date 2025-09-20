import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || process.env.BACKEND_URL || '';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (res.status === 200) {
        navigate('/dashboard');
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Email Address" 
            className="form-input"
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Password" 
            className="form-input"
            required 
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <p style={{marginTop: '20px', color: '#6c757d'}}>
          Don't have an account? <Link to="/register" style={{color: '#667eea', textDecoration: 'none'}}>Sign up</Link>
        </p>
        <div style={{marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontSize: '14px', color: '#6c757d'}}>
          <strong>Test Credentials:</strong><br/>
          Email: testuser@example.com<br/>
          Password: testpassword
        </div>
      </div>
    </div>
  );
};

export default Login;