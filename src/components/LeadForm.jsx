import React, { useState } from 'react';
import '../App.css';

const LeadForm = ({ onSubmit, initialData = {}, submitLabel = 'Save' }) => {
  const [form, setForm] = useState({
    first_name: initialData.first_name || '',
    last_name: initialData.last_name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    city: initialData.city || '',
    state: initialData.state || '',
    source: initialData.source || 'website',
    status: initialData.status || 'new',
    score: initialData.score || 0,
    lead_value: initialData.lead_value || 0,
    last_activity_at: initialData.last_activity_at ? 
      new Date(initialData.last_activity_at).toISOString().slice(0, 16) : '',
    is_qualified: initialData.is_qualified || false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="lead-form">
      <div className="form-grid">
        <label className="form-label">First Name *</label>
        <input 
          name="first_name" 
          value={form.first_name} 
          onChange={handleChange} 
          className="form-control"
          required 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Last Name *</label>
        <input 
          name="last_name" 
          value={form.last_name} 
          onChange={handleChange} 
          className="form-control"
          required 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Email *</label>
        <input 
          name="email" 
          type="email"
          value={form.email} 
          onChange={handleChange} 
          className="form-control"
          required 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Phone</label>
        <input 
          name="phone" 
          value={form.phone} 
          onChange={handleChange} 
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Company</label>
        <input 
          name="company" 
          value={form.company} 
          onChange={handleChange} 
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">City</label>
        <input 
          name="city" 
          value={form.city} 
          onChange={handleChange} 
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">State</label>
        <input 
          name="state" 
          value={form.state} 
          onChange={handleChange} 
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Source</label>
        <select name="source" value={form.source} onChange={handleChange} className="form-control">
          <option value="website">Website</option>
          <option value="facebook_ads">Facebook Ads</option>
          <option value="google_ads">Google Ads</option>
          <option value="referral">Referral</option>
          <option value="events">Events</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label">Status</label>
        <select name="status" value={form.status} onChange={handleChange} className="form-control">
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
          <option value="won">Won</option>
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label">Score (0-100)</label>
        <input 
          name="score" 
          type="number" 
          min="0" 
          max="100" 
          value={form.score} 
          onChange={handleChange} 
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Lead Value ($)</label>
        <input 
          name="lead_value" 
          type="number" 
          value={form.lead_value} 
          onChange={handleChange} 
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Last Activity</label>
        <input 
          name="last_activity_at" 
          type="datetime-local" 
          value={form.last_activity_at} 
          onChange={handleChange} 
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <div className="checkbox-container">
          <input 
            name="is_qualified" 
            type="checkbox" 
            checked={form.is_qualified} 
            onChange={handleChange} 
          />
          <label className="form-label">Qualified Lead</label>
        </div>
      </div>
      
      <div style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
