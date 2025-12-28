import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

function Services() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="services-page">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            Soul Siren Somatics™
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          <div className={`nav-links ${mobileMenuOpen ? 'nav-links-open' : ''}`}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            <Link to="/sanctuary" onClick={() => setMobileMenuOpen(false)}>Sanctuary</Link>
            <Link to="/book" onClick={() => setMobileMenuOpen(false)}>Book</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-bg-animation"></div>
        <div className="hero-content">
          <span className="hero-tag">Services</span>
          <h1 className="hero-title">Your Healing Options</h1>
          <p className="hero-subtitle">Choose the support that meets you where you are</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <div className="pricing-grid">
            {/* 1:1 Support Session */}
            <div className="pricing-card glass-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <div className="service-icon">
                  <i className="fas fa-user-friends"></i>
                </div>
                <h3>1:1 Support Session</h3>
                <div className="price-tag">
                  <span className="price">$150</span>
                  <span className="period">/hour</span>
                </div>
              </div>
              <p className="service-description">
                Educational, client-led, supportive sessions tailored to your unique healing journey.
              </p>
              <ul className="features-list">
                <li>
                  <i className="fas fa-check"></i>
                  <span>Virtual or in-person available</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Personalized fascia assessment</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Somatic tools & techniques</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Nervous system regulation support</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Follow-up resources provided</span>
                </li>
              </ul>
              <Link to="/book" className="btn btn-primary btn-full">
                <span>Book Your Session</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            {/* Energetic Scan */}
            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <div className="service-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3>Energetic Scan</h3>
                <div className="price-tag">
                  <span className="price">$40</span>
                </div>
              </div>
              <p className="service-description">
                A snapshot of your current state—physical, nervous system, fascia, energetics, and trajectory.
              </p>
              <ul className="features-list">
                <li>
                  <i className="fas fa-check"></i>
                  <span>Full system overview</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Nervous system status</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Immune/detox load assessment</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Personalized support focus</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Written report provided</span>
                </li>
              </ul>
              <Link to="/book" className="btn btn-outline btn-full">
                <span>Book Your Scan</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="expect-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Process</span>
            <h2 className="section-title">What to Expect</h2>
            <div className="section-line"></div>
          </div>

          <div className="expect-grid">
            <div className="expect-card glass-card">
              <div className="expect-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>Before</h3>
              <p>No preparation needed. Come as you are.</p>
            </div>

            <div className="expect-card glass-card">
              <div className="expect-icon">
                <i className="fas fa-video"></i>
              </div>
              <h3>During</h3>
              <p>We meet virtually via Zoom. Sessions are client-led and supportive.</p>
            </div>

            <div className="expect-card glass-card">
              <div className="expect-icon">
                <i className="fas fa-gift"></i>
              </div>
              <h3>After</h3>
              <p>You'll receive resources and tools to continue your healing between sessions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="disclaimer-section">
        <div className="container">
          <div className="disclaimer-card glass-card">
            <div className="disclaimer-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="disclaimer-content">
              <h3>Important Notice</h3>
              <p>
                Soul Siren Somatics™ services are non-medical and non-diagnostic. All sessions
                are for educational purposes only. This work is not a replacement for medical care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Call CTA */}
      <section className="discovery-cta">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Not Sure Where to Start?</h2>
            <p>
              Book a free 15-minute discovery call to find the right fit for your healing journey.
            </p>
            <Link to="/book" className="btn btn-primary btn-lg">
              <span>Schedule Discovery Call</span>
              <i className="fas fa-calendar-alt"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Soul Siren Somatics™</h3>
              <p>A safe space for women to heal and feel their bodies return back to home.</p>
              <div className="social-links">
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <i className="fab fa-tiktok"></i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/book">Book a Session</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Services</h4>
              <ul>
                <li><Link to="/services">1:1 Support Session</Link></li>
                <li><Link to="/services">Energetic Scan</Link></li>
                <li><Link to="/sanctuary">Sanctuary Membership</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Connect</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/sanctuary">Join Sanctuary</Link></li>
                <li><a href="mailto:hello@soulsirensomatic.com">Email Us</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-disclaimer">
              Non-medical, non-diagnostic, educational purposes only. Soul Siren Somatics™ does not provide medical advice, diagnosis, or treatment.
            </p>
            <p className="copyright">© 2025 Soul Siren Somatics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Services;
