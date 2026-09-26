import { Table, Container, Row, Col, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { updaterole, updateStatus } from "../redux/userSlice";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function ListUser() {
    const { users, user } = useSelector((state) => state.userState);
    const dispatch = useDispatch();

    if (!user || user.role !== "Admin") {
        return <Navigate to="/forbidden" />;
    }

    const handleUserRoleChange = (e, userId) => {
        dispatch(updaterole({ userId: userId, role: e.target.value}));
        
        toast.success("User role updated");
    };

    const handleUserStatusChange = (userId, currentStatus) => {
        dispatch(updateStatus({ userId: userId, status: !currentStatus}));

        toast.success("User status updated");
    };

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <h3>User List</h3>
                </Col>
            </Row>

            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u, i) => (
                        <tr key={u.id}>
                            <td>{i + 1}</td>
                            <td>{u.fullname}</td>
                            <td>{u.email}</td>

                            <td>
                                <Form.Select
                                    value={u.role}
                                    onChange={(e) => handleUserRoleChange(e, u.id)}
                                >
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                     <option value="Doctor">Doctor</option>
                                </Form.Select>
                            </td>

                            <td>
                                <Form.Check
                                    type="switch"
                                    id={u.id}
                                    label={u.status ? "Active" : "Inactive"}
                                    checked={!!u.status}
                                    onChange={() => handleUserStatusChange(u.id, u.status)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default ListUser;