import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Return to Your Body</h1>
          <p className="hero-subtitle">
            Somatic healing for women ready to release stored trauma, regulate their nervous system, and feel safe in their own skin.
          </p>
          <Link to="/book" className="btn btn-primary">
            Begin Your Healing Journey
          </Link>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="pillars">
        <div className="container">
          <h2 className="section-title">The Three Pillars</h2>
          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <h3 className="pillar-title">Narcissistic Awareness</h3>
              <p className="pillar-text">
                Learn to spot patterns early, avoid entanglement, and leave safely without losing yourself.
              </p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3 className="pillar-title">Fascia Tools & Healing</h3>
              <p className="pillar-text">
                Trauma lives in the body's connective tissue. We work to unwind stored stress and old pain.
              </p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
                </svg>
              </div>
              <h3 className="pillar-title">Somatic Dancing</h3>
              <p className="pillar-text">
                Rhythmic movement and nervous-system-led release featuring the signature Fascia Bounce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="about-preview">
        <div className="container">
          <div className="about-content">
            <h2 className="section-title">We Heal in a Spiral</h2>
            <p className="about-text">
              At Soul Siren Somatics™, we move it, soothe it, remove it—layer by beautiful fascia layer. And we return you back to your body, back to your power, back to yourself.
            </p>
            <Link to="/about" className="btn btn-secondary">
              About Timberly
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="services-preview">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3 className="service-title">1:1 Support Session</h3>
              <p className="service-price">$150<span>/hour</span></p>
              <p className="service-description">Educational, client-led, supportive</p>
            </div>
            <div className="service-card">
              <h3 className="service-title">Energetic Scan</h3>
              <p className="service-price">$40</p>
              <p className="service-description">Personal insight and awareness</p>
            </div>
          </div>
          <Link to="/services" className="btn btn-primary services-btn">
            View All Services
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <h3 className="footer-brand">Soul Siren Somatics™</h3>
          <p className="footer-tagline">
            A safe space for women to heal and feel their bodies return back to home
          </p>
          <p className="footer-copyright">© 2025 Soul Siren Somatics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
