import React from "react";
import {Button,Col,Container,Form,Row} from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import {toast} from "react-toastify";
import {Link,useNavigate} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {userLogin} from "../src/redux/userSlice";

const Login = () => {
    const {Formik} = formik;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {users} = useSelector((state) => state.userState);

    const schema = yup.object().shape({
        email: yup.string().email("Enter a valid email").required("Enter email"),
        password: yup.string().required("Enter password"),
    });

    const handleLogin = (values) => {
        const user = users.find((u) => u.email === values.email);

        if (!user) {
            toast.error("User not found");
            return;
        }

        if (user.password !== values.password) {
            toast.error("Invalid credentials");
            return;
        }

        dispatch(userLogin(user));
        toast.success("Login successfully");
        navigate("/");
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={4}>
                    <h2 className="text-center mb-4 text-primary">
                        USER LOGIN
                    </h2>

                    <Formik
                        validationSchema={schema}
                        onSubmit={handleLogin}
                        initialValues={{
                            email: "",
                            password: ""
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            errors
                        }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="loginEmail"
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
                                    controlId="loginPassword"
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

                                <div className="d-grid">
                                    <Button type="submit">
                                        Login
                                    </Button>
                                </div>

                                <div className="text-center mt-3">
                                    <span>
                                        New customer?{" "}
                                    </span>

                                    <Link to="/register">
                                        Register here
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

