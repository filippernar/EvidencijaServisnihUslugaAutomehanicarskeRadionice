import { Form, Button, Row, Col, Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import UslugeService from "../../services/usluge/UslugeService";
import { useState } from "react"; 

export default function UslugaNova() {
    const navigate = useNavigate();
    
    const [aktivan, setAktivan] = useState(true); 

    async function dodaj(usluga) {
        await UslugeService.dodaj(usluga).then(() => {
            navigate(RouteNames.USLUGE);
        });
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        // --- KONTROLE ---
        if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
            alert("Naziv je obavezan!");
            return;
        }

        if (podaci.get('naziv').trim().length < 3) {
            alert("Naziv usluge mora imati najmanje 3 znaka!");
            return;
        }

        const trajanje = parseInt(podaci.get('trajanje'));
        if (isNaN(trajanje) || trajanje < 1 || trajanje > 500) {
            alert("Trajanje mora biti broj između 1 i 500 sati!");
            return;
        }

        const cijena = parseFloat(podaci.get('cijena'));
        if (isNaN(cijena) || cijena < 0) {
            alert("Cijena mora biti pozitivan broj!");
            return;
        }

        const datumRaw = podaci.get('datumPokretanja');
        if (!datumRaw) {
            alert("Morate odabrati datum!");
            return;
        }

        const odabraniDatum = new Date(datumRaw);
        if (isNaN(odabraniDatum.getTime())) {
            alert("Neispravan datum!");
            return;
        }

        dodaj({
            naziv: podaci.get('naziv'),
            trajanje: trajanje,
            cijena: cijena,
            datumPokretanja: odabraniDatum.toISOString(),
            aktivan: aktivan 
        });
    }

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
                                            required
                                        />
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
                                        />
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
                                        />
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
                                            onFocus={(e) => e.target.showPicker()}
                                        />
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