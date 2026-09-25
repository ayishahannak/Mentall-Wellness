import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { removeAppointment } from "../redux/userSlice";
import "./Home.css";

const quotes = [
    {
        text: "You don't have to control your thoughts. You just have to stop letting them control you.",
        author: "Dan Millman"
    },
    {
        text: "It's okay to not be okay, as long as you're not giving up.",
        author: "Karen Salmansohn"
    },
    {
        text: "Self-care is how you take your power back.",
        author: "Lalah Delia"
    }
];

const Home = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, appointments } = useSelector((state) => state.userState);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Find appointments belonging to this patient that the doctor cancelled
    const cancelledAppointments = [];
    if (isAuthenticated && user) {
        for (let i = 0; i < (appointments || []).length; i++) {
            const appointment = appointments[i];
            if (appointment.userId === user.id && appointment.status === "Cancelled") {
                cancelledAppointments.push(appointment);
            }
        }
    }

    useEffect(() => {
        if (cancelledAppointments.length > 0) {
            setShowCancelModal(true);
        }
    }, [cancelledAppointments.length]);

    const handleCloseModal = () => {
        for (let i = 0; i < cancelledAppointments.length; i++) {
            dispatch(removeAppointment(cancelledAppointments[i].id));
        }
        setShowCancelModal(false);
    };

    return (
        <div className="home-page">
            <Modal show={showCancelModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Appointment Cancelled</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {cancelledAppointments.map((appointment) => (
                        <p key={appointment.id}>
                            Your appointment with <strong>{appointment.doctorName}</strong> was cancelled by the doctor.
                        </p>
                    ))}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            <section className="hero" style={{backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <div className="hero-content">
                    <h1>Your Mental Health Matters</h1>
                    <p>Take a step towards better mental well-being with the right support.</p>
                </div>
            </section>

            <section className="quotes-row">
                {quotes.map((quote, index) => (
                    <div key={index} className="quote-card">
                        <p className="quote-text">"{quote.text}"</p>
                        <span className="quote-author">— {quote.author}</span>
                    </div>
                ))}
            </section>

            <section className="meditation-row">
                <Link to="/meditation" className="feature-row">
                    <div className="feature-row-text">
                        <span className="feature-label">RELAX & RESET</span>
                        <h2>Take a Mindful Break</h2>
                        <p>A few quiet minutes can reset your whole day. Try a short guided session and see how it feels.</p>
                        <span className="feature-link">Start Meditating →</span>
                    </div>

                    <div className="feature-row-image">
                        <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200" alt="Meditation" />
                    </div>
                </Link>
            </section>

            <section className="journal-row">
                <Link to="/journal" className="feature-row reverse">
                    <div className="feature-row-image">
                       <img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80" alt="Journal writing" />
                    </div>

                    <div className="feature-row-text">
                        <span className="feature-label">REFLECT & WRITE</span>
                        <h2>Put Your Thoughts on Paper</h2>
                        <p>Journaling helps you process your day and understand your emotions better. Start writing whenever you need to.</p>
                        <span className="feature-link">Open Your Journal →</span>
                    </div>
                </Link>
            </section>

            <section className="doctor-row">
                <Link to="/doctors" className="feature-row">
                    <div className="feature-row-text">
                        <span className="feature-label">PROFESSIONAL SUPPORT</span>
                        <h2>Talk to a Psychologist</h2>
                        <p>Connect with qualified mental health professionals and find the right support for you.</p>
                        <span className="feature-link">Find a Psychologist →</span>
                    </div>

                    <div className="feature-row-image">
                        <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200" alt="Psychologist" />
                    </div>
                </Link>
            </section>

            <section className="mood-row">
                <Link to="/mood-tracker" className="feature-row mood-feature">
                    <div className="feature-row-text">
                        <span className="feature-label mood-label">CHECK IN WITH YOURSELF</span>
                        <h2>How Are You Feeling Today?</h2>
                        <p>Take a moment to check in with yourself. Choose your mood and keep track of how you're feeling over time.</p>
                        <span className="feature-link mood-link">Track Your Mood →</span>
                    </div>

                    <div className="mood-visual">
                        <div className="mood-visual-content">
                            <div className="mood-big-emoji">😊</div>

                            <div className="mood-emoji-row">
                                <span>😊</span>
                                <span>🙂</span>
                                <span>😐</span>
                                <span>😔</span>
                                <span>😟</span>
                            </div>

                            <p>Every feeling matters</p>
                        </div>
                    </div>
                </Link>
            </section>
        </div>
    );
};

export default Home;