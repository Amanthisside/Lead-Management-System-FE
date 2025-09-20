import React, { useEffect, useState } from 'react';
import LeadForm from '../components/LeadForm';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || process.env.BACKEND_URL || '';

const Dashboard = () => {
	const [leads, setLeads] = useState([]);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [totalPages, setTotalPages] = useState(1);
	const [filters, setFilters] = useState({});
		const [showForm, setShowForm] = useState(false);
		const [formError, setFormError] = useState('');
		const [editLead, setEditLead] = useState(null);

		useEffect(() => {
			const params = new URLSearchParams({ page, limit, ...filters });
			fetch(`${BACKEND_URL}/api/leads?${params.toString()}`, { credentials: 'include' })
				.then(res => res.json())
				.then(data => {
					setLeads(data.data || []);
					setTotalPages(data.totalPages || 1);
				});
		}, [page, limit, filters, showForm, editLead]);

	const handleFilterChange = (e) => {
		setFilters({ ...filters, [e.target.name]: e.target.value });
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
					setPage(1); // Refresh to first page
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
				} else {
					const data = await res.json();
					setFormError(data.message || 'Error updating lead');
				}
			} catch {
				setFormError('Error updating lead');
			}
		};

		const handleDeleteLead = async (id) => {
			if (!window.confirm('Delete this lead?')) return;
			await fetch(`${BACKEND_URL}/api/leads/${id}`, {
				method: 'DELETE',
				credentials: 'include',
			});
			setPage(1);
		};

	return (
		<div className="dashboard-container">
			<div className="dashboard-header">
				<h2 className="dashboard-title">Leads Dashboard</h2>
				<button 
					className="btn-primary" 
					onClick={() => { setShowForm(!showForm); setEditLead(null); }}
				>
					{showForm ? 'Cancel' : 'Add Lead'}
				</button>
			</div>
			
			{showForm && (
				<div className="form-container">
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
					placeholder="Filter by Email" 
					onChange={handleFilterChange}
					className="filter-input"
				/>
				<input 
					name="company" 
					placeholder="Filter by Company" 
					onChange={handleFilterChange}
					className="filter-input"
				/>
				<input 
					name="city" 
					placeholder="Filter by City" 
					onChange={handleFilterChange}
					className="filter-input"
				/>
			</div>
			
			<div className="table-container">
				<table className="leads-table">
					<thead>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Email</th>
							<th>Phone</th>
							<th>Company</th>
							<th>City</th>
							<th>Status</th>
							<th>Score</th>
							<th>Lead Value</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
									{leads.map(lead => (
										<tr key={lead._id}>
											<td>{lead.first_name}</td>
											<td>{lead.last_name}</td>
											<td>{lead.email}</td>
											<td>{lead.phone}</td>
											<td>{lead.company}</td>
											<td>{lead.city}</td>
											<td>
												<span className={`status-badge status-${lead.status}`}>
													{lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
												</span>
											</td>
											<td>{lead.score}</td>
											<td>${lead.lead_value}</td>
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
			</div>
			
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