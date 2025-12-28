import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import './Content.css';

function Content() {
  const contentSections = [
    {
      id: 'homepage',
      title: 'Homepage Content',
      description: 'Edit hero text, taglines, and featured sections',
      icon: 'fa-home',
      items: ['Hero Title & Subtitle', 'Stats Bar', 'Three Pillars Section', 'How It Works']
    },
    {
      id: 'services',
      title: 'Service Descriptions',
      description: 'Update service offerings and pricing',
      icon: 'fa-spa',
      items: ['1:1 Support Session', 'Energetic Scan', 'Discovery Call', 'Service Pricing']
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Manage client testimonials and reviews',
      icon: 'fa-quote-right',
      count: 6
    },
    {
      id: 'faq',
      title: 'FAQ Management',
      description: 'Add, edit, or remove frequently asked questions',
      icon: 'fa-question-circle',
      count: 8
    },
    {
      id: 'about',
      title: 'About Page',
      description: 'Update your story and credentials',
      icon: 'fa-user',
      items: ['Bio & Story', 'Credentials', 'Philosophy', 'Photos']
    },
    {
      id: 'sanctuary',
      title: 'Sanctuary Content',
      description: 'Edit membership tiers and benefits',
      icon: 'fa-users',
      items: ['Tier Descriptions', 'Benefits List', 'Pricing', 'Member Testimonials']
    }
  ];

  return (
    <AdminLayout>
      <div className="content-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Content Management</h1>
            <p>Update your website content and copy</p>
          </div>
        </div>

        {/* Content Sections Grid */}
        <div className="content-grid">
          {contentSections.map((section) => (
            <div key={section.id} className="content-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className={`fas ${section.icon}`}></i>
                </div>
                <div className="card-title">
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>
              </div>

              <div className="card-body">
                {section.items ? (
                  <ul className="content-items">
                    {section.items.map((item, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="content-count">
                    <span className="count">{section.count}</span>
                    <span className="label">items</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button className="edit-btn">
                  <i className="fas fa-edit"></i>
                  Edit Content
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="content-stats">
          <div className="stat-item">
            <i className="fas fa-file-alt"></i>
            <div className="stat-info">
              <span className="stat-value">6</span>
              <span className="stat-label">Pages</span>
            </div>
          </div>
          <div className="stat-item">
            <i className="fas fa-quote-right"></i>
            <div className="stat-info">
              <span className="stat-value">6</span>
              <span className="stat-label">Testimonials</span>
            </div>
          </div>
          <div className="stat-item">
            <i className="fas fa-question-circle"></i>
            <div className="stat-info">
              <span className="stat-value">8</span>
              <span className="stat-label">FAQs</span>
            </div>
          </div>
          <div className="stat-item">
            <i className="fas fa-images"></i>
            <div className="stat-info">
              <span className="stat-value">12</span>
              <span className="stat-label">Media Files</span>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="coming-soon-card">
          <div className="coming-soon-content">
            <i className="fas fa-magic"></i>
            <div>
              <h3>Full CMS Coming Soon</h3>
              <p>A complete content management system with drag-and-drop editing, image uploads, and more is on the way.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Content;
