
import React from "react";
import {
    Button,
    Col,
    Container,
    Form,
    Row
} from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
    useDispatch,
    useSelector
} from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    addDoctor,
    userRegister,
    reactivateDoctor
} from "../src/redux/userSlice";

const DoctorRegister = () => {
    const { Formik } = formik;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const { users } = useSelector(
        (state) => state.userState
    );

   
    const doctorAccount =
        JSON.parse(
            localStorage.getItem(
                "doctorRegistration"
            )
        );

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const schema = yup.object().shape({

        qualification: yup
            .string()
            .required(
                "Enter qualification"
            ),

        availableDays: yup
            .array()
            .min(
                1,
                "Select at least one available day"
            )
            .required(
                "Select available days"
            ),

        timePeriod1: yup
            .string()
            .required(
                "Enter first available time period"
            ),

       
        timePeriod2: yup.string(),

        maxAppointmentsPerDay: yup
            .number()
            .typeError(
                "Maximum appointments must be a number"
            )
            .integer(
                "Enter a whole number"
            )
            .positive(
                "Maximum appointments must be greater than 0"
            )
            .required(
                "Enter maximum appointments per day"
            ),

        fee: yup
            .number()
            .typeError(
                "Fee must be a number"
            )
            .positive(
                "Fee must be greater than 0"
            )
            .required(
                "Enter consultation fee"
            )
    });

    const handleDoctorSubmit = (
        values
    ) => {

       
        if (!doctorAccount) {

            toast.error(
                "Doctor registration information not found"
            );

            navigate("/register");

            return;
        }

        /*
         * Keep the old time field for
         * compatibility with existing data.
         */
        const availableTime =
            values.timePeriod2
                ? `${values.timePeriod1} / ${values.timePeriod2}`
                : values.timePeriod1;

        
        const existingUser =
            (users || []).find(
                (user) =>
                    user.email?.toLowerCase() ===
                    doctorAccount.email?.toLowerCase()
            );


        if (existingUser) {

            
            if (
                existingUser.status !== false
            ) {

                toast.error(
                    "This email is already registered."
                );

                return;
            }

           
            if (
                existingUser.role !==
                "Doctor"
            ) {

                toast.error(
                    "This email belongs to an inactive user account."
                );

                return;
            }

            /*
             * =========================
             * REACTIVATE DOCTOR
             * =========================
             */

            const reactivatedDoctor = {

                id:
                    existingUser.id,

                fullname:
                    doctorAccount.fullname,

                email:
                    doctorAccount.email,

                password:
                    doctorAccount.password,

                name:
                    doctorAccount.fullname,

                qualification:
                    values.qualification,

                availableDays:
                    values.availableDays,

                timePeriod1:
                    values.timePeriod1,

                timePeriod2:
                    values.timePeriod2,

                time:
                    availableTime,

                maxAppointmentsPerDay:
                    Number(
                        values.maxAppointmentsPerDay
                    ),

                fee:
                    `₹${values.fee}`,

                role: "Doctor",

                status: "Active",

                isAvailable: true,

                leaveDate: "",

                /*
                 * Clear previous removal
                 * information.
                 */
                removalReason: "",

                removedAt: ""
            };

            dispatch(
                reactivateDoctor({
                    userId:
                        existingUser.id,

                    doctorData:
                        reactivatedDoctor
                })
            );

            /*
             * Remove temporary
             * registration data.
             */
            localStorage.removeItem(
                "doctorRegistration"
            );

            toast.success(
                "Doctor account reactivated successfully!"
            );

            navigate("/login");

            return;
        }

        /*
         * =========================
         * NEW DOCTOR REGISTRATION
         * =========================
         */

        const newDoctor = {

            id: Date.now(),

            fullname:
                doctorAccount.fullname,

            email:
                doctorAccount.email,

            password:
                doctorAccount.password,

            name:
                doctorAccount.fullname,

            qualification:
                values.qualification,

            availableDays:
                values.availableDays,

            timePeriod1:
                values.timePeriod1,

            timePeriod2:
                values.timePeriod2,

            time:
                availableTime,

            maxAppointmentsPerDay:
                Number(
                    values.maxAppointmentsPerDay
                ),

            fee:
                `₹${values.fee}`,

            role: "Doctor",

            status: "Active",

            isAvailable: true,

            leaveDate: ""
        };

        /*
         * Add Doctor profile.
         */
        dispatch(
            addDoctor(
                newDoctor
            )
        );

        /*
         * Add Doctor login account.
         */
        dispatch(
            userRegister({

                id:
                    newDoctor.id,

                fullname:
                    doctorAccount.fullname,

                email:
                    doctorAccount.email,

                password:
                    doctorAccount.password,

                role: "Doctor",

                status: true
            })
        );

        /*
         * Remove temporary
         * registration data.
         */
        localStorage.removeItem(
            "doctorRegistration"
        );

        toast.success(
            "Doctor registered successfully!"
        );

        navigate("/login");
    };

    /*
     * =========================
     * NO REGISTRATION DATA
     * =========================
     */

    if (!doctorAccount) {

        return (
            <Container className="mt-5 text-center">

                <h3>
                    Doctor registration session
                    expired.
                </h3>

                <Button
                    className="mt-3"
                    onClick={() =>
                        navigate(
                            "/register"
                        )
                    }
                >
                    Go to Registration
                </Button>

            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">

            <Row className="justify-content-center">

                <Col
                    md={6}
                    lg={5}
                >

                    <h2 className="text-center mb-4 text-primary">
                        DOCTOR REGISTRATION
                    </h2>

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Doctor Name
                        </Form.Label>

                        <Form.Control
                            type="text"
                            value={`Dr. ${doctorAccount.fullname}`}
                            disabled
                        />

                    </Form.Group>

                    <Formik
                        validationSchema={
                            schema
                        }
                        onSubmit={
                            handleDoctorSubmit
                        }
                        initialValues={{
                            qualification: "",
                            availableDays: [],
                            timePeriod1: "",
                            timePeriod2: "",
                            maxAppointmentsPerDay:
                                "",
                            fee: ""
                        }}
                    >

                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            setFieldValue,
                            values,
                            touched,
                            errors
                        }) => {

                            const handleDayChange =
                                (day) => {

                                    let updatedDays =
                                        [
                                            ...values.availableDays
                                        ];

                                    if (
                                        updatedDays.includes(
                                            day
                                        )
                                    ) {

                                        updatedDays =
                                            updatedDays.filter(
                                                (
                                                    item
                                                ) =>
                                                    item !==
                                                    day
                                            );

                                    } else {

                                        updatedDays.push(
                                            day
                                        );
                                    }

                                    setFieldValue(
                                        "availableDays",
                                        updatedDays
                                    );
                                };

                            return (
                                <Form
                                    noValidate
                                    onSubmit={
                                        handleSubmit
                                    }
                                >

                                    {/* Qualification */}

                                    <Form.Group className="mb-4">

                                        <Form.Label>
                                            Qualification
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="qualification"
                                           
                                            value={
                                                values.qualification
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onBlur={
                                                handleBlur
                                            }
                                            isInvalid={
                                                touched.qualification &&
                                                !!errors.qualification
                                            }
                                        />

                                        <Form.Control.Feedback type="invalid">

                                            {
                                                errors.qualification
                                            }

                                        </Form.Control.Feedback>

                                    </Form.Group>

                                    {/* Available Days */}

                                    <Form.Group className="mb-4">

                                        <Form.Label className="fw-semibold">
                                            Available Days
                                        </Form.Label>

                                        <div className="doctor-days-selection">

                                            <Row>

                                                {days.map(
                                                    (
                                                        day
                                                    ) => (

                                                        <Col
                                                            xs={
                                                                6
                                                            }
                                                            key={
                                                                day
                                                            }
                                                            className="mb-2"
                                                        >

                                                            <Form.Check
                                                                type="checkbox"
                                                                id={`day-${day}`}
                                                                label={
                                                                    day
                                                                }
                                                                checked={values.availableDays.includes(
                                                                    day
                                                                )}
                                                                onChange={() =>
                                                                    handleDayChange(
                                                                        day
                                                                    )
                                                                }
                                                            />

                                                        </Col>

                                                    )
                                                )}

                                            </Row>

                                        </div>

                                        {touched.availableDays &&
                                            errors.availableDays && (

                                                <div className="text-danger small mt-1">

                                                    {
                                                        errors.availableDays
                                                    }

                                                </div>

                                            )}

                                    </Form.Group>

                                    {/* Period 1 */}

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Available Time -
                                            Period 1
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="timePeriod1"
                                           
                                            value={
                                                values.timePeriod1
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onBlur={
                                                handleBlur
                                            }
                                            isInvalid={
                                                touched.timePeriod1 &&
                                                !!errors.timePeriod1
                                            }
                                        />

                                        <Form.Control.Feedback type="invalid">

                                            {
                                                errors.timePeriod1
                                            }

                                        </Form.Control.Feedback>

                                    </Form.Group>

                                    {/* Period 2 */}

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Available Time -
                                            Period 2

                                            <span className="text-muted ms-2">
                                                (Optional)
                                            </span>

                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="timePeriod2"
                                           
                                            value={
                                                values.timePeriod2
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onBlur={
                                                handleBlur
                                            }
                                        />

                                    </Form.Group>

                                    {/* Maximum Appointments */}

                                    <Form.Group className="mb-4">

                                        <Form.Label>
                                            Maximum Appointments
                                            Per Day
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            name="maxAppointmentsPerDay"
                                            min="1"
                                            
                                            value={
                                                values.maxAppointmentsPerDay
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onBlur={
                                                handleBlur
                                            }
                                            isInvalid={
                                                touched.maxAppointmentsPerDay &&
                                                !!errors.maxAppointmentsPerDay
                                            }
                                        />

                                        <Form.Text className="text-muted">

                                            Maximum number
                                            of patients
                                            you can accept
                                            in one day.

                                        </Form.Text>

                                        <Form.Control.Feedback type="invalid">

                                            {
                                                errors.maxAppointmentsPerDay
                                            }

                                        </Form.Control.Feedback>

                                    </Form.Group>

                                    {/* Fee */}

                                    <Form.Group className="mb-4">

                                        <Form.Label>
                                            Consultation Fee
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            name="fee"
                                            placeholder="Enter consultation fee"
                                            value={
                                                values.fee
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onBlur={
                                                handleBlur
                                            }
                                            isInvalid={
                                                touched.fee &&
                                                !!errors.fee
                                            }
                                        />

                                        <Form.Control.Feedback type="invalid">

                                            {
                                                errors.fee
                                            }

                                        </Form.Control.Feedback>

                                    </Form.Group>

                                    {/* Submit */}

                                    <div className="d-grid">

                                        <Button
                                            type="submit"
                                            variant="success"
                                            size="lg"
                                        >
                                            Register Doctor
                                        </Button>

                                    </div>

                                </Form>
                            );
                        }}

                    </Formik>

                </Col>

            </Row>

        </Container>
    );
};

export default DoctorRegister;

