import React from "react";
import {Button,Col,Container,Form,Row,}from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import { toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useDispatch}from "react-redux";
import {userRegister} from "../src/redux/userSlice";

const Register = () => {
    const { Formik } = formik;
    const dispatch = useDispatch();
    const navigate = useNavigate();

   
const schema = yup.object().shape({
    fullname: yup.string().required("Enter a valid username"),
    email: yup.string().email("Enter a valid email").required("Enter email"),
    password: yup.string().required("Enter password"),
    role: yup.string().required("Please select account type"),
});



    const handleRegister = (values) => {
        if (values.role === "Doctor") {
            const doctorAccount = {
                id: Date.now() + Math.random(),
                fullname: values.fullname,
                email: values.email,
                password: values.password,
                role: "Doctor",
                status: true,
            };

            localStorage.setItem("doctorRegistration", JSON.stringify(doctorAccount));

           
            navigate("/doctor-register");
            return;
        }

      

        const newUser = {
            id: Date.now() + Math.random(),
            fullname: values.fullname,
            email: values.email,
            password: values.password,
            role: "User",
            status: true,
        };

        dispatch(userRegister(newUser));

        toast.success("User registered successfully");

        navigate("/login");
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={4}>
                    <h2 className="text-center mb-4 text-primary">
                        USER REGISTER
                    </h2>

                    <Formik
                        validationSchema={schema}
                        onSubmit={handleRegister}
                        initialValues={{
                            fullname: "",
                            email: "",
                            password: "",
                            role: "",
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
                            <Form noValidate onSubmit={handleSubmit}>
                               
                                <Form.Group
                                    className="mb-3"
                                    controlId="registerFullname"
                                >
                                    <Form.Label>
                                        Full Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullname"
                                        placeholder="Full name"
                                        value={values.fullname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.fullname && !errors.fullname}
                                        isInvalid={touched.fullname && !!errors.fullname}
                                    />
                                    <Form.Control.Feedback>
                                        Looks good!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullname}
                                    </Form.Control.Feedback>
                                </Form.Group>

                               
                                <Form.Group
                                    className="mb-3"
                                    controlId="registerEmail"
                                >
                                    <Form.Label>
                                        Enter Email
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.email && !errors.email}
                                        isInvalid={touched.email && !!errors.email}
                                    />
                                    <Form.Control.Feedback>
                                        Looks good!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                               
                                <Form.Group
                                    className="mb-3"
                                    controlId="registerPassword"
                                >
                                    <Form.Label>
                                        Enter Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.password && !errors.password}
                                        isInvalid={touched.password && !!errors.password}
                                    />
                                    <Form.Control.Feedback>
                                        Looks good!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>

                               
                                <Form.Group
                                    className="mb-3"
                                    controlId="registerRole"
                                >
                                    <Form.Label>
                                        Account Type
                                    </Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={values.role}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.role && !errors.role}
                                        isInvalid={touched.role && !!errors.role}
                                    >
                                        {/* <option value="">
                                            Select account type
                                        </option> */}
                                        <option value="User">
                                            User
                                        </option>
                                        <option value="Doctor">
                                            Doctor
                                        </option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.role}
                                    </Form.Control.Feedback>
                                </Form.Group>

                               
                                <div className="d-grid">
                                    <Button
                                        type="submit"
                                        size="lg"
                                    >
                                        Register
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;

