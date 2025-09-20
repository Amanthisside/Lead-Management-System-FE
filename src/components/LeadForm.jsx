import React, { useState } from 'react';

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
    last_activity_at: initialData.last_activity_at || '',
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
    <form onSubmit={handleSubmit}>
      <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
      <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
      <input name="company" value={form.company} onChange={handleChange} placeholder="Company" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
      <input name="state" value={form.state} onChange={handleChange} placeholder="State" />
      <select name="source" value={form.source} onChange={handleChange}>
        <option value="website">Website</option>
        <option value="facebook_ads">Facebook Ads</option>
        <option value="google_ads">Google Ads</option>
        <option value="referral">Referral</option>
        <option value="events">Events</option>
        <option value="other">Other</option>
      </select>
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="lost">Lost</option>
        <option value="won">Won</option>
      </select>
      <input name="score" type="number" min="0" max="100" value={form.score} onChange={handleChange} placeholder="Score" />
      <input name="lead_value" type="number" value={form.lead_value} onChange={handleChange} placeholder="Lead Value" />
      <input name="last_activity_at" type="datetime-local" value={form.last_activity_at} onChange={handleChange} />
      <label>
        Qualified?
        <input name="is_qualified" type="checkbox" checked={form.is_qualified} onChange={handleChange} />
      </label>
      <button type="submit">{submitLabel}</button>
    </form>
  );
};

export default LeadForm;
