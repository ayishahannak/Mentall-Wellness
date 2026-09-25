import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="mindcare-footer">
      <Container>
        <Row>
          <Col md={4} className="footer-section">
            <h3>MindCare</h3>
            <p>A simple and supportive platform focused on mental health and personal well-being.</p>
          </Col>

          <Col md={4} className="footer-section">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
           <Link to="/meditation">Meditation</Link>
            <Link to="/doctors">Doctors</Link>
          </Col>

          <Col md={4} className="footer-section">
            <h4>Contact Us</h4>
         <p>Email: support@mindcare.com</p>
        <p>Phone: +91 0765 0000</p>
          <p>Available for your support</p>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p>@ 2026 MindCare. All rights reserved.</p>
          
          <p>Caring for your mind, one step at a time.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;