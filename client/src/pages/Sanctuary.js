import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sanctuary.css';

function Sanctuary() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I access the live sessions?",
      answer: "All sessions are held via Zoom. Links are posted in the community ahead of each session."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, cancel anytime with no penalty. Your access continues through the end of your billing period."
    },
    {
      question: "Is this a replacement for therapy?",
      answer: "No. The Sanctuary is educational and supportive, not therapeutic or medical. It complements but does not replace professional care."
    }
  ];

  const testimonials = [
    {
      quote: "The Sanctuary gave me a sisterhood I didn't know I needed. Healing in community is powerful.",
      author: "Sanctuary Member"
    },
    {
      quote: "The weekly lives keep me accountable to my healing. Timberly's guidance is invaluable.",
      author: "Inner Circle Member"
    },
    {
      quote: "I finally found a space where I feel safe to process and heal. This community gets it.",
      author: "Sanctuary Member"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="sanctuary-page">
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
      <section className="sanctuary-hero">
        <div className="hero-bg-animation"></div>
        <div className="hero-decorations">
          <div className="spiral spiral-1"></div>
          <div className="spiral spiral-2"></div>
        </div>
        <div className="hero-content">
          <div className="hero-icon">🐚</div>
          <span className="hero-tag">Membership</span>
          <h1 className="hero-title">The Soul Siren Sanctuary</h1>
          <p className="hero-subtitle">
            A safe space for women to heal, feel, and return home to their bodies
          </p>
        </div>
      </section>

      {/* What is the Sanctuary Section */}
      <section className="about-sanctuary">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Community</span>
            <h2 className="section-title">What is the Sanctuary?</h2>
            <div className="section-line"></div>
          </div>

          <p className="sanctuary-description">
            The Sanctuary is a women's collective for those ready to heal in community.
            Weekly lives, fascia tools demonstrations, somatic dancing sessions, and a supportive sisterhood.
          </p>

          <div className="benefits-grid">
            <div className="benefit-card glass-card">
              <div className="benefit-icon">
                <i className="fas fa-video"></i>
              </div>
              <h3>Weekly Live Sessions</h3>
              <p>Join Timberly for live fascia work, Q&A, and group healing</p>
            </div>

            <div className="benefit-card glass-card">
              <div className="benefit-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community Support</h3>
              <p>Connect with fellow women on the same healing journey</p>
            </div>

            <div className="benefit-card glass-card">
              <div className="benefit-icon">
                <i className="fas fa-play-circle"></i>
              </div>
              <h3>Exclusive Content</h3>
              <p>Access recorded sessions, tutorials, and resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="membership-tiers">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Choose Your Level</span>
            <h2 className="section-title">Membership Tiers</h2>
            <div className="section-line"></div>
          </div>

          <div className="tiers-grid">
            {/* Observer Tier */}
            <div className="tier-card glass-card">
              <div className="tier-header">
                <h3>Observer</h3>
                <div className="tier-price">
                  <span className="price">FREE</span>
                </div>
              </div>
              <ul className="tier-features">
                <li>
                  <i className="fas fa-check"></i>
                  <span>Community access</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Monthly group session</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Resource library preview</span>
                </li>
              </ul>
              <Link to="/book" className="btn btn-outline btn-full">
                Join Free
              </Link>
            </div>

            {/* Member Tier - Featured */}
            <div className="tier-card glass-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="tier-header">
                <h3>Member</h3>
                <div className="tier-price">
                  <span className="price">$27</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="tier-features">
                <li>
                  <i className="fas fa-check"></i>
                  <span>Everything in Observer</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Weekly live sessions</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Full resource library</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Self-care Sunday sessions</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Fascia tools tutorials</span>
                </li>
              </ul>
              <Link to="/book" className="btn btn-primary btn-full">
                Join as Member
              </Link>
            </div>

            {/* Inner Circle Tier */}
            <div className="tier-card glass-card">
              <div className="tier-header">
                <h3>Inner Circle</h3>
                <div className="tier-price">
                  <span className="price">$97</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="tier-features">
                <li>
                  <i className="fas fa-check"></i>
                  <span>Everything in Member</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Monthly 1:1 check-in with Timberly</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Priority booking</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Personalized guidance</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Direct message access</span>
                </li>
              </ul>
              <Link to="/book" className="btn btn-outline btn-full">
                Join Inner Circle
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="sanctuary-testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Real Stories</span>
            <h2 className="section-title">What Sanctuary Members Are Saying</h2>
            <div className="section-line"></div>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card glass-card">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="testimonial-text">"{testimonial.quote}"</p>
                <div className="testimonial-author">— {testimonial.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Questions</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="section-line"></div>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item glass-card ${openFaq === index ? 'open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <i className={`fas ${openFaq === index ? 'fa-minus' : 'fa-plus'}`}></i>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="sanctuary-cta">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Join the Collective?</h2>
            <p>Your healing sisterhood is waiting.</p>
            <a href="#membership-tiers" className="btn btn-primary btn-lg">
              <span>Choose Your Membership</span>
              <i className="fas fa-arrow-up"></i>
            </a>
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

export default Sanctuary;
