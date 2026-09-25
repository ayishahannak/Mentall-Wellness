
import React from "react";
import {
    Container,
    Nav,
    Navbar,
    NavDropdown,
} from "react-bootstrap";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    userLogout,
} from "../redux/userSlice";

import "./Header.css";


const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // =========================
    // GET LOGIN USER
    // =========================

    const {
        user,
        isAuthenticated,
    } = useSelector(
        (state) => state.userState
    );


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        dispatch(userLogout());

        navigate("/login");
    };


    return (

        <Navbar
            expand="lg"
            className="mindcare-navbar"
        >

            <Container>

                {/* =========================
                    LOGO
                ========================= */}

                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="mindcare-logo"
                >
                    MindCare
                </Navbar.Brand>


                {/* =========================
                    MOBILE TOGGLE
                ========================= */}

                <Navbar.Toggle
                    aria-controls="main-navbar"
                />


                <Navbar.Collapse
                    id="main-navbar"
                >

                    <Nav className="ms-auto align-items-lg-center">


                        {/* =========================
                            HOME
                        ========================= */}

                        <Nav.Link
                            as={Link}
                            to="/"
                        >
                            Home
                        </Nav.Link>


                        {/* =========================
                            ABOUT
                        ========================= */}

                        <Nav.Link
                            as={Link}
                            to="/about"
                        >
                            About
                        </Nav.Link>


                        {/* =========================
                            JOURNAL
                        ========================= */}

                        <Nav.Link
                            as={Link}
                            to="/journal"
                        >
                            Journal
                        </Nav.Link>


                        {/* =========================
                            DOCTORS
                        ========================= */}

                        <Nav.Link
                            as={Link}
                            to="/doctors"
                        >
                            Doctors
                        </Nav.Link>


                        {/* =========================
                            RESOURCES
                        ========================= */}

                        {isAuthenticated && (

                            <Nav.Link
                                as={Link}
                                to="/resources"
                            >
                                Resources
                            </Nav.Link>

                        )}


                        {/* =========================
                            LOGIN / PROFILE
                        ========================= */}

                        {isAuthenticated ? (

                            <NavDropdown
                                title={
                                    <span className="profile-circle">
                                        {user?.fullname
                                            ?.charAt(0)
                                            .toUpperCase() || "P"}
                                    </span>
                                }
                                id="profile-dropdown"
                                align="end"
                            >


                                {/* =========================
                                    PROFILE
                                ========================= */}

                                <NavDropdown.Item
                                    as={Link}
                                    to="/profile"
                                >
                                    Profile
                                </NavDropdown.Item>


                                {/* =========================
                                    ADMIN - LIST USERS
                                ========================= */}

                                {user?.role === "Admin" && (

                                    <NavDropdown.Item
                                        as={Link}
                                        to="/user/list-users"
                                    >
                                        List Users
                                    </NavDropdown.Item>

                                )}


                                {/* =========================
                                    ADMIN DASHBOARD
                                ========================= */}

                                {user?.role === "Admin" && (

                                    <NavDropdown.Item
                                        as={Link}
                                        to="/admin/dashboard"
                                    >
                                        Admin Dashboard
                                    </NavDropdown.Item>

                                )}


                                {/* =========================
                                    DOCTOR DASHBOARD
                                ========================= */}

                                {user?.role === "Doctor" && (

                                    <NavDropdown.Item
                                        as={Link}
                                        to="/doctor-dashboard"
                                    >
                                        Doctor Dashboard
                                    </NavDropdown.Item>

                                )}


                                {/* =========================
                                    DOCTOR EDIT PROFILE
                                ========================= */}

                                {user?.role === "Doctor" && (

                                    <NavDropdown.Item
                                        as={Link}
                                        to="/doctor-edit"
                                    >
                                        Edit Doctor Details
                                    </NavDropdown.Item>

                                )}


                                <NavDropdown.Divider />


                                {/* =========================
                                    LOGOUT
                                ========================= */}

                                <NavDropdown.Item
                                    onClick={handleLogout}
                                >
                                    Logout
                                </NavDropdown.Item>

                            </NavDropdown>

                        ) : (

                            /* =========================
                               LOGIN
                            ========================= */

                            <Nav.Link
                                as={Link}
                                to="/login"
                            >
                                Login
                            </Nav.Link>

                        )}

                    </Nav>

                </Navbar.Collapse>

            </Container>

        </Navbar>
    );
};


export default Header;
