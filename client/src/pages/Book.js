import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Book.css';

function Book() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 'discovery',
      name: 'Discovery Call',
      duration: '15 min',
      price: 'FREE',
      description: 'A complimentary call to explore if we\'re a good fit for your healing journey.',
      icon: 'fa-phone',
      calendlyUrl: 'https://calendly.com/soulsirensomatic/discovery'
    },
    {
      id: 'support',
      name: '1:1 Support Session',
      duration: '60 min',
      price: '$150',
      description: 'Educational, client-led, supportive session tailored to your unique needs.',
      icon: 'fa-user-friends',
      calendlyUrl: 'https://calendly.com/soulsirensomatic/support-session',
      popular: true
    },
    {
      id: 'scan',
      name: 'Energetic Scan',
      duration: '30 min',
      price: '$40',
      description: 'A snapshot of your current physical, nervous system, and energetic state.',
      icon: 'fa-bolt',
      calendlyUrl: 'https://calendly.com/soulsirensomatic/energetic-scan'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    // Scroll to booking section
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="book-page">
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
      <section className="book-hero">
        <div className="hero-bg-animation"></div>
        <div className="hero-content">
          <span className="hero-tag">Book a Session</span>
          <h1 className="hero-title">Begin Your Healing Journey</h1>
          <p className="hero-subtitle">Select a session type below to schedule your appointment</p>
        </div>
      </section>

      {/* Service Selection */}
      <section className="service-selection">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Step 1</span>
            <h2 className="section-title">Choose Your Session</h2>
            <div className="section-line"></div>
          </div>

          <div className="service-cards">
            {services.map((service) => (
              <div
                key={service.id}
                className={`service-card glass-card ${selectedService?.id === service.id ? 'selected' : ''} ${service.popular ? 'popular' : ''}`}
                onClick={() => handleServiceSelect(service)}
              >
                {service.popular && <div className="popular-badge">Most Popular</div>}
                <div className="service-icon">
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <h3>{service.name}</h3>
                <div className="service-meta">
                  <span className="duration">
                    <i className="fas fa-clock"></i>
                    {service.duration}
                  </span>
                  <span className="price">{service.price}</span>
                </div>
                <p>{service.description}</p>
                <button className="btn btn-outline btn-sm">
                  {selectedService?.id === service.id ? 'Selected' : 'Select'}
                  <i className={`fas ${selectedService?.id === service.id ? 'fa-check' : 'fa-arrow-right'}`}></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="booking-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Step 2</span>
            <h2 className="section-title">Schedule Your Time</h2>
            <div className="section-line"></div>
          </div>

          {selectedService ? (
            <div className="booking-container glass-card">
              <div className="booking-header">
                <h3>Booking: {selectedService.name}</h3>
                <p>{selectedService.duration} • {selectedService.price}</p>
              </div>
              <div className="calendly-placeholder">
                <div className="calendly-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <p>Click below to open the scheduling calendar</p>
                <a
                  href={selectedService.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  <span>Open Scheduling Calendar</span>
                  <i className="fas fa-external-link-alt"></i>
                </a>
                <p className="calendly-note">
                  <i className="fas fa-info-circle"></i>
                  You'll be redirected to our secure scheduling platform
                </p>
              </div>
            </div>
          ) : (
            <div className="booking-placeholder glass-card">
              <div className="placeholder-icon">
                <i className="fas fa-hand-pointer"></i>
              </div>
              <h3>Select a Session Above</h3>
              <p>Choose the session type that best fits your needs to see available times.</p>
            </div>
          )}
        </div>
      </section>

      {/* What to Expect */}
      <section className="booking-expect">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Process</span>
            <h2 className="section-title">What Happens Next</h2>
            <div className="section-line"></div>
          </div>

          <div className="process-timeline">
            <div className="timeline-item">
              <div className="timeline-number">1</div>
              <div className="timeline-content glass-card">
                <h3>Book Your Session</h3>
                <p>Select your preferred date and time through our scheduling system.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">2</div>
              <div className="timeline-content glass-card">
                <h3>Confirmation Email</h3>
                <p>You'll receive a confirmation with your Zoom link and any prep details.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">3</div>
              <div className="timeline-content glass-card">
                <h3>Session Day</h3>
                <p>Join via Zoom at your scheduled time. Come as you are—no preparation needed.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">4</div>
              <div className="timeline-content glass-card">
                <h3>Follow-Up Resources</h3>
                <p>After your session, you'll receive personalized resources and support tools.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="policies-section">
        <div className="container">
          <div className="policies-grid">
            <div className="policy-card glass-card">
              <div className="policy-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Cancellation Policy</h3>
              <p>Please provide 24 hours notice for cancellations or rescheduling. Late cancellations may be subject to a fee.</p>
            </div>

            <div className="policy-card glass-card">
              <div className="policy-icon">
                <i className="fas fa-video"></i>
              </div>
              <h3>Virtual Sessions</h3>
              <p>All sessions are conducted via Zoom. You'll receive a link in your confirmation email.</p>
            </div>

            <div className="policy-card glass-card">
              <div className="policy-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3>Payment</h3>
              <p>Payment is collected at the time of booking through our secure payment system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Questions CTA */}
      <section className="questions-cta">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Have Questions Before Booking?</h2>
            <p>Reach out anytime—I'm happy to help you find the right fit.</p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              <span>Contact Me</span>
              <i className="fas fa-envelope"></i>
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

export default Book;
