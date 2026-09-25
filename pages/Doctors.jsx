import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Modal,
    Toast,
    ToastContainer,
    Form,
    Button
} from "react-bootstrap";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    addAppointment
} from "../src/redux/userSlice";
import "./Doctors.css";

function Doctors() {
    const dispatch = useDispatch();

    const {
        user,
        appointments,
        doctors
    } = useSelector(
        (state) => state.userState
    );

    const [
        selectedDoctor,
        setSelectedDoctor
    ] = useState(null);

    const [
        showModal,
        setShowModal
    ] = useState(false);

    const [
        appointmentDate,
        setAppointmentDate
    ] = useState("");

    const [
        showToast,
        setShowToast
    ] = useState(false);

    const [
        showAlreadyBookedToast,
        setShowAlreadyBookedToast
    ] = useState(false);

    const [
        showAlreadyPendingToast,
        setShowAlreadyPendingToast
    ] = useState(false);

    const [
        showFullyBookedToast,
        setShowFullyBookedToast
    ] = useState(false);

    /*
    ==========================================
    NEW MODALS
    ==========================================
    */

    const [
        showAlreadyBookedModal,
        setShowAlreadyBookedModal
    ] = useState(false);

    const [
        showAlreadyPendingModal,
        setShowAlreadyPendingModal
    ] = useState(false);

    /*
    ==========================================
    DOCTOR DISPLAY NAME
    ==========================================
    */

    const getDoctorDisplayName = (
        doctor
    ) => {
        const rawName =
            doctor?.name ||
            doctor?.fullname ||
            "Unknown";

        return rawName.startsWith("Dr.")
            ? rawName
            : `Dr. ${rawName}`;
    };

    /*
    ==========================================
    TODAY'S DATE
    ==========================================
    */

    const getTodayDate = () => {
        const today = new Date();

        return (
            today.getFullYear() +
            "-" +
            String(
                today.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                today.getDate()
            ).padStart(2, "0")
        );
    };

    /*
    ==========================================
    DOCTOR LEAVE
    ==========================================
    */

    const isDoctorOnLeaveToday = (
        doctor
    ) => {
        if (!doctor?.leaveDate) {
            return false;
        }

        return (
            doctor.leaveDate ===
            getTodayDate()
        );
    };

    const isDoctorOnLeaveOnDate = (
        doctor,
        date
    ) => {
        if (
            !doctor?.leaveDate ||
            !date
        ) {
            return false;
        }

        return (
            doctor.leaveDate ===
            date
        );
    };

    /*
    ==========================================
    DOCTOR AVAILABLE DAY
    ==========================================
    */

    const isDoctorAvailableOnDate = (
        doctor,
        date
    ) => {
        if (!doctor || !date) {
            return false;
        }

        if (
            !doctor.availableDays ||
            doctor.availableDays.length === 0
        ) {
            return true;
        }

        const selectedDate =
            new Date(
                `${date}T00:00:00`
            );

        const dayName =
            selectedDate.toLocaleDateString(
                "en-US",
                {
                    weekday: "long"
                }
            );

        return doctor.availableDays.includes(
            dayName
        );
    };

    /*
    ==========================================
    DOCTOR APPOINTMENTS FOR DATE
    ==========================================
    */

    const getAppointmentsForDoctorOnDate = (
        doctorId,
        date
    ) => {
        return (
            appointments || []
        ).filter(
            (appointment) =>
                appointment.doctorId ===
                    doctorId &&
                appointment.appointmentDate ===
                    date &&
                (
                    appointment.status ===
                        "Pending" ||
                    appointment.status ===
                        "Confirmed"
                )
        );
    };

    /*
    ==========================================
    DOCTOR DAILY CAPACITY
    ==========================================
    */

    const isDoctorFullyBooked = (
        doctor,
        date
    ) => {
        if (!doctor || !date) {
            return false;
        }

        if (
            !doctor.maxAppointmentsPerDay
        ) {
            return false;
        }

        const appointmentsForDate =
            getAppointmentsForDoctorOnDate(
                doctor.id,
                date
            );

        return (
            appointmentsForDate.length >=
            Number(
                doctor.maxAppointmentsPerDay
            )
        );
    };

    /*
    ==========================================
    CURRENT PATIENT APPOINTMENT
    ==========================================
    */

    const getMyAppointmentForDate = (
        doctorId,
        date
    ) => {
        if (!user || !date) {
            return null;
        }

        return (
            appointments || []
        ).find(
            (appointment) =>
                appointment.userId ===
                    user.id &&
                appointment.doctorId ===
                    doctorId &&
                appointment.appointmentDate ===
                    date &&
                (
                    appointment.status ===
                        "Pending" ||
                    appointment.status ===
                        "Confirmed"
                )
        );
    };

    /*
    ==========================================
    BOOK APPOINTMENT
    ==========================================
    */

    const handleBooking = (
        doctor
    ) => {
        if (!user) {
            return;
        }

        if (
            isDoctorOnLeaveToday(
                doctor
            )
        ) {
            return;
        }

        setSelectedDoctor(
            doctor
        );

        setAppointmentDate("");

        setShowModal(true);
    };

    /*
    ==========================================
    DATE CHANGE
    ==========================================
    */

    const handleAppointmentDateChange = (
        e
    ) => {
        const selectedDate =
            e.target.value;

        setAppointmentDate(
            selectedDate
        );

        if (
            !selectedDoctor ||
            !selectedDate
        ) {
            return;
        }

        /*
         * Check whether the patient
         * already has an appointment
         * with this doctor on this date.
         */

        const existingAppointment =
            getMyAppointmentForDate(
                selectedDoctor.id,
                selectedDate
            );

        if (!existingAppointment) {
            return;
        }

        /*
         * Close the booking form
         * before showing the duplicate
         * appointment modal.
         */

        setShowModal(false);

        if (
            existingAppointment.status ===
            "Confirmed"
        ) {
            setShowAlreadyBookedModal(
                true
            );
        } else {
            setShowAlreadyPendingModal(
                true
            );
        }
    };

    /*
    ==========================================
    CONFIRM BOOKING
    ==========================================
    */

    const confirmBooking = () => {
        if (
            !user ||
            !selectedDoctor
        ) {
            return;
        }

        if (!appointmentDate) {
            return;
        }

        /*
         * Doctor leave check.
         */

        if (
            isDoctorOnLeaveOnDate(
                selectedDoctor,
                appointmentDate
            )
        ) {
            return;
        }

        /*
         * Doctor available day check.
         */

        if (
            !isDoctorAvailableOnDate(
                selectedDoctor,
                appointmentDate
            )
        ) {
            return;
        }

        /*
         * Check duplicate appointment.
         */

        const existingAppointment =
            getMyAppointmentForDate(
                selectedDoctor.id,
                appointmentDate
            );

        if (existingAppointment) {
            setShowModal(false);

            if (
                existingAppointment.status ===
                "Confirmed"
            ) {
                setShowAlreadyBookedModal(
                    true
                );
            } else {
                setShowAlreadyPendingModal(
                    true
                );
            }

            return;
        }

        /*
         * Check doctor's daily capacity.
         */

        if (
            isDoctorFullyBooked(
                selectedDoctor,
                appointmentDate
            )
        ) {
            setShowModal(false);

            setShowFullyBookedToast(
                true
            );

            return;
        }

        /*
         * Create appointment.
         */

        const appointment = {
            id: Date.now(),

            userId:
                user.id,

            userName:
                user.fullname,

            doctorId:
                selectedDoctor.id,

            doctorName:
                selectedDoctor.name ||
                selectedDoctor.fullname,

            qualification:
                selectedDoctor.qualification,

            availableDays:
                selectedDoctor.availableDays,

            timePeriod1:
                selectedDoctor.timePeriod1,

            timePeriod2:
                selectedDoctor.timePeriod2,

            time:
                selectedDoctor.time,

            fee:
                selectedDoctor.fee,

            appointmentDate,

            status: "Pending",

            patientNotification:
                "Appointment request sent. Waiting for doctor confirmation.",

            notificationType:
                "Appointment Request",

            notificationShown: false
        };

        dispatch(
            addAppointment(
                appointment
            )
        );

        /*
         * Close booking modal.
         */

        setShowModal(false);

        setSelectedDoctor(null);

        setAppointmentDate("");

        /*
         * Show success toast.
         */

        setShowToast(true);
    };

    /*
    ==========================================
    AVAILABLE DOCTORS
    ==========================================
    */

    const availableDoctors =
        (
            doctors || []
        ).filter(
            (doctor) =>
                doctor.isAvailable !==
                    false &&
                doctor.status !==
                    "Inactive"
        );

    return (
        <Container className="mt-5 mb-5">

            <h2 className="text-center text-primary mb-4">
                OUR DOCTORS
            </h2>

            <Row>

                {availableDoctors.length ===
                0 ? (

                    <Col>

                        <div className="text-center">

                            <h5>
                                No doctors available
                                at the moment.
                            </h5>

                        </div>

                    </Col>

                ) : (

                    availableDoctors.map(
                        (doctor) => (

                            <Col
                                md={6}
                                lg={4}
                                className="mb-4"
                                key={
                                    doctor.id
                                }
                            >

                                <div className="card h-100 shadow-sm">

                                    <div className="card-body">

                                        <h4 className="card-title text-primary">
                                            {
                                                getDoctorDisplayName(
                                                    doctor
                                                )
                                            }
                                        </h4>

                                        <p className="doctor-qualification">
                                            <strong>
                                                Qualification:
                                            </strong>{" "}
                                            {
                                                doctor.qualification
                                            }
                                        </p>

                                        <div className="doctor-availability">

                                            <strong>
                                                Available Days:
                                            </strong>

                                            <div className="doctor-days">

                                                {(
                                                    doctor.availableDays ||
                                                    []
                                                ).length > 0 ? (

                                                    doctor.availableDays.map(
                                                        (
                                                            day
                                                        ) => (

                                                            <span
                                                                key={
                                                                    day
                                                                }
                                                                className="doctor-day"
                                                            >
                                                                {
                                                                    day
                                                                }
                                                            </span>

                                                        )
                                                    )

                                                ) : (

                                                    <span className="doctor-day-empty">
                                                        Not specified
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                        <div className="doctor-time">

                                            <strong>
                                                Available Time:
                                            </strong>

                                            <div className="time-period">

                                                <span className="time-label">
                                                    Period 1:
                                                </span>{" "}

                                                {
                                                    doctor.timePeriod1 ||
                                                    "Not specified"
                                                }

                                            </div>

                                            {doctor.timePeriod2 && (

                                                <div className="time-period">

                                                    <span className="time-label">
                                                        Period 2:
                                                    </span>{" "}

                                                    {
                                                        doctor.timePeriod2
                                                    }

                                                </div>

                                            )}

                                        </div>

                                        <p className="doctor-fee">

                                            <strong>
                                                Consultation Fee:
                                            </strong>{" "}

                                            {
                                                doctor.fee
                                            }

                                        </p>

                                        {isDoctorOnLeaveToday(
                                            doctor
                                        ) && (

                                            <div className="doctor-leave">
                                                Doctor is on leave
                                                today.
                                            </div>

                                        )}

                                        <Button
                                            variant="success"
                                            className="w-100"
                                            disabled={
                                                !user ||
                                                isDoctorOnLeaveToday(
                                                    doctor
                                                )
                                            }
                                            onClick={() =>
                                                handleBooking(
                                                    doctor
                                                )
                                            }
                                        >

                                            {!user
                                                ? "Login to Book"
                                                : isDoctorOnLeaveToday(
                                                      doctor
                                                  )
                                                ? "Doctor On Leave"
                                                : "Book Appointment"}

                                        </Button>

                                    </div>

                                </div>

                            </Col>

                        )
                    )

                )}

            </Row>

            {/* =========================
                BOOKING MODAL
            ========================= */}

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelectedDoctor(null);
                    setAppointmentDate("");
                }}
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title>
                        Book Appointment
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    {selectedDoctor && (
                        <>

                            <h5 className="text-primary mb-3">
                                {
                                    getDoctorDisplayName(
                                        selectedDoctor
                                    )
                                }
                            </h5>

                            <p>
                                <strong>
                                    Qualification:
                                </strong>{" "}
                                {
                                    selectedDoctor.qualification
                                }
                            </p>

                            <div className="doctor-availability">

                                <strong>
                                    Available Days:
                                </strong>

                                <div className="doctor-days">

                                    {(
                                        selectedDoctor.availableDays ||
                                        []
                                    ).map(
                                        (
                                            day
                                        ) => (

                                            <span
                                                key={
                                                    day
                                                }
                                                className="doctor-day"
                                            >
                                                {
                                                    day
                                                }
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>

                            <div className="doctor-time">

                                <strong>
                                    Available Time:
                                </strong>

                                <div className="time-period">

                                    <span className="time-label">
                                        Period 1:
                                    </span>{" "}

                                    {
                                        selectedDoctor.timePeriod1 ||
                                        "Not specified"
                                    }

                                </div>

                                {selectedDoctor.timePeriod2 && (

                                    <div className="time-period">

                                        <span className="time-label">
                                            Period 2:
                                        </span>{" "}

                                        {
                                            selectedDoctor.timePeriod2
                                        }

                                    </div>

                                )}

                            </div>

                            <p className="doctor-fee">

                                <strong>
                                    Consultation Fee:
                                </strong>{" "}

                                {
                                    selectedDoctor.fee
                                }

                            </p>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Select Appointment Date
                                </Form.Label>

                                <Form.Control
                                    type="date"
                                    min={
                                        getTodayDate()
                                    }
                                    value={
                                        appointmentDate
                                    }
                                    onChange={
                                        handleAppointmentDateChange
                                    }
                                />

                            </Form.Group>

                            {appointmentDate &&
                                isDoctorOnLeaveOnDate(
                                    selectedDoctor,
                                    appointmentDate
                                ) && (

                                    <div className="doctor-warning">

                                        Doctor is on leave
                                        on the selected
                                        date.

                                    </div>

                                )}

                            {appointmentDate &&
                                !isDoctorOnLeaveOnDate(
                                    selectedDoctor,
                                    appointmentDate
                                ) &&
                                !isDoctorAvailableOnDate(
                                    selectedDoctor,
                                    appointmentDate
                                ) && (

                                    <div className="doctor-warning">

                                        Doctor is not
                                        available on the
                                        selected day.
                                        Please choose
                                        another date.

                                    </div>

                                )}

                            {appointmentDate &&
                                !getMyAppointmentForDate(
                                    selectedDoctor.id,
                                    appointmentDate
                                ) &&
                                !isDoctorOnLeaveOnDate(
                                    selectedDoctor,
                                    appointmentDate
                                ) &&
                                isDoctorAvailableOnDate(
                                    selectedDoctor,
                                    appointmentDate
                                ) &&
                                isDoctorFullyBooked(
                                    selectedDoctor,
                                    appointmentDate
                                ) && (

                                    <div className="doctor-warning">

                                        Doctor is fully
                                        booked on the
                                        selected date.
                                        Please choose
                                        another date.

                                    </div>

                                )}

                        </>
                    )}

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowModal(false);
                            setSelectedDoctor(null);
                            setAppointmentDate("");
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="success"
                        disabled={
                            !appointmentDate ||
                            !selectedDoctor ||
                            isDoctorOnLeaveOnDate(
                                selectedDoctor,
                                appointmentDate
                            ) ||
                            !isDoctorAvailableOnDate(
                                selectedDoctor,
                                appointmentDate
                            ) ||
                            !!getMyAppointmentForDate(
                                selectedDoctor?.id,
                                appointmentDate
                            ) ||
                            isDoctorFullyBooked(
                                selectedDoctor,
                                appointmentDate
                            )
                        }
                        onClick={
                            confirmBooking
                        }
                    >
                        Send Appointment Request
                    </Button>

                </Modal.Footer>

            </Modal>

            {/* =========================
                ALREADY BOOKED MODAL
            ========================= */}

            <Modal
                show={
                    showAlreadyBookedModal
                }
                onHide={() =>
                    setShowAlreadyBookedModal(
                        false
                    )
                }
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title>
                        Appointment Already Booked
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <p className="mb-0">
                        You already have a
                        <strong>
                            {" "}confirmed appointment{" "}
                        </strong>
                        with this doctor on the
                        selected date.
                    </p>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="primary"
                        onClick={() =>
                            setShowAlreadyBookedModal(
                                false
                            )
                        }
                    >
                        OK
                    </Button>

                </Modal.Footer>

            </Modal>

            {/* =========================
                ALREADY PENDING MODAL
            ========================= */}

            <Modal
                show={
                    showAlreadyPendingModal
                }
                onHide={() =>
                    setShowAlreadyPendingModal(
                        false
                    )
                }
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title>
                        Appointment Already Pending
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <p className="mb-0">
                        You already have a
                        <strong>
                            {" "}pending appointment{" "}
                        </strong>
                        with this doctor on the
                        selected date.
                    </p>

                    <p className="text-muted mt-2 mb-0">
                        Please wait for the doctor
                        to confirm your appointment.
                    </p>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="primary"
                        onClick={() =>
                            setShowAlreadyPendingModal(
                                false
                            )
                        }
                    >
                        OK
                    </Button>

                </Modal.Footer>

            </Modal>

            {/* =========================
                TOASTS
            ========================= */}

            <ToastContainer
                position="top-end"
                className="p-3"
            >

                {/* Request Sent */}

                <Toast
                    show={showToast}
                    onClose={() =>
                        setShowToast(false)
                    }
                    delay={4000}
                    autohide
                    bg="success"
                >

                    <Toast.Header>

                        <strong className="me-auto">
                            Appointment Request
                        </strong>

                    </Toast.Header>

                    <Toast.Body className="text-white">

                        Appointment request
                        sent successfully.

                        <br />

                        Waiting for doctor
                        confirmation.

                    </Toast.Body>

                </Toast>

                {/* Already Confirmed Toast
                    kept for safety if triggered
                    elsewhere
                */}

                <Toast
                    show={
                        showAlreadyBookedToast
                    }
                    onClose={() =>
                        setShowAlreadyBookedToast(
                            false
                        )
                    }
                    delay={4000}
                    autohide
                    bg="warning"
                >

                    <Toast.Header>

                        <strong className="me-auto">
                            Appointment
                        </strong>

                    </Toast.Header>

                    <Toast.Body>

                        You already have a
                        confirmed appointment
                        with this doctor on
                        this date.

                    </Toast.Body>

                </Toast>

                {/* Already Pending Toast
                    kept for safety if triggered
                    elsewhere
                */}

                <Toast
                    show={
                        showAlreadyPendingToast
                    }
                    onClose={() =>
                        setShowAlreadyPendingToast(
                            false
                        )
                    }
                    delay={4000}
                    autohide
                    bg="warning"
                >

                    <Toast.Header>

                        <strong className="me-auto">
                            Appointment
                        </strong>

                    </Toast.Header>

                    <Toast.Body>

                        You already have a
                        pending appointment
                        with this doctor on
                        this date.

                    </Toast.Body>

                </Toast>

                {/* Fully Booked */}

                <Toast
                    show={
                        showFullyBookedToast
                    }
                    onClose={() =>
                        setShowFullyBookedToast(
                            false
                        )
                    }
                    delay={4000}
                    autohide
                    bg="warning"
                >

                    <Toast.Header>

                        <strong className="me-auto">
                            Appointment
                        </strong>

                    </Toast.Header>

                    <Toast.Body>

                        Doctor is fully booked
                        on the selected date.
                        Please choose another
                        date.

                    </Toast.Body>

                </Toast>

            </ToastContainer>

        </Container>
    );
}

export default Doctors;

