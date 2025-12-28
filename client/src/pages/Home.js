import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Less collapse. More containment. My body stays present even when stressors show up.",
      author: "Case Study Participant"
    },
    {
      quote: "Triggers still happen. The difference? My body finds its way back to safety faster.",
      author: "2-Week Study Client"
    },
    {
      quote: "I'm not bracing for impact anymore. My body expects safety now.",
      author: "Healing Journey Member"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
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
            <Link to="/portal" onClick={() => setMobileMenuOpen(false)} className="nav-login">Client Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-animation"></div>
        <div className="floating-elements">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
          <div className="floating-spiral"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">Return to Your Body</h1>
          <p className="hero-subtitle animate-fade-in-delay">
            Somatic healing for women ready to release stored trauma, regulate their nervous system, and feel safe in their own skin.
          </p>
          <div className="hero-buttons animate-fade-in-delay-2">
            <Link to="/book" className="btn btn-primary">
              <span>Begin Your Journey</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
            <Link to="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">2-Week</span>
              <span className="stat-label">Case Study Results</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Virtual Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3 Pillars</span>
              <span className="stat-label">Holistic Approach</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Safe Space</span>
              <span className="stat-label">Women's Collective</span>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="pillars-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Foundation</span>
            <h2 className="section-title">The Three Pillars</h2>
            <div className="section-line"></div>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card glass-card">
              <div className="pillar-icon-wrapper">
                <div className="pillar-icon">
                  <i className="fas fa-eye"></i>
                </div>
              </div>
              <h3>Narcissistic Awareness</h3>
              <p>Learn to spot patterns early, avoid entanglement, and leave safely without losing yourself.</p>
            </div>

            <div className="pillar-card glass-card">
              <div className="pillar-icon-wrapper">
                <div className="pillar-icon">
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
              </div>
              <h3>Fascia Tools & Healing</h3>
              <p>Trauma lives in the body's connective tissue. We work to unwind stored stress and old pain.</p>
            </div>

            <div className="pillar-card glass-card">
              <div className="pillar-icon-wrapper">
                <div className="pillar-icon">
                  <i className="fas fa-spa"></i>
                </div>
              </div>
              <h3>Somatic Dancing</h3>
              <p>Rhythmic movement and nervous-system-led release featuring the signature Fascia Bounce.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title">How It Works</h2>
            <div className="section-line"></div>
          </div>

          <div className="steps-container">
            <div className="steps-line"></div>

            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content glass-card">
                <div className="step-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h3>Book Your Session</h3>
                <p>Choose the service that resonates with your healing journey and schedule a time that works for you.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content glass-card">
                <div className="step-icon">
                  <i className="fas fa-video"></i>
                </div>
                <h3>Meet Virtually or In-Person</h3>
                <p>Connect from the comfort of your home or meet in our healing space. You choose what feels safe.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content glass-card">
                <div className="step-icon">
                  <i className="fas fa-infinity"></i>
                </div>
                <h3>Begin Your Healing Spiral</h3>
                <p>We move it, soothe it, remove it—layer by beautiful fascia layer. Your body leads the way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Our Services</h2>
            <div className="section-line"></div>
          </div>

          <div className="services-grid">
            <div className="service-card glass-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="service-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <h3>1:1 Support Session</h3>
              <div className="service-price">
                <span className="price">$150</span>
                <span className="period">/hour</span>
              </div>
              <ul className="service-features">
                <li><i className="fas fa-check"></i> Educational & supportive approach</li>
                <li><i className="fas fa-check"></i> Client-led session flow</li>
                <li><i className="fas fa-check"></i> Personalized fascia techniques</li>
                <li><i className="fas fa-check"></i> Nervous system regulation</li>
                <li><i className="fas fa-check"></i> Virtual or in-person available</li>
              </ul>
              <Link to="/book" className="btn btn-primary btn-full">
                Book Now
              </Link>
            </div>

            <div className="service-card glass-card">
              <div className="service-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Energetic Scan</h3>
              <div className="service-price">
                <span className="price">$40</span>
              </div>
              <ul className="service-features">
                <li><i className="fas fa-check"></i> Personal insight & awareness</li>
                <li><i className="fas fa-check"></i> Energy body assessment</li>
                <li><i className="fas fa-check"></i> Detailed written report</li>
                <li><i className="fas fa-check"></i> Recommended next steps</li>
                <li><i className="fas fa-check"></i> 100% virtual delivery</li>
              </ul>
              <Link to="/book" className="btn btn-outline btn-full">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Real Results</span>
            <h2 className="section-title">What Clients Are Experiencing</h2>
            <div className="section-line"></div>
          </div>

          <div className="testimonials-carousel">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card glass-card ${index === currentTestimonial ? 'active' : ''}`}
              >
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="testimonial-text">"{testimonial.quote}"</p>
                <div className="testimonial-author">— {testimonial.author}</div>
              </div>
            ))}
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-grid-card glass-card">
                <div className="quote-icon small">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p>"{testimonial.quote}"</p>
                <div className="testimonial-author">— {testimonial.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sanctuary CTA Section */}
      <section className="sanctuary-cta">
        <div className="sanctuary-bg"></div>
        <div className="container">
          <div className="sanctuary-content">
            <h2>Join The Soul Siren Sanctuary</h2>
            <p>A safe space for women to heal, feel, and return home to their bodies.</p>

            <div className="membership-preview">
              <div className="membership-card glass-card">
                <h4>Free</h4>
                <p>Community Access</p>
              </div>
              <div className="membership-card glass-card popular">
                <div className="popular-tag">Popular</div>
                <h4>$27/mo</h4>
                <p>Weekly Lives + Content</p>
              </div>
              <div className="membership-card glass-card">
                <h4>$97/mo</h4>
                <p>Monthly 1:1 + Everything</p>
              </div>
            </div>

            <Link to="/sanctuary" className="btn btn-primary btn-lg">
              <span>Join the Sanctuary</span>
              <i className="fas fa-arrow-right"></i>
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
                <li><Link to="/portal">Client Login</Link></li>
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

export default Home;
