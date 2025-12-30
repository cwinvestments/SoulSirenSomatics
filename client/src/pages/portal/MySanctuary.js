import React from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { usePortalAuth } from '../../context/PortalAuthContext';
import './MySanctuary.css';

function MySanctuary() {
  const { user } = usePortalAuth();
  const isMember = user?.membershipTier;

  const membershipTiers = [
    {
      id: 'observer',
      name: 'Observer',
      price: 'FREE',
      period: '',
      features: ['Community access', 'Monthly group session', 'Resource library preview'],
      color: '#888',
    },
    {
      id: 'member',
      name: 'Member',
      price: '$27',
      period: '/month',
      features: ['Everything in Observer', 'Weekly live sessions', 'Full resource library', 'Self-care Sunday sessions', 'Fascia tools tutorials'],
      popular: true,
      color: '#d4af7d',
    },
    {
      id: 'inner-circle',
      name: 'Inner Circle',
      price: '$97',
      period: '/month',
      features: ['Everything in Member', 'Monthly 1:1 with Timberly', 'Priority booking', 'Personalized guidance', 'Direct message access'],
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

  const getTierName = () => {
    if (!user?.membershipTier) return '';
    if (user.membershipTier === 'inner-circle') return 'Inner Circle';
    return user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1);
  };

  // Non-Member View
  if (!isMember) {
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
                  <Link to="/sanctuary" className={`join-btn ${tier.popular ? 'primary' : 'secondary'}`}>
                    {tier.price === 'FREE' ? 'Join Free' : 'Join Now'}
                  </Link>
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
          <div className={`tier-badge tier-${user.membershipTier}`}>
            <i className="fas fa-heart"></i>
            {getTierName()} Member
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
