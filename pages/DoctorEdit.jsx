
import React, { useState } from "react";

import {
    Button,
    Col,
    Container,
    Form,
    Row,
    Modal,
} from "react-bootstrap";

import * as formik from "formik";
import * as yup from "yup";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate
} from "react-router-dom";

import {
    toast
} from "react-toastify";

import {
    updateDoctorProfile
} from "../src/redux/userSlice";


const DoctorEdit = () => {

    const { Formik } = formik;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const [pendingValues, setPendingValues] = useState(null);


    // =========================
    // GET LOGGED-IN DOCTOR
    // =========================

    const {
        user,
        doctors,
        isAuthenticated
    } = useSelector(
        (state) => state.userState
    );


    // =========================
    // PROTECT PAGE
    // =========================

    if (
        !isAuthenticated ||
        !user ||
        user.role !== "Doctor"
    ) {
        return <NavigateToLogin navigate={navigate} />;
    }


    // =========================
    // FIND LOGGED-IN DOCTOR
    // =========================

    const doctor = doctors.find(
        (d) => d.email === user.email
    );


    // =========================
    // DOCTOR NOT FOUND
    // =========================

    if (!doctor) {

        return (
            <Container className="mt-5">

                <Row className="justify-content-center">

                    <Col md={6}>

                        <h3 className="text-center">
                            Doctor details not found
                        </h3>

                    </Col>

                </Row>

            </Container>
        );
    }


    // =========================
    // VALIDATION
    // =========================

    const schema = yup.object().shape({

        fullname: yup
            .string()
            .required("Enter full name"),

        email: yup
            .string()
            .email("Enter valid email")
            .required("Enter email"),

        qualification: yup
            .string()
            .required("Enter qualification"),

        time: yup
            .string()
            .required("Enter available hours"),

        fee: yup
            .number()
            .typeError("Fee must be a number")
            .positive("Fee must be greater than 0")
            .required("Enter consultation fee"),

    });


    // =========================
    // CLICK UPDATE
    // =========================

    const handleEditDoctor = (values) => {

        // Store values temporarily

        setPendingValues(values);

        // Open confirmation modal

        setShowModal(true);
    };


    // =========================
    // CONFIRM UPDATE
    // =========================

    const confirmUpdate = () => {

        if (!pendingValues) {
            return;
        }


        dispatch(
            updateDoctorProfile({

                id: doctor.id,

                fullname:
                    pendingValues.fullname,

                email:
                    pendingValues.email,

                qualification:
                    pendingValues.qualification,

                time:
                    pendingValues.time,

                fee:
                    `₹${pendingValues.fee}`,

            })
        );


        // Close modal

        setShowModal(false);

        setPendingValues(null);


        // Success message

        toast.success(
            "Doctor details updated successfully"
        );


        // Go to HOME

        navigate("/");
    };


    return (

        <Container className="mt-5 mb-5">

            <Row className="justify-content-center">

                <Col md={5}>

                    {/* =========================
                        TITLE
                    ========================= */}

                    <h2 className="text-center mb-4 text-primary">
                        Edit Doctor Details
                    </h2>


                    <Formik

                        validationSchema={schema}

                        onSubmit={handleEditDoctor}

                        initialValues={{

                            fullname:
                                doctor.fullname || "",

                            email:
                                doctor.email || "",

                            qualification:
                                doctor.qualification || "",

                            time:
                                doctor.time || "",

                            fee:
                                doctor.fee
                                    ?.replace("₹", "") || "",

                        }}

                    >

                        {({

                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            errors,

                        }) => (

                            <Form
                                noValidate
                                onSubmit={handleSubmit}
                            >

                                {/* =========================
                                    NAME
                                ========================= */}

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Doctor Name
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="fullname"
                                        value={values.fullname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                            touched.fullname &&
                                            !!errors.fullname
                                        }
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullname}
                                    </Form.Control.Feedback>

                                </Form.Group>


                                {/* =========================
                                    EMAIL
                                ========================= */}

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Email
                                    </Form.Label>

                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                            touched.email &&
                                            !!errors.email
                                        }
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>

                                </Form.Group>


                                {/* =========================
                                    QUALIFICATION
                                ========================= */}

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Qualification
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="qualification"
                                        value={
                                            values.qualification
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                            touched.qualification &&
                                            !!errors.qualification
                                        }
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.qualification}
                                    </Form.Control.Feedback>

                                </Form.Group>


                                {/* =========================
                                    AVAILABLE TIME
                                ========================= */}

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Available Hours
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="time"
                                        value={values.time}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                            touched.time &&
                                            !!errors.time
                                        }
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.time}
                                    </Form.Control.Feedback>

                                </Form.Group>


                                {/* =========================
                                    FEE
                                ========================= */}

                                <Form.Group className="mb-4">

                                    <Form.Label>
                                        Consultation Fee
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="fee"
                                        value={values.fee}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                            touched.fee &&
                                            !!errors.fee
                                        }
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.fee}
                                    </Form.Control.Feedback>

                                </Form.Group>


                                {/* =========================
                                    UPDATE BUTTON
                                ========================= */}

                                <div className="d-grid">

                                    <Button
                                        type="submit"
                                        variant="success"
                                        size="lg"
                                    >
                                        Update Doctor
                                    </Button>

                                </div>

                            </Form>

                        )}

                    </Formik>


                    {/* =========================
                        CONFIRMATION MODAL
                    ========================= */}

                    <Modal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        centered
                    >

                        <Modal.Header closeButton>

                            <Modal.Title>
                                Confirm Update
                            </Modal.Title>

                        </Modal.Header>


                        <Modal.Body>

                            <div className="text-center">

                                <h5>
                                    Update Doctor Details?
                                </h5>

                                <p className="text-muted mb-0">
                                    Are you sure you want to
                                    save these changes?
                                </p>

                            </div>

                        </Modal.Body>


                        <Modal.Footer>

                            <Button
                                variant="secondary"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                Cancel
                            </Button>


                            <Button
                                variant="success"
                                onClick={confirmUpdate}
                            >
                                Confirm Update
                            </Button>

                        </Modal.Footer>

                    </Modal>

                </Col>

            </Row>

        </Container>
    );
};


// =========================
// LOGIN REDIRECT COMPONENT
// =========================

const NavigateToLogin = ({ navigate }) => {

    React.useEffect(() => {

        navigate("/login");

    }, [navigate]);

    return null;
};


export default DoctorEdit;

