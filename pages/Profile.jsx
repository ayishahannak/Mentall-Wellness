
import { useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Modal
} from "react-bootstrap";
import {
  useDispatch,
  useSelector
} from "react-redux";
import { Navigate } from "react-router-dom";
import {
  removeAppointment
} from "../src/redux/userSlice";
import "./Profile.css";

function Profile() {
  const dispatch = useDispatch();

  const {
    user,
    isAuthenticated,
    appointments
  } = useSelector(
    (state) => state.userState
  );

  const [
    selectedAppointment,
    setSelectedAppointment
  ] = useState(null);

  const [
    showCancelModal,
    setShowCancelModal
  ] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const myAppointments =
    (appointments || []).filter(
      (appointment) =>
        appointment.userId === user.id
    );

  const handleCancelClick = (
    appointment
  ) => {
    setSelectedAppointment(
      appointment
    );

    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    if (selectedAppointment) {
      dispatch(
        removeAppointment(
          selectedAppointment.id
        )
      );
    }

    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="profile-page">

      <Container>

        <Row className="justify-content-center">

          <Col md={6}>

            <Card className="profile-card">

              <div className="profile-top">

                <div className="profile-avatar">
                  {user.fullname
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <h3 className="profile-name">
                  {user.fullname}
                </h3>

              </div>

              <div className="profile-details">

                <div className="profile-info">

                  <span className="profile-label">
                    Full Name
                  </span>

                  <span className="profile-value">
                    {user.fullname}
                  </span>

                </div>

                <div className="profile-info">

                  <span className="profile-label">
                    Email
                  </span>

                  <span className="profile-value">
                    {user.email}
                  </span>

                </div>

                <div className="profile-info">

                  <span className="profile-label">
                    Role
                  </span>

                  <span className="profile-value">
                    {user.role}
                  </span>

                </div>

                <div className="profile-info">

                  <span className="profile-label">
                    Status
                  </span>

                  <span className="profile-value">
                    {user.status
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

              </div>

            </Card>

          </Col>

        </Row>

        <div className="appointments-section">

          <h3 className="appointments-title">
            My Appointments
          </h3>

          {myAppointments.length === 0 ? (

            <div className="no-appointments">
              You have no appointments yet.
            </div>

          ) : (

            <Row>

              {myAppointments.map(
                (appointment) => (

                  <Col
                    key={appointment.id}
                    md={6}
                    lg={4}
                    className="mb-3"
                  >

                    <Card className="appointment-card">

                      <div className="appointment-body">

                        <h5 className="appointment-doctor">
                          {appointment.doctorName}
                        </h5>

                        <div className="appointment-line">

                          <strong>
                            Qualification
                          </strong>

                          <br />

                          {appointment.qualification}

                        </div>

                        <div className="appointment-line">

                          <strong>
                            Available Time
                          </strong>

                          <br />

                          {appointment.time}

                        </div>

                        <div className="appointment-fee">

                          <span className="fee-label">
                            Consultation Fee
                          </span>

                          <span className="fee-value">
                            {appointment.fee}
                          </span>

                        </div>

                        <span
                          className={
                            appointment.status ===
                            "Confirmed"
                              ? "appointment-status status-confirmed"
                              : appointment.status ===
                                "Completed"
                              ? "appointment-status status-completed"
                              : appointment.status ===
                                "Cancelled"
                              ? "appointment-status status-cancelled"
                              : "appointment-status status-pending"
                          }
                        >
                          {appointment.status}
                        </span>

                        {appointment.status ===
                          "Cancelled" && (
                          <div className="appointment-cancellation-info">

                            <strong>
                              Cancellation Reason
                            </strong>

                            <p>
                              {appointment.cancellationReason ||
                                "Appointment was cancelled."}
                            </p>

                            {appointment.doctorRemovalReason && (
                              <>
                                <strong>
                                  Admin Reason
                                </strong>

                                <p>
                                  {
                                    appointment.doctorRemovalReason
                                  }
                                </p>
                              </>
                            )}

                          </div>
                        )}

                        {appointment.status !==
                          "Completed" &&
                          appointment.status !==
                            "Cancelled" && (

                            <button
                              type="button"
                              className="cancel-appointment-btn"
                              onClick={() =>
                                handleCancelClick(
                                  appointment
                                )
                              }
                            >
                              Cancel Appointment
                            </button>

                          )}

                      </div>

                    </Card>

                  </Col>

                )
              )}

            </Row>

          )}

        </div>

      </Container>

      <Modal
        show={showCancelModal}
        onHide={() =>
          setShowCancelModal(false)
        }
        centered
        dialogClassName="small-cancel-modal"
      >

        <Modal.Header closeButton>

          <Modal.Title>
            Cancel Appointment
          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          {selectedAppointment && (

            <div className="cancel-modal-content">

              <p>

                Are you sure you want to
                cancel your appointment
                with{" "}

                <strong>
                  {
                    selectedAppointment.doctorName
                  }
                </strong>
                ?

              </p>

            </div>

          )}

        </Modal.Body>

        <Modal.Footer>

          <button
            type="button"
            className="cancel-no-btn"
            onClick={() =>
              setShowCancelModal(false)
            }
          >
            No
          </button>

          <button
            type="button"
            className="cancel-yes-btn"
            onClick={
              confirmCancellation
            }
          >
            Yes, Cancel
          </button>

        </Modal.Footer>

      </Modal>

    </div>
  );
}

export default Profile;