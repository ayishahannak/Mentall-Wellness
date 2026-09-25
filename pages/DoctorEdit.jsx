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
    // AVAILABLE DAYS
    // =========================

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];


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
        (d) =>
            d.id === user.id ||
            d.email?.toLowerCase() ===
                user.email?.toLowerCase()
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

        timePeriod1: yup
            .string()
            .required("Enter Time Period 1"),

        timePeriod2: yup
            .string()
            .required("Enter Time Period 2"),

        fee: yup
            .number()
            .typeError("Fee must be a number")
            .positive("Fee must be greater than 0")
            .required("Enter consultation fee"),

        availableDays: yup
            .array()
            .min(1, "Select at least one available day"),

        maxAppointmentsPerDay: yup
            .number()
            .typeError("Maximum patients must be a number")
            .integer("Enter a whole number")
            .min(1, "Maximum patients must be at least 1")
            .required("Enter maximum patients per day"),

    });


    // =========================
    // CLICK UPDATE
    // =========================

    const handleEditDoctor = (values) => {

        setPendingValues(values);

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

                // =========================
                // TWO TIME PERIODS
                // =========================

                timePeriod1:
                    pendingValues.timePeriod1,

                timePeriod2:
                    pendingValues.timePeriod2,

                // Keep combined time also
                time:
                    `${pendingValues.timePeriod1} | ${pendingValues.timePeriod2}`,

                fee:
                    `₹${pendingValues.fee}`,

                availableDays:
                    pendingValues.availableDays,

                maxAppointmentsPerDay:
                    Number(
                        pendingValues.maxAppointmentsPerDay
                    ),

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

                <Col md={7}>

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


                            // =========================
                            // TIME PERIOD 1
                            // =========================

                            timePeriod1:
                                doctor.timePeriod1 || "",


                            // =========================
                            // TIME PERIOD 2
                            // =========================

                            timePeriod2:
                                doctor.timePeriod2 || "",


                            fee:
                                doctor.fee
                                    ?.replace("₹", "") || "",

                            availableDays:
                                Array.isArray(
                                    doctor.availableDays
                                )
                                    ? doctor.availableDays
                                    : [],

                            maxAppointmentsPerDay:
                                doctor.maxAppointmentsPerDay ||
                                "",

                        }}

                    >

                        {({

                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            errors,
                            setFieldValue,

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
                                    TIME PERIOD 1
                                ========================= */}

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Time Period 1
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="timePeriod1"
                                     
                                        value={
                                            values.timePeriod1
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                            touched.timePeriod1 &&
                                            !!errors.timePeriod1
                                        }
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.timePeriod1}
                                    </Form.Control.Feedback>

                                </Form.Group>


                                {/* =========================
                                    TIME PERIOD 2
                                ========================= */}

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Time Period 2
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="timePeriod2"
                                       
                                        value={
                                            values.timePeriod2
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                            touched.timePeriod2 &&
                                            !!errors.timePeriod2
                                        }
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.timePeriod2}
                                    </Form.Control.Feedback>

                                </Form.Group>


                                {/* =========================
                                    AVAILABLE DAYS
                                ========================= */}

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Available Days
                                    </Form.Label>

                                    <div className="border rounded p-3">

                                        <Row>

                                            {days.map(
                                                (day) => (

                                                    <Col
                                                        xs={6}
                                                        md={4}
                                                        key={day}
                                                        className="mb-2"
                                                    >

                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`edit-${day}`}
                                                            label={day}
                                                            checked={
                                                                values.availableDays.includes(
                                                                    day
                                                                )
                                                            }
                                                            onChange={() => {

                                                                const currentDays =
                                                                    values.availableDays ||
                                                                    [];

                                                                if (
                                                                    currentDays.includes(
                                                                        day
                                                                    )
                                                                ) {

                                                                    setFieldValue(
                                                                        "availableDays",
                                                                        currentDays.filter(
                                                                            (
                                                                                selectedDay
                                                                            ) =>
                                                                                selectedDay !==
                                                                                day
                                                                        )
                                                                    );

                                                                } else {

                                                                    setFieldValue(
                                                                        "availableDays",
                                                                        [
                                                                            ...currentDays,
                                                                            day
                                                                        ]
                                                                    );

                                                                }

                                                            }}
                                                        />

                                                    </Col>

                                                )
                                            )}

                                        </Row>

                                    </div>

                                    {errors.availableDays && (
                                        <div className="text-danger small mt-1">
                                            {errors.availableDays}
                                        </div>
                                    )}

                                </Form.Group>


                                {/* =========================
                                    MAXIMUM PATIENTS
                                ========================= */}

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Maximum Patients Per Day
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="maxAppointmentsPerDay"
                                        min="1"
                                        value={
                                            values.maxAppointmentsPerDay
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                            touched.maxAppointmentsPerDay &&
                                            !!errors.maxAppointmentsPerDay
                                        }
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {
                                            errors.maxAppointmentsPerDay
                                        }
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
