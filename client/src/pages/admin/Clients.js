import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './Clients.css';

function Clients() {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    { id: 1, name: 'Sarah Mitchell', email: 'sarah.m@email.com', phone: '(555) 123-4567', sessions: 8, lastVisit: '2025-01-15' },
    { id: 2, name: 'Jennifer Lopez', email: 'jennifer.l@email.com', phone: '(555) 234-5678', sessions: 3, lastVisit: '2025-01-10' },
    { id: 3, name: 'Amanda King', email: 'amanda.k@email.com', phone: '(555) 345-6789', sessions: 12, lastVisit: '2025-01-20' },
    { id: 4, name: 'Emily Roberts', email: 'emily.r@email.com', phone: '(555) 456-7890', sessions: 5, lastVisit: '2025-01-08' },
    { id: 5, name: 'Lisa Thompson', email: 'lisa.t@email.com', phone: '(555) 567-8901', sessions: 1, lastVisit: '2025-01-22' },
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="clients-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Client Management</h1>
            <p>Manage your client database</p>
          </div>
          <button className="primary-btn">
            <i className="fas fa-plus"></i>
            Add Client
          </button>
        </div>

        {/* Filters and Search */}
        <div className="filters-bar">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-actions">
            <button className="filter-btn">
              <i className="fas fa-filter"></i>
              Filters
            </button>
            <button className="filter-btn">
              <i className="fas fa-download"></i>
              Export
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Sessions</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="client-name">
                      <div className="avatar">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {client.name}
                    </div>
                  </td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>
                    <span className="session-count">{client.sessions}</span>
                  </td>
                  <td>{new Date(client.lastVisit).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title="View">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-btn edit" title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn delete" title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Showing 1-5 of 47 clients</span>
          <div className="pagination-buttons">
            <button className="page-btn" disabled>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Clients;
