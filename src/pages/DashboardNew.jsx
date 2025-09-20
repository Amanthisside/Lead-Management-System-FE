import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import '../App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || process.env.BACKEND_URL || '';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [editLead, setEditLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, [page, limit, filters, showForm, editLead]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit, ...filters });
      const res = await fetch(`${BACKEND_URL}/api/leads?${params.toString()}`, { credentials: 'include' });
      if (res.status === 401) {
        navigate('/login');
        return;
      }
      const data = await res.json();
      setLeads(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (value.trim() === '') {
      const newFilters = { ...filters };
      delete newFilters[name];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [name]: value });
    }
    setPage(1);
  };

  const handleCreateLead = async (form) => {
    setFormError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      if (res.status === 201) {
        setShowForm(false);
        setPage(1);
      } else {
        const data = await res.json();
        setFormError(data.message || 'Error creating lead');
      }
    } catch {
      setFormError('Error creating lead');
    }
  };

  const handleEditLead = (lead) => {
    setEditLead(lead);
    setShowForm(true);
  };

  const handleUpdateLead = async (form) => {
    setFormError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/leads/${editLead._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      if (res.status === 200) {
        setShowForm(false);
        setEditLead(null);
        fetchLeads();
      } else {
        const data = await res.json();
        setFormError(data.message || 'Error updating lead');
      }
    } catch {
      setFormError('Error updating lead');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await fetch(`${BACKEND_URL}/api/leads/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Lead Management System</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-primary" 
            onClick={() => { setShowForm(!showForm); setEditLead(null); }}
          >
            {showForm ? 'Cancel' : '+ Add Lead'}
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-modal">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            {editLead ? 'Edit Lead' : 'Add New Lead'}
          </h3>
          <LeadForm
            onSubmit={editLead ? handleUpdateLead : handleCreateLead}
            initialData={editLead || {}}
            submitLabel={editLead ? 'Update Lead' : 'Create Lead'}
          />
          {formError && <div className="error-message">{formError}</div>}
        </div>
      )}

      <div className="filters-container">
        <input 
          name="email" 
          placeholder="Search by email..." 
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input 
          name="company" 
          placeholder="Search by company..." 
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input 
          name="city" 
          placeholder="Search by city..." 
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select 
          name="status" 
          onChange={handleFilterChange}
          className="filter-input"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
          <option value="won">Won</option>
        </select>
        <select 
          name="source" 
          onChange={handleFilterChange}
          className="filter-input"
        >
          <option value="">All Sources</option>
          <option value="website">Website</option>
          <option value="facebook_ads">Facebook Ads</option>
          <option value="google_ads">Google Ads</option>
          <option value="referral">Referral</option>
          <option value="events">Events</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px', color: '#6c757d', fontWeight: '500' }}>
        Showing {leads.length} of {total} leads
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          Loading leads...
        </div>
      ) : (
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>City</th>
              <th>Status</th>
              <th>Score</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead._id}>
                <td>{lead.first_name} {lead.last_name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>{lead.company}</td>
                <td>{lead.city}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: lead.status === 'won' ? '#d4edda' : 
                               lead.status === 'lost' ? '#f8d7da' :
                               lead.status === 'qualified' ? '#d1ecf1' :
                               lead.status === 'contacted' ? '#fff3cd' : '#e2e3e5',
                    color: lead.status === 'won' ? '#155724' : 
                           lead.status === 'lost' ? '#721c24' :
                           lead.status === 'qualified' ? '#0c5460' :
                           lead.status === 'contacted' ? '#856404' : '#6c757d'
                  }}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td>{lead.score}/100</td>
                <td>${lead.lead_value?.toLocaleString() || 0}</td>
                <td>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEditLead(lead)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDeleteLead(lead._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination-container">
        <button 
          className="pagination-btn" 
          disabled={page <= 1} 
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {page} of {totalPages}
        </span>
        <button 
          className="pagination-btn" 
          disabled={page >= totalPages} 
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
