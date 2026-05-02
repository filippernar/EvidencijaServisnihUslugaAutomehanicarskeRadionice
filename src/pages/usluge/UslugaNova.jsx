import { Form, Button, Row, Col, Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import UslugeService from "../../services/usluge/UslugeService";
import { useState } from "react";
import { ShemaUsluga } from "../../schemas/ShemaUsluga";

export default function UslugaNova() {

    const navigate = useNavigate();
    const [aktivan, setAktivan] = useState(true);
    const [errors, setErrors] = useState({});

    async function dodaj(usluga) {
        await UslugeService.dodaj(usluga).then(() => {
            navigate(RouteNames.USLUGE);
        });
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);
        const objekt = Object.fromEntries(podaci);

        // Pretvorbe brojeva
        objekt.trajanje = parseInt(objekt.trajanje);
        objekt.cijena = parseFloat(objekt.cijena);
        objekt.aktivan = aktivan;

        const rezultat = ShemaUsluga.safeParse(objekt);

        if (!rezultat.success) {
            const nove = {};
            rezultat.error.issues.forEach(issue => {
                const key = issue.path[0];
                if (!nove[key]) nove[key] = issue.message;
            });
            setErrors(nove);
            return;
        }

        setErrors({});
        dodaj(rezultat.data);
    }

    const ocistiGresku = (polje) => {
        if (errors[polje]) {
            const nove = { ...errors };
            delete nove[polje];
            setErrors(nove);
        }
    };

    return (
        <>
            <h3>Dodavanje nove usluge</h3>

            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o novoj usluzi</Card.Title>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv usluge</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            placeholder="Unesite naziv usluge"
                                            isInvalid={!!errors.naziv}
                                            onFocus={() => ocistiGresku("naziv")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.naziv}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="trajanje" className="mb-3">
                                        <Form.Label className="fw-bold">Trajanje (sati)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="trajanje"
                                            step={1}
                                            placeholder="0"
                                            isInvalid={!!errors.trajanje}
                                            onFocus={() => ocistiGresku("trajanje")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.trajanje}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="cijena" className="mb-3">
                                        <Form.Label className="fw-bold">Cijena (€)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="cijena"
                                            step={0.01}
                                            placeholder="0,00"
                                            isInvalid={!!errors.cijena}
                                            onFocus={() => ocistiGresku("cijena")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cijena}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="align-items-center">
                                <Col md={6}>
                                    <Form.Group controlId="datumPokretanja" className="mb-3">
                                        <Form.Label className="fw-bold">Datum početka usluge</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="datumPokretanja"
                                            onClick={(e) => e.target.showPicker()}
                                            onFocus={(e) => {
                                                e.target.showPicker();
                                                ocistiGresku("datumPokretanja");
                                            }}
                                            isInvalid={!!errors.datumPokretanja}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.datumPokretanja}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="aktivan" className="mb-3 mt-md-3">
                                        <Form.Check
                                            type="switch"
                                            label="Usluga je aktivna"
                                            name="aktivan"
                                            className="fs-5"
                                            checked={aktivan}
                                            onChange={(e) => setAktivan(e.target.checked)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.USLUGE} className="btn btn-danger px-4">
                                    Odustani
                                </Link>

                                <Button type="submit" variant="success" className="px-4">
                                    Dodaj uslugu
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    );
}
