import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <Container>
        {/* Page Title */}
        <header className="about-header text-center">
          <span className="badge-pill">Welcome to MindCare</span>
          <h1 className="about-title">About MindCare</h1>
          <p className="about-subtitle">
            An all-in-one platform to track your well-being, schedule appointments, and build healthy habits.
          </p>
        </header>

        {/* What We Do */}
        <section className="about-section">
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div className="about-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&h=250&q=80"
                  alt="Mental health support session"
                  className="about-image img-fluid"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-content-card">
                <h2>What We Do</h2>
                <p>
                  MindCare connects you with certified mental health professionals and gives you tools to organize your care journey in one clean space.
                </p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Take Care of Your Mind */}
        <section className="about-section">
          <Row className="align-items-center g-4 flex-row-reverse">
            <Col lg={6}>
              <div className="about-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&h=250&q=80"
                  alt="Mindfulness practice"
                  className="about-image img-fluid"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-content-card">
                <h2>Take Care of Your Mind</h2>
                <p>
                  Daily care matters. Prioritize rest, connect with loved ones, and seek guidance when needed.
                </p>
                <div className="info-highlight">
                  Small daily steps lead to lasting resilience.
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* Features */}
        <section className="about-section features-section">
          <div className="text-center mb-4">
            <h2>Features</h2>
          </div>

          <Row className="g-4">
            {/* Profile */}
            <Col md={4}>
              <div className="feature-card h-100">
                <div className="feature-img-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=200&q=80"
                    alt="User Profile"
                  />
                </div>
                <h4>Profile</h4>
                <p>Organize and update your account details seamlessly.</p>
                <ul className="feature-list">
                  <li>Manage details</li>
                  <li>Update preferences</li>
                </ul>
              </div>
            </Col>

            {/* Appointments */}
            <Col md={4}>
              <div className="feature-card h-100">
                <div className="feature-img-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&h=200&q=80"
                    alt="Therapist Appointment"
                  />
                </div>
                <h4>Appointments</h4>
                <p>Book and manage therapy sessions with specialists.</p>
                <ul className="feature-list">
                  <li>Easy booking</li>
                  <li>Track sessions</li>
                </ul>
              </div>
            </Col>

            {/* Well-being */}
            <Col md={4}>
              <div className="feature-card h-100">
                <div className="feature-img-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&h=200&q=80"
                    alt="Wellness Tools"
                  />
                </div>
                <h4>Well-being</h4>
                <p>Access self-care tips and routines to support mental health.</p>
                <ul className="feature-list">
                  <li>Healthy routines</li>
                  <li>Self-care ideas</li>
                </ul>
              </div>
            </Col>
          </Row>
        </section>

        {/* Footer CTA */}
        <section className="about-cta text-center">
          <div className="cta-content">
            <h2>Your Mind Matters</h2>
            <p className="cta-subtext">Start your journey with MindCare today.</p>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default About;