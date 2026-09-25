import { Button, Col, Container, Form, Row } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";



function EditUser() {
    const { Formik } = formik;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();
    const { users } = useSelector((state) => state.userState);
    const user = users.find((u) => u.id === Number(id));

   const schema = yup.object().shape({
    fullname: yup.string().required("Enter full name"),
    email: yup.string().email("Enter valid email").required("Email is required"),
    role: yup.string().required("Select a role"),
});

    const handleEditUser = (values) => { 

        values.id = Number(id);
        toast.success("User updated successfully");
        navigate("/user/list-users");
    };

    if (!user) {
        return (
            <Container className="mt-5">
                <h3 className="text-center">User not found</h3>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={5}>
                    <h2 className="text-center mb-4">Edit User</h2>

                    <Formik
                        validationSchema={schema}
                        onSubmit={handleEditUser}
                        initialValues={{
                            fullname: user.fullname,
                            email: user.email,
                            role: user.role,
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>

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

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>

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

                                <Form.Group className="mb-4">
                                    <Form.Label>Role</Form.Label>

                                    <Form.Select
                                        name="role"
                                        value={values.role}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                            touched.role && !!errors.role
                                        }
                                    >

                                    </Form.Select>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.role}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100"
                                >
                                    Update User
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
}

export default EditUser;