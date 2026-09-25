
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Forbidden() {

    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <Row className="justify-content-center text-center">
                <Col md={6}>

                 

                    <h2>Access Denied</h2>

                    <p className="text-muted mt-3">
                        Sorry, you don't have permission to access this page.
                        Please contact the administrator if you believe this
                        is a mistake.
                    </p>

                    <Button
                        variant="primary"
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </Button>

                </Col>
            </Row>
        </Container>
    );
}

export default Forbidden;

