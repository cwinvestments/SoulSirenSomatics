import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
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
    <div className="about-page">
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
      <section className="about-hero">
        <div className="hero-bg-animation"></div>
        <div className="hero-content">
          <span className="hero-tag">About</span>
          <h1 className="hero-title">Meet Timberly</h1>
          <p className="hero-subtitle">Turning Pain into Purpose</p>
        </div>
      </section>

      {/* Her Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Journey</span>
            <h2 className="section-title">Her Story</h2>
            <div className="section-line"></div>
          </div>

          <div className="story-grid">
            <div className="story-card glass-card">
              <div className="story-number">01</div>
              <h3>The Wake-Up Call</h3>
              <p>
                I started the year with a second mold exposure. Severe neurological symptoms.
                Panic and anxiety. I did not let it take me down.
              </p>
            </div>

            <div className="story-card glass-card">
              <div className="story-number">02</div>
              <h3>The Transformation</h3>
              <p>
                I used all the tools in my toolbox. And then built a business from it.
                I turned my pain into purpose.
              </p>
            </div>

            <div className="story-card glass-card">
              <div className="story-number">03</div>
              <h3>The Mission</h3>
              <p>
                I am building from a heart-centered place. With integrity and love.
                I am on a mission to help heal a dysregulated women's collective.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Detailed Section */}
      <section className="pillars-detailed">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Foundation</span>
            <h2 className="section-title">The Three Pillars</h2>
            <div className="section-line"></div>
          </div>

          <div className="pillars-list">
            <div className="pillar-detailed glass-card">
              <div className="pillar-icon-large">
                <i className="fas fa-eye"></i>
              </div>
              <div className="pillar-content">
                <h3>Narcissistic Awareness</h3>
                <p>
                  Learning how to spot narcissistic patterns early, avoid entanglement, and—if
                  you're already in it—how to leave safely, strategically, and without losing yourself.
                </p>
              </div>
            </div>

            <div className="pillar-detailed glass-card">
              <div className="pillar-icon-large">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <div className="pillar-content">
                <h3>Fascia Tools & Healing</h3>
                <p>
                  Because trauma doesn't just live in the mind—it lives in the fascia. We work with
                  the body's connective tissue to unwind stored stress, survival patterns, and old pain.
                </p>
              </div>
            </div>

            <div className="pillar-detailed glass-card">
              <div className="pillar-icon-large">
                <i className="fas fa-spa"></i>
              </div>
              <div className="pillar-content">
                <h3>Somatic Dancing</h3>
                <p>
                  Tribal beats. Rhythmic movement. Nervous-system-led release. Featuring the signature
                  Fascia Bounce—a simple but powerful way to restore flow, safety, and embodiment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Approach</span>
            <h2 className="section-title">We Heal in a Spiral</h2>
            <div className="section-line"></div>
          </div>

          <div className="philosophy-quote glass-card">
            <div className="quote-icon">
              <i className="fas fa-quote-left"></i>
            </div>
            <blockquote>
              At Soul Siren Somatics™, we heal in a spiral. Layer by beautiful fascia layer.
              We move it. We soothe it. We remove it. And we return you—back to your body,
              back to your power, back to yourself.
            </blockquote>
          </div>

          <div className="principles-grid">
            <div className="principle-card glass-card">
              <div className="principle-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4>Regulation before Detox</h4>
            </div>

            <div className="principle-card glass-card">
              <div className="principle-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h4>Safety before Clearing</h4>
            </div>

            <div className="principle-card glass-card">
              <div className="principle-icon">
                <i className="fas fa-hands"></i>
              </div>
              <h4>Containment before Expansion</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="credentials-section">
        <div className="container">
          <div className="disclaimer-card glass-card">
            <div className="disclaimer-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <div className="disclaimer-content">
              <h3>Important Notice</h3>
              <p className="disclaimer-text">
                Non-medical. Non-diagnostic. For educational purposes only.
              </p>
            </div>
          </div>

          <div className="approach-badges">
            <div className="badge glass-card">
              <i className="fas fa-book-open"></i>
              <span>Educational</span>
            </div>
            <div className="badge glass-card">
              <i className="fas fa-user"></i>
              <span>Client-led</span>
            </div>
            <div className="badge glass-card">
              <i className="fas fa-hands-helping"></i>
              <span>Supportive</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Begin Your Healing Journey?</h2>
            <p>Your body is waiting to come home.</p>
            <div className="cta-buttons">
              <Link to="/book" className="btn btn-primary">
                <span>Book a Session</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
              <Link to="/sanctuary" className="btn btn-outline">
                Join the Sanctuary
              </Link>
            </div>
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
            <p className="disclaimer">
              Non-medical, non-diagnostic, educational purposes only. Soul Siren Somatics™ does not provide medical advice, diagnosis, or treatment.
            </p>
            <p className="copyright">© 2025 Soul Siren Somatics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
