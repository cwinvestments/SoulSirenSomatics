import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

function Contact() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show success message
    // In production, this would integrate with a backend or email service
    setFormStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Clear success message after 5 seconds
    setTimeout(() => setFormStatus(null), 5000);
  };

  return (
    <div className="contact-page">
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
      <section className="contact-hero">
        <div className="hero-bg-animation"></div>
        <div className="hero-content">
          <span className="hero-tag">Get in Touch</span>
          <h1 className="hero-title">Let's Connect</h1>
          <p className="hero-subtitle">Have a question or ready to begin your healing journey? I'd love to hear from you.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className="form-header">
                <h2>Send a Message</h2>
                <p>Fill out the form below and I'll get back to you within 24-48 hours.</p>
              </div>

              {formStatus === 'success' && (
                <div className="form-success glass-card">
                  <i className="fas fa-check-circle"></i>
                  <p>Thank you! Your message has been sent. I'll be in touch soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form glass-card">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="session">1:1 Session Question</option>
                    <option value="scan">Energetic Scan Question</option>
                    <option value="sanctuary">Sanctuary Membership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="How can I help you?"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  <span>Send Message</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="info-card glass-card">
                <div className="info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email</h3>
                <p>For general inquiries and support</p>
                <a href="mailto:hello@soulsirensomatic.com">hello@soulsirensomatic.com</a>
              </div>

              <div className="info-card glass-card">
                <div className="info-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>Response Time</h3>
                <p>I typically respond within</p>
                <span className="highlight">24-48 hours</span>
              </div>

              <div className="info-card glass-card">
                <div className="info-icon">
                  <i className="fas fa-video"></i>
                </div>
                <h3>Sessions</h3>
                <p>All sessions conducted via</p>
                <span className="highlight">Zoom (Virtual)</span>
              </div>

              <div className="social-card glass-card">
                <h3>Connect on Social</h3>
                <p>Follow along for daily inspiration and healing tips</p>
                <div className="social-links">
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <i className="fab fa-tiktok"></i>
                    <span>TikTok</span>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Quick Actions</span>
            <h2 className="section-title">Ready to Get Started?</h2>
            <div className="section-line"></div>
          </div>

          <div className="quick-links-grid">
            <Link to="/book" className="quick-link-card glass-card">
              <div className="quick-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Book a Session</h3>
              <p>Schedule your 1:1 support session or energetic scan</p>
              <span className="link-arrow">
                <i className="fas fa-arrow-right"></i>
              </span>
            </Link>

            <Link to="/sanctuary" className="quick-link-card glass-card">
              <div className="quick-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Join the Sanctuary</h3>
              <p>Become part of our healing community</p>
              <span className="link-arrow">
                <i className="fas fa-arrow-right"></i>
              </span>
            </Link>

            <Link to="/services" className="quick-link-card glass-card">
              <div className="quick-icon">
                <i className="fas fa-spa"></i>
              </div>
              <h3>Explore Services</h3>
              <p>Learn more about what I offer</p>
              <span className="link-arrow">
                <i className="fas fa-arrow-right"></i>
              </span>
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
              <div className="social-links-footer">
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

export default Contact;
