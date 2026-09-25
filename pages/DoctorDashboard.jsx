import React, { useState } from "react";
import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Modal,
    Button
} from "react-bootstrap";
import {
    useDispatch,
    useSelector
} from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    updateAppointmentStatus,
    updateDoctorProfile,
    removeDoctor
} from "../src/redux/userSlice";
import "./DoctorDashboard.css";

function DoctorDashboard() {
    const dispatch = useDispatch();

    const {
        user,
        isAuthenticated,
        appointments,
        doctors
    } = useSelector(
        (state) => state.userState
    );

    const [period, setPeriod] = useState("week");

    const [
        showCancelModal,
        setShowCancelModal
    ] = useState(false);

    const [
        appointmentToCancel,
        setAppointmentToCancel
    ] = useState(null);

    const [leaveDate, setLeaveDate] =
        useState("");

    const [
        showRemoveDoctorModal,
        setShowRemoveDoctorModal
    ] = useState(false);

    /*
    ==========================================
    AUTHENTICATION
    ==========================================
    */

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "Doctor") {
        return <Navigate to="/forbidden" replace />;
    }

    /*
    ==========================================
    FIND CURRENT DOCTOR
    ==========================================
    */

    const myDoctor =
        (doctors || []).find(
            (doctor) =>
                doctor.id === user.id ||
                doctor.email?.toLowerCase() ===
                    user.email?.toLowerCase()
        );

    /*
    ==========================================
    MY APPOINTMENTS
    ==========================================
    */

    const myAppointments =
        (appointments || []).filter(
            (appointment) =>
                appointment.doctorId ===
                myDoctor?.id
        );

    /*
    ==========================================
    FEE PARSER
    ==========================================
    */

    const parseFee = (feeStr) => {
        const numberOnly =
            String(feeStr || "").replace(
                /[^0-9.]/g,
                ""
            );

        return Number(numberOnly) || 0;
    };

    /*
    ==========================================
    DATE HELPERS
    ==========================================
    */

    const isInCurrentWeek = (timestamp) => {
        const now = new Date();

        const startOfWeek = new Date(now);

        startOfWeek.setHours(
            0,
            0,
            0,
            0
        );

        startOfWeek.setDate(
            now.getDate() - now.getDay()
        );

        const endOfWeek =
            new Date(startOfWeek);

        endOfWeek.setDate(
            startOfWeek.getDate() + 7
        );

        const date = new Date(timestamp);

        return (
            date >= startOfWeek &&
            date < endOfWeek
        );
    };

    const isInCurrentMonth = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);

        return (
            date.getMonth() ===
                now.getMonth() &&
            date.getFullYear() ===
                now.getFullYear()
        );
    };

    const isInCurrentYear = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);

        return (
            date.getFullYear() ===
            now.getFullYear()
        );
    };

    /*
    ==========================================
    COMPLETED APPOINTMENTS
    ==========================================
    */

    const completedAppointments =
        myAppointments.filter(
            (appointment) =>
                appointment.status ===
                "Completed"
        );

    /*
    ==========================================
    PERIOD APPOINTMENTS
    ==========================================
    */

    const periodAppointments =
        completedAppointments.filter(
            (appointment) => {
                /*
                Appointment IDs are created
                using Date.now(), so the ID
                can be used as the creation
                timestamp.
                */

                const timestamp =
                    appointment.id;

                if (period === "week") {
                    return isInCurrentWeek(
                        timestamp
                    );
                }

                if (period === "month") {
                    return isInCurrentMonth(
                        timestamp
                    );
                }

                return isInCurrentYear(
                    timestamp
                );
            }
        );

    /*
    ==========================================
    PATIENTS & EARNINGS
    ==========================================
    */

    const totalPatients =
        periodAppointments.length;

    const totalEarnings =
        periodAppointments.reduce(
            (total, appointment) =>
                total +
                parseFee(appointment.fee),
            0
        );

    const periodLabel =
        period === "week"
            ? "This Week"
            : period === "month"
            ? "This Month"
            : "This Year";

    /*
    ==========================================
    CONFIRM APPOINTMENT
    ==========================================
    */

    const handleConfirm = (
        appointmentId
    ) => {
        const appointment =
            myAppointments.find(
                (item) =>
                    item.id === appointmentId
            );

        if (!appointment) {
            toast.error(
                "Appointment not found."
            );
            return;
        }

        if (
            appointment.status !==
            "Pending"
        ) {
            toast.error(
                "This appointment cannot be confirmed."
            );
            return;
        }

        dispatch(
            updateAppointmentStatus({
                id: appointmentId,
                status: "Confirmed"
            })
        );

        toast.success(
            "Appointment confirmed."
        );
    };

    /*
    ==========================================
    COMPLETE APPOINTMENT
    ==========================================
    */

    const handleComplete = (
        appointmentId
    ) => {
        const appointment =
            myAppointments.find(
                (item) =>
                    item.id === appointmentId
            );

        if (!appointment) {
            toast.error(
                "Appointment not found."
            );
            return;
        }

        if (
            appointment.status !==
            "Confirmed"
        ) {
            toast.error(
                "Only confirmed appointments can be completed."
            );
            return;
        }

        dispatch(
            updateAppointmentStatus({
                id: appointmentId,
                status: "Completed"
            })
        );

        toast.success(
            "Checkup marked as completed."
        );
    };

    /*
    ==========================================
    OPEN CANCEL MODAL
    ==========================================
    */

    const openCancelModal = (
        appointmentId
    ) => {
        setAppointmentToCancel(
            appointmentId
        );

        setShowCancelModal(true);
    };

    /*
    ==========================================
    CANCEL APPOINTMENT
    ==========================================
    */

    const confirmCancel = () => {
        if (
            !appointmentToCancel
        ) {
            return;
        }

        const appointment =
            myAppointments.find(
                (item) =>
                    item.id ===
                    appointmentToCancel
            );

        if (!appointment) {
            toast.error(
                "Appointment not found."
            );

            setShowCancelModal(false);
            setAppointmentToCancel(null);

            return;
        }

        if (
            appointment.status !==
                "Pending" &&
            appointment.status !==
                "Confirmed"
        ) {
            toast.error(
                "This appointment cannot be cancelled."
            );

            setShowCancelModal(false);
            setAppointmentToCancel(null);

            return;
        }

        dispatch(
            updateAppointmentStatus({
                id: appointmentToCancel,
                status: "Cancelled"
            })
        );

        toast.success(
            "Appointment cancelled."
        );

        setShowCancelModal(false);
        setAppointmentToCancel(null);
    };

    /*
    ==========================================
    SET DOCTOR LEAVE
    ==========================================
    */

    const handleSetLeave = () => {
        if (!leaveDate) {
            toast.error(
                "Please select a leave date."
            );

            return;
        }

        if (!myDoctor) {
            toast.error(
                "Doctor profile not found."
            );

            return;
        }

        const selectedDate =
            new Date(
                leaveDate + "T00:00:00"
            );

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        if (selectedDate < today) {
            toast.error(
                "Please select today or a future date."
            );

            return;
        }

        dispatch(
            updateDoctorProfile({
                ...myDoctor,
                leaveDate: leaveDate
            })
        );

        toast.success(
            "Leave date set successfully."
        );
    };

    /*
    ==========================================
    CANCEL LEAVE
    ==========================================
    */

    const handleCancelLeave = () => {
        if (!myDoctor) {
            return;
        }

        dispatch(
            updateDoctorProfile({
                ...myDoctor,
                leaveDate: ""
            })
        );

        setLeaveDate("");

        toast.success(
            "Leave cancelled."
        );
    };

    /*
    ==========================================
    OPEN REMOVE DOCTOR MODAL
    ==========================================
    */

    const handleRemoveDoctor = () => {
        if (!myDoctor) {
            toast.error(
                "Doctor profile not found."
            );

            return;
        }

        setShowRemoveDoctorModal(
            true
        );
    };

    /*
    ==========================================
    CONFIRM REMOVE DOCTOR
    ==========================================
    */

    const confirmRemoveDoctor = () => {
        if (!myDoctor) {
            return;
        }

        dispatch(
            removeDoctor({
                doctorId: myDoctor.id,
                reason:
                    "Doctor removed their own profile"
            })
        );

        setShowRemoveDoctorModal(
            false
        );

        /*
        removeDoctor() logs the doctor
        out because the doctor account
        becomes inactive.
        */

        toast.success(
            "Your doctor profile has been removed."
        );
    };

    /*
    ==========================================
    RENDER
    ==========================================
    */

    return (
        <div className="doctor-dashboard">

            <Container>

                {/* =========================
                    DASHBOARD HEADING
                ========================= */}

                <div className="doctor-dashboard-heading">

                    <h2>
                        Doctor Dashboard
                    </h2>

                    <p>
                        Welcome, Dr.{" "}
                        {user.fullname}
                    </p>

                </div>

                {/* =========================
                    DOCTOR INFORMATION
                ========================= */}

                <Card className="doctor-info-card">

                    <Card.Body>

                        <h4>
                            Dr.{" "}
                            {user.fullname}
                        </h4>

                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {user.email}
                        </p>

                        {myDoctor ? (
                            <>

                                <p>
                                    <strong>
                                        Qualification:
                                    </strong>{" "}
                                    {
                                        myDoctor.qualification ||
                                        "Not specified"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Available Hours:
                                    </strong>{" "}
                                    {
                                        myDoctor.time ||
                                        "Not specified"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Consultation Fee:
                                    </strong>{" "}
                                    {
                                        myDoctor.fee ||
                                        "Not specified"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Daily Capacity:
                                    </strong>{" "}
                                    {
                                        myDoctor.maxAppointmentsPerDay ||
                                        "Not specified"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {
                                        myDoctor.status ||
                                        "Active"
                                    }
                                </p>

                            </>
                        ) : (
                            <p className="text-danger">
                                Doctor profile not found.
                            </p>
                        )}

                    </Card.Body>

                </Card>

                {/* =========================
                    DOCTOR LEAVE
                ========================= */}

                <Card className="doctor-info-card mt-4">

                    <Card.Body>

                        <h4>
                            Doctor Leave
                        </h4>

                        <p>
                            If you are not
                            available on a
                            particular day,
                            select that date
                            below.
                        </p>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Leave Date
                            </Form.Label>

                            <Form.Control
                                type="date"
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                value={
                                    leaveDate
                                }
                                onChange={(e) =>
                                    setLeaveDate(
                                        e.target
                                            .value
                                    )
                                }
                            />

                        </Form.Group>

                        <div className="d-flex gap-2">

                            <Button
                                variant="danger"
                                onClick={
                                    handleSetLeave
                                }
                            >
                                Set On Leave
                            </Button>

                            {myDoctor?.leaveDate && (

                                <Button
                                    variant="secondary"
                                    onClick={
                                        handleCancelLeave
                                    }
                                >
                                    Cancel Leave
                                </Button>

                            )}

                        </div>

                        {myDoctor?.leaveDate && (

                            <p className="mt-3 mb-0">

                                <strong>
                                    Current Leave
                                    Date:
                                </strong>{" "}

                                {new Date(
                                    myDoctor.leaveDate +
                                        "T00:00:00"
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                    }
                                )}

                            </p>

                        )}

                    </Card.Body>

                </Card>

                {/* =========================
                    REMOVE DOCTOR PROFILE
                ========================= */}

                {myDoctor?.status === "Active" && myDoctor?.isAvailable !== false && (
    <Card className="doctor-info-card mt-4">
        <Card.Body>
            <h4>
                Doctor Profile
            </h4>

            <p>
                Remove your profile
                from the public
                Doctors page if you
                no longer want
                patients to book
                you.
            </p>

            <Button
                variant="danger"
                onClick={handleRemoveDoctor}
            >
                Remove My Doctor
                Profile
            </Button>
        </Card.Body>
    </Card>
)}

                {/* =========================
                    APPOINTMENTS
                ========================= */}

                <div className="doctor-appointments">

                    <h3>
                        Appointments
                    </h3>

                    {myAppointments.length ===
                    0 ? (

                        <div className="no-doctor-appointments">
                            No appointments
                            yet.
                        </div>

                    ) : (

                        <Row>

                            {myAppointments.map(
                                (
                                    appointment
                                ) => (

                                    <Col
                                        md={6}
                                        lg={4}
                                        key={
                                            appointment.id
                                        }
                                        className="mb-3"
                                    >

                                        <Card className="doctor-appointment-card">

                                            <Card.Body>

                                                <h5>
                                                    {
                                                        appointment.userName
                                                    }
                                                </h5>

                                                <p>
                                                    <strong>
                                                        Appointment
                                                        Date:
                                                    </strong>{" "}

                                                    {appointment.appointmentDate
                                                        ? new Date(
                                                              appointment.appointmentDate +
                                                                  "T00:00:00"
                                                          ).toLocaleDateString(
                                                              "en-IN",
                                                              {
                                                                  day: "2-digit",
                                                                  month: "2-digit",
                                                                  year: "numeric"
                                                              }
                                                          )
                                                        : "Not selected"}

                                                </p>

                                                <p>
                                                    <strong>
                                                        Time:
                                                    </strong>{" "}

                                                    {
                                                        appointment.time ||
                                                        "Not specified"
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Fee:
                                                    </strong>{" "}

                                                    {
                                                        appointment.fee ||
                                                        "Not specified"
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Status:
                                                    </strong>{" "}

                                                    {
                                                        appointment.status
                                                    }
                                                </p>

                                                {/* =================
                                                    PENDING
                                                ================= */}

                                                {appointment.status ===
                                                    "Pending" && (

                                                    <div className="d-flex gap-2 mt-2">

                                                        <button
                                                            type="button"
                                                            className="btn btn-success btn-sm"
                                                            onClick={() =>
                                                                handleConfirm(
                                                                    appointment.id
                                                                )
                                                            }
                                                        >
                                                            Confirm
                                                            Appointment
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                openCancelModal(
                                                                    appointment.id
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                )}

                                                {/* =================
                                                    CONFIRMED
                                                ================= */}

                                                {appointment.status ===
                                                    "Confirmed" && (

                                                    <div className="d-flex gap-2 mt-2">

                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() =>
                                                                handleComplete(
                                                                    appointment.id
                                                                )
                                                            }
                                                        >
                                                            Completed
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                openCancelModal(
                                                                    appointment.id
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                            Appointment
                                                        </button>

                                                    </div>

                                                )}

                                                {/* =================
                                                    COMPLETED
                                                ================= */}

                                                {appointment.status ===
                                                    "Completed" && (

                                                    <div className="mt-2">

                                                        <span className="badge bg-success">
                                                            Checkup
                                                            Completed
                                                        </span>

                                                    </div>

                                                )}

                                                {/* =================
                                                    CANCELLED
                                                ================= */}

                                                {appointment.status ===
                                                    "Cancelled" && (

                                                    <div className="mt-2">

                                                        <span className="badge bg-danger">
                                                            Appointment
                                                            Cancelled
                                                        </span>

                                                        {appointment.cancellationReason && (
                                                            <p className="text-muted small mt-2 mb-0">
                                                                {
                                                                    appointment.cancellationReason
                                                                }
                                                            </p>
                                                        )}

                                                    </div>

                                                )}

                                            </Card.Body>

                                        </Card>

                                    </Col>

                                )
                            )}

                        </Row>

                    )}

                </div>

                {/* =========================
                    PATIENTS & EARNINGS
                ========================= */}

                <div className="doctor-stats">

                    <div className="stats-header">

                        <h3>
                            Patients & Earnings
                        </h3>

                        <Form.Select
                            size="sm"
                            value={period}
                            onChange={(e) =>
                                setPeriod(
                                    e.target.value
                                )
                            }
                            style={{
                                width: "auto"
                            }}
                        >

                            <option value="week">
                                This Week
                            </option>

                            <option value="month">
                                This Month
                            </option>

                            <option value="year">
                                This Year
                            </option>

                        </Form.Select>

                    </div>

                    <p className="period-label">
                        {periodLabel}
                    </p>

                    <Row>

                        <Col
                            md={6}
                            className="mb-2"
                        >

                            <Card className="stat-summary-card">

                                <Card.Body>

                                    <span className="stat-label">
                                        Completed
                                        Checkups
                                    </span>

                                    <h4>
                                        {
                                            totalPatients
                                        }
                                    </h4>

                                </Card.Body>

                            </Card>

                        </Col>

                        <Col
                            md={6}
                            className="mb-2"
                        >

                            <Card className="stat-summary-card">

                                <Card.Body>

                                    <span className="stat-label">
                                        Total
                                        Earnings
                                    </span>

                                    <h4>
                                        ₹
                                        {
                                            totalEarnings.toLocaleString(
                                                "en-IN"
                                            )
                                        }
                                    </h4>

                                </Card.Body>

                            </Card>

                        </Col>

                    </Row>

                </div>

            </Container>

            {/* =========================
                CANCEL APPOINTMENT MODAL
            ========================= */}

            <Modal
                show={
                    showCancelModal
                }
                onHide={() => {
                    setShowCancelModal(
                        false
                    );
                    setAppointmentToCancel(
                        null
                    );
                }}
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title>
                        Cancel Appointment
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <p>
                        Are you sure you want
                        to cancel this
                        appointment?
                    </p>

                    {/* <p className="text-muted mb-0">
                        The patient will be
                        notified that the
                        appointment was
                        cancelled.
                    </p> */}

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowCancelModal(
                                false
                            );
                            setAppointmentToCancel(
                                null
                            );
                        }}
                    >
                        No
                    </Button>

                    <Button
                        variant="danger"
                        onClick={
                            confirmCancel
                        }
                    >
                        Yes, Cancel
                    </Button>

                </Modal.Footer>

            </Modal>

            {/* =========================
                REMOVE DOCTOR MODAL
            ========================= */}

            <Modal
                show={
                    showRemoveDoctorModal
                }
                onHide={() =>
                    setShowRemoveDoctorModal(
                        false
                    )
                }
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title>
                        Remove Doctor Profile
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <p>
                        Are you sure you
                        want to remove your
                        doctor profile from
                        the Doctors page?
                    </p>

                    {/* <p className="text-muted">
                        Your doctor account
                        will become inactive
                        and you will be logged
                        out.
                    </p>

                    <p className="text-muted mb-0">
                        Your completed
                        appointment history
                        will remain saved.
                        Pending and confirmed
                        appointments will be
                        cancelled.
                    </p> */}

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() =>
                            setShowRemoveDoctorModal(
                                false
                            )
                        }
                    >
                        No
                    </Button>

                    <Button
                        variant="danger"
                        onClick={
                            confirmRemoveDoctor
                        }
                    >
                        Yes, Remove
                    </Button>

                </Modal.Footer>

            </Modal>

        </div>
    );
}

export default DoctorDashboard;

