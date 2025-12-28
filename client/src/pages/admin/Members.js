import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './Members.css';

function Members() {
  const [activeFilter, setActiveFilter] = useState('all');

  const members = [
    { id: 1, name: 'Emily Roberts', email: 'emily.r@email.com', tier: 'inner-circle', joined: '2024-09-15', status: 'active' },
    { id: 2, name: 'Sarah Mitchell', email: 'sarah.m@email.com', tier: 'member', joined: '2024-10-20', status: 'active' },
    { id: 3, name: 'Jennifer Lopez', email: 'jennifer.l@email.com', tier: 'member', joined: '2024-11-05', status: 'active' },
    { id: 4, name: 'Amanda King', email: 'amanda.k@email.com', tier: 'observer', joined: '2024-12-01', status: 'active' },
    { id: 5, name: 'Lisa Thompson', email: 'lisa.t@email.com', tier: 'member', joined: '2024-08-10', status: 'paused' },
    { id: 6, name: 'Rachel Green', email: 'rachel.g@email.com', tier: 'observer', joined: '2024-07-22', status: 'cancelled' },
  ];

  const filters = [
    { key: 'all', label: 'All Members' },
    { key: 'observer', label: 'Observer' },
    { key: 'member', label: 'Member' },
    { key: 'inner-circle', label: 'Inner Circle' },
  ];

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'observer': return { label: 'Observer', class: 'tier-observer' };
      case 'member': return { label: 'Member', class: 'tier-member' };
      case 'inner-circle': return { label: 'Inner Circle', class: 'tier-inner' };
      default: return { label: tier, class: '' };
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const filteredMembers = members.filter(member => {
    if (activeFilter === 'all') return true;
    return member.tier === activeFilter;
  });

  return (
    <AdminLayout>
      <div className="members-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Sanctuary Members</h1>
            <p>Manage your community membership</p>
          </div>
          <button className="primary-btn">
            <i className="fas fa-plus"></i>
            Add Member
          </button>
        </div>

        {/* Stats Overview */}
        <div className="tier-stats">
          <div className="tier-stat">
            <div className="tier-icon observer">
              <i className="fas fa-eye"></i>
            </div>
            <div className="tier-info">
              <span className="tier-count">12</span>
              <span className="tier-label">Observers</span>
            </div>
          </div>
          <div className="tier-stat">
            <div className="tier-icon member">
              <i className="fas fa-user"></i>
            </div>
            <div className="tier-info">
              <span className="tier-count">8</span>
              <span className="tier-label">Members</span>
            </div>
          </div>
          <div className="tier-stat">
            <div className="tier-icon inner">
              <i className="fas fa-star"></i>
            </div>
            <div className="tier-info">
              <span className="tier-count">3</span>
              <span className="tier-label">Inner Circle</span>
            </div>
          </div>
          <div className="tier-stat revenue">
            <div className="tier-icon revenue-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="tier-info">
              <span className="tier-count">$507</span>
              <span className="tier-label">Monthly Recurring</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Members Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const tierBadge = getTierBadge(member.tier);
                return (
                  <tr key={member.id}>
                    <td>
                      <div className="member-name">
                        <div className="avatar">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {member.name}
                      </div>
                    </td>
                    <td>{member.email}</td>
                    <td>
                      <span className={`tier-badge ${tierBadge.class}`}>
                        {tierBadge.label}
                      </span>
                    </td>
                    <td>{new Date(member.joined).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(member.status)}`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" title="View">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn edit" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn email" title="Email">
                          <i className="fas fa-envelope"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Members;
