
import React, { useState } from "react";
import {
    Button,
    Modal,
    Form
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { removeDoctor } from "../../src/redux/userSlice";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

function AdminDashboard() {
    const dispatch = useDispatch();

    const {
        users,
        appointments,
        doctors
    } = useSelector(
        (state) => state.userState
    );

    const totalUsers =
        users?.length || 0;

    const totalAppointments =
        appointments?.length || 0;

    // Only active/available doctors are counted
    const totalDoctors =
        doctors?.filter(
            (doctor) =>
                doctor.isAvailable !== false &&
                doctor.status !== "Inactive"
        ).length || 0;

    const [showRemoveModal, setShowRemoveModal] =
        useState(false);

    const [selectedDoctor, setSelectedDoctor] =
        useState(null);

    const [removeReason, setRemoveReason] =
        useState("");

    const [showReasonError, setShowReasonError] =
        useState(false);

    const openRemoveModal = (doctor) => {
        setSelectedDoctor(doctor);
        setRemoveReason("");
        setShowReasonError(false);
        setShowRemoveModal(true);
    };

    const closeRemoveModal = () => {
        setShowRemoveModal(false);
        setSelectedDoctor(null);
        setRemoveReason("");
        setShowReasonError(false);
    };

    const handleRemoveDoctor = () => {
        if (!removeReason.trim()) {
            setShowReasonError(true);
            return;
        }

        if (!selectedDoctor) {
            return;
        }

        dispatch(
            removeDoctor({
                doctorId: selectedDoctor.id,
                reason: removeReason.trim()
            })
        );

        toast.success(
            "Doctor removed successfully."
        );

        closeRemoveModal();
    };

    const activeDoctors =
        doctors?.filter(
            (doctor) =>
                doctor.isAvailable !== false &&
                doctor.status !== "Inactive"
        ) || [];

    return (
        <div className="admin-dashboard">
            <div className="admin-container">

                <div className="admin-header">
                    <h1>Admin Dashboard</h1>

                    <p>
                        Overview of your MindCare
                        platform.
                    </p>
                </div>

                <div className="admin-list">

                    <div className="admin-row">
                        <strong>
                            Total Users
                        </strong>

                        <strong>
                            {totalUsers}
                        </strong>
                    </div>

                    <div className="admin-row">
                        <strong>
                            Total Appointments
                        </strong>

                        <strong>
                            {totalAppointments}
                        </strong>
                    </div>

                    <div className="admin-row">
                        <strong>
                            Available Doctors
                        </strong>

                        <strong>
                            {totalDoctors}
                        </strong>
                    </div>

                </div>

                {/* Doctors Section */}

                <div className="admin-doctors-section">

                    <h2 className="mt-5 mb-4">
                        Manage Doctors
                    </h2>

                    {activeDoctors.length === 0 ? (
                        <p>
                            No active doctors
                            available.
                        </p>
                    ) : (
                        <div className="admin-doctor-list">

                            {activeDoctors.map(
                                (doctor) => (
                                    <div
                                        className="admin-doctor-row"
                                        key={
                                            doctor.id
                                        }
                                    >

                                        <div>
                                            <strong>
                                                Dr.{" "}
                                                {doctor.name ||
                                                    doctor.fullname}
                                            </strong>

                                            <p className="mb-0">
                                                {
                                                    doctor.qualification
                                                }
                                            </p>

                                            <small>
                                                Fee:{" "}
                                                {
                                                    doctor.fee
                                                }
                                            </small>
                                             <small>
                                                Time Period 1:{" "}
                                                {
                                                    doctor.timePeriod1
                                                }
                                            </small>
                                             <small>
                                                Time Period 2:{" "}
                                                {
                                                    doctor.timePeriod1
                                                }
                                            </small>
                                        </div>

                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                openRemoveModal(
                                                    doctor
                                                )
                                            }
                                        >
                                            Remove Doctor
                                        </Button>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

            </div>

            {/* Remove Doctor Modal */}

            <Modal
                show={showRemoveModal}
                onHide={closeRemoveModal}
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title>
                        Remove Doctor
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {selectedDoctor && (
                        <>
                            <div className="mb-3">
                                <strong>
                                    Doctor:
                                </strong>{" "}
                                Dr.{" "}
                                {selectedDoctor.name ||
                                    selectedDoctor.fullname}
                            </div>

                            <div className="alert alert-warning">
                                Removing this doctor
                                will make the doctor
                                unavailable and
                                deactivate their
                                account.

                                <br />
                                <br />

                                Pending and confirmed
                                appointments for
                                this doctor will be
                                cancelled. Completed
                                appointments will
                                remain in the system.
                            </div>

                            <Form.Group>
                                <Form.Label>
                                    Reason for removing
                                    doctor
                                </Form.Label>

                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Enter the reason for removing this doctor..."
                                    value={
                                        removeReason
                                    }
                                    onChange={(e) => {
                                        setRemoveReason(
                                            e.target.value
                                        );

                                        setShowReasonError(
                                            false
                                        );
                                    }}
                                    isInvalid={
                                        showReasonError
                                    }
                                />

                                <Form.Control.Feedback type="invalid">
                                    Please enter a
                                    reason before
                                    removing the doctor.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </>
                    )}

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={
                            closeRemoveModal
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={
                            handleRemoveDoctor
                        }
                    >
                        Remove Doctor
                    </Button>

                </Modal.Footer>

            </Modal>

        </div>
    );
}

export default AdminDashboard;

