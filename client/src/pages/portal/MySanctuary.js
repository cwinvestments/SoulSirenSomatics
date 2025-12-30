import React, { useState, useEffect } from 'react';
import PortalLayout from '../../components/PortalLayout';
import api from '../../api';
import './MySanctuary.css';

function MySanctuary() {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/memberships/my');
      // Handle both direct object and object with membership property
      const membershipData = response.data?.membership || response.data;
      setMembership(membershipData);
    } catch (err) {
      // 404 means no membership, which is okay
      if (err.response?.status === 404) {
        setMembership(null);
      } else {
        console.error('Error fetching membership:', err);
        setError('Failed to load membership data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const joinMembership = async (tier) => {
    try {
      setJoining(true);
      const response = await api.post('/memberships', { tier });
      // Handle both direct object and object with membership property
      const membershipData = response.data?.membership || response.data;
      setMembership(membershipData);
    } catch (err) {
      console.error('Error joining membership:', err);
      alert('Failed to join membership. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  const membershipTiers = [
    {
      id: 'free',
      name: 'Observer',
      price: 'FREE',
      period: '',
      features: ['Community access', 'Monthly group session', 'Resource library preview'],
      color: '#888',
    },
    {
      id: 'seeker',
      name: 'Seeker',
      price: '$27',
      period: '/month',
      features: ['Everything in Observer', 'Weekly live sessions', 'Full resource library', 'Self-care Sunday sessions', 'Fascia tools tutorials'],
      popular: true,
      color: '#d4af7d',
    },
    {
      id: 'siren',
      name: 'Siren',
      price: '$97',
      period: '/month',
      features: ['Everything in Seeker', 'Monthly 1:1 with Timberly', 'Priority booking', 'Personalized guidance', 'Direct message access'],
      color: '#9b7bb8',
    },
  ];

  const upcomingLives = [
    { title: 'Fascia Release: Jaw & Neck', date: 'Thursday, January 30', time: '7:00 PM EST', host: 'Timberly' },
    { title: 'Self-Care Sunday: Grounding', date: 'Sunday, February 2', time: '10:00 AM EST', host: 'Timberly' },
  ];

  const resources = [
    { id: 1, title: 'Hip Fascia Release', category: 'Fascia Tools', duration: '25 min', thumbnail: null },
    { id: 2, title: 'Shoulder Opening Flow', category: 'Fascia Tools', duration: '20 min', thumbnail: null },
    { id: 3, title: 'Somatic Dance: Release', category: 'Somatic Dancing', duration: '15 min', thumbnail: null },
    { id: 4, title: 'Morning Grounding', category: 'Self-Care', duration: '10 min', thumbnail: null },
    { id: 5, title: 'Nervous System Reset', category: 'Fascia Tools', duration: '30 min', thumbnail: null },
    { id: 6, title: 'Evening Wind Down', category: 'Self-Care', duration: '12 min', thumbnail: null },
  ];

  const getTierDisplayName = (tier) => {
    switch (tier) {
      case 'free':
        return 'Observer';
      case 'seeker':
        return 'Seeker';
      case 'siren':
        return 'Siren';
      default:
        return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <PortalLayout>
        <div className="my-sanctuary">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your sanctuary...</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PortalLayout>
        <div className="my-sanctuary">
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchMembership} className="retry-btn">
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  // Non-Member View
  if (!membership) {
    return (
      <PortalLayout>
        <div className="my-sanctuary not-member">
          <div className="locked-header">
            <div className="locked-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h1 style={{ color: '#2a1f35' }}>Join the Soul Siren Sanctuary</h1>
            <p style={{ color: '#6b5b7a' }}>A sacred space for women to heal, feel, and return home to their bodies</p>
          </div>

          <div className="benefits-preview">
            <h2>What You'll Get</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <i className="fas fa-video"></i>
                <h3>Weekly Live Sessions</h3>
                <p>Join Timberly live for fascia work, Q&A, and group healing</p>
              </div>
              <div className="benefit-item">
                <i className="fas fa-users"></i>
                <h3>Community Support</h3>
                <p>Connect with fellow women on the same healing journey</p>
              </div>
              <div className="benefit-item">
                <i className="fas fa-play-circle"></i>
                <h3>Resource Library</h3>
                <p>Access recorded sessions, tutorials, and self-care guides</p>
              </div>
            </div>
          </div>

          <div className="tiers-section">
            <h2>Choose Your Membership</h2>
            <div className="tiers-grid">
              {membershipTiers.map((tier) => (
                <div key={tier.id} className={`tier-card ${tier.popular ? 'popular' : ''}`}>
                  {tier.popular && <span className="popular-badge">Most Popular</span>}
                  <h3 style={{ color: tier.color }}>{tier.name}</h3>
                  <div className="tier-price">
                    <span className="price">{tier.price}</span>
                    <span className="period">{tier.period}</span>
                  </div>
                  <ul className="tier-features">
                    {tier.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => joinMembership(tier.id)}
                    disabled={joining}
                    className={`join-btn ${tier.popular ? 'primary' : 'secondary'}`}
                  >
                    {joining ? (
                      <><i className="fas fa-spinner fa-spin"></i> Joining...</>
                    ) : (
                      tier.price === 'FREE' ? 'Join Free' : 'Join Now'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  // Member View
  return (
    <PortalLayout>
      <div className="my-sanctuary is-member">
        {/* Welcome Header */}
        <div className="sanctuary-header">
          <div className="header-content">
            <h1 style={{ color: '#2a1f35' }}>The Sanctuary</h1>
            <p style={{ color: '#6b5b7a' }}>Welcome to your healing community</p>
          </div>
          <div className={`tier-badge tier-${membership.tier}`}>
            <i className="fas fa-heart"></i>
            {getTierDisplayName(membership.tier)} Member
          </div>
        </div>

        {/* Membership Info */}
        <div className="membership-info-card">
          <div className="membership-details">
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className={`status-badge ${membership.status}`}>
                {membership.status === 'active' ? (
                  <><i className="fas fa-check-circle"></i> Active</>
                ) : membership.status === 'cancelled' ? (
                  <><i className="fas fa-times-circle"></i> Cancelled</>
                ) : (
                  <><i className="fas fa-clock"></i> {membership.status}</>
                )}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">{formatDate(membership.start_date)}</span>
            </div>
            {membership.end_date && (
              <div className="detail-item">
                <span className="detail-label">Renews On</span>
                <span className="detail-value">{formatDate(membership.end_date)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Lives */}
        <section className="upcoming-section">
          <div className="section-header">
            <h2><i className="fas fa-video"></i> Upcoming Lives</h2>
          </div>
          <div className="lives-grid">
            {upcomingLives.map((live, index) => (
              <div key={index} className="live-card">
                <div className="live-info">
                  <h3>{live.title}</h3>
                  <div className="live-meta">
                    <span><i className="fas fa-calendar"></i> {live.date}</span>
                    <span><i className="fas fa-clock"></i> {live.time}</span>
                  </div>
                  <span className="live-host">with {live.host}</span>
                </div>
                <div className="live-actions">
                  <button className="calendar-btn">
                    <i className="fas fa-calendar-plus"></i>
                    Add to Calendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resource Library */}
        <section className="resources-section">
          <div className="section-header">
            <h2><i className="fas fa-play-circle"></i> Resource Library</h2>
            <div className="filter-tabs">
              <button className="filter-tab active">All</button>
              <button className="filter-tab">Fascia Tools</button>
              <button className="filter-tab">Somatic Dancing</button>
              <button className="filter-tab">Self-Care</button>
            </div>
          </div>
          <div className="resources-grid">
            {resources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <div className="resource-thumbnail">
                  <i className="fas fa-play"></i>
                </div>
                <div className="resource-info">
                  <span className="resource-category">{resource.category}</span>
                  <h3>{resource.title}</h3>
                  <span className="resource-duration">
                    <i className="fas fa-clock"></i> {resource.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Section */}
        <section className="community-section">
          <div className="community-card">
            <div className="community-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="community-content">
              <h3>Sanctuary Community</h3>
              <p>Connect with fellow members, share your journey, and find support in our private community space.</p>
              <button className="community-btn">
                <i className="fas fa-comments"></i>
                Join the Conversation
              </button>
            </div>
          </div>
        </section>
      </div>
    </PortalLayout>
  );
}

export default MySanctuary;
