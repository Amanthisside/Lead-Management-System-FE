import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || process.env.BACKEND_URL || '';

const Register = () => {
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
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (res.status === 201) {
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login" className="auth-link-highlight">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;