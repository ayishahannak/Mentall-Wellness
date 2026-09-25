import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Resources.css";

const Resources = () => {
  return (
    <div className="resources-page">
      <Container>
        <div className="resources-header">
          <span>MENTAL HEALTH</span>
          <h1>Mental Health Resources</h1>
          <p>Helpful information and simple tips to support your mental health and everyday well-being.</p>
        </div>

        <Row>
          <Col md={6} lg={4}>
            <div className="resource-card">
              <h3>Stress Management</h3>
           <p>Learn simple ways to manage everyday stress and create a more relaxed routine.</p>
          <a href="#">Learn More</a>
            </div>
          </Col>

          <Col md={6} lg={4}>
            <div className="resource-card">
        <h3>Better Sleep</h3>
     <p>Discover healthy sleep habits that can help you build a better and more consistent sleep routine.</p>
      <a href="#sleep">Learn More</a>
            </div>
          </Col>

          <Col md={6} lg={4}>
            <div className="resource-card">
        <h3>Self Care</h3>
         <p>Taking care of yourself is important. Explore simple self-care habits for everyday life.</p>
        <a href="#selfcare">Learn More</a>
            </div>
          </Col>

          <Col md={6} lg={4}>
            <div className="resource-card">
              <h3>Anxiety Management</h3>
        <p>Learn about simple grounding and relaxation techniques that may help during stressful moments.</p>
            <a href="#">Learn More</a>
            </div>
          </Col>

          <Col md={6} lg={4}>
            <div className="resource-card">
         <h3>Healthy Lifestyle</h3>
         <p>Regular movement, healthy habits and a good routine can support your overall well-being.</p>
          <a href="#">Learn More</a>
            </div>
          </Col>

          <Col md={6} lg={4}>
            <div className="resource-card">
            <h3>Getting Support</h3>
           <p>Talking with trusted people or a qualified professional can be an important step when you need support.</p>
              <a href="#">Learn More</a>
            </div>
          </Col>
        </Row>

        <div className="resources-message">
     <h2>Take Care of Your Mental Health</h2>
     <p>Small positive changes can make a difference. Take time for yourself and remember that asking for help is okay.</p>
        </div>
      </Container>
    </div>
  );
};

export default Resources;