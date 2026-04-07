import { useEffect, useState } from "react"
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import NalogService from "../../services/nalozi/NalogService"
import UslugeService from "../../services/usluge/UslugeService"

export default function NalogNovi() {

    const navigate = useNavigate()
    const [usluge, setUsluge] = useState([])

    useEffect(() => {
        ucitajUsluge()
    }, [])

    async function ucitajUsluge() {
        await UslugeService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za usluge')
                return
            }
            setUsluge(odgovor.data)
        })
    }

    async function dodaj(nalog) {
        await NalogService.dodaj(nalog).then(() => {
            navigate(RouteNames.NALOZI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        // --- KONTROLA 1: Naziv/Opis (Postojanje) ---
        if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
            alert("Naziv naloga je obavezan!");
            return;
        }

        // --- KONTROLA 2: Naziv (Minimalna duljina) ---
        if (podaci.get('naziv').trim().length < 3) {
            alert("Naziv naloga mora imati najmanje 3 znaka!");
            return;
        }

        // --- KONTROLA 3: Usluga (Postojanje) ---
        if (!podaci.get('usluga') || podaci.get('usluga') === "") {
            alert("Morate odabrati uslugu!");
            return;
        }

        // --- KONTROLA 4: Usluga (Validna vrijednost) ---
        const odabranaUsluga = parseInt(podaci.get('usluga'));
        if (isNaN(odabranaUsluga) || odabranaUsluga <= 0) {
            alert("Odabrana usluga nije valjana!");
            return;
        }

        dodaj({
            naziv: podaci.get('naziv'),
            usluga: odabranaUsluga
        })
    }

    return (
        <>
            <h3>Unos novog naloga</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o radnom nalogu</Card.Title>

                            {/* Naziv naloga */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv/Opis naloga</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            placeholder="Npr. Nalog za izmjenu ulja"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Usluga - Select dropdown */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="usluga" className="mb-3">
                                        <Form.Label className="fw-bold">Usluga</Form.Label>
                                        <Form.Select name="usluga" required>
                                            <option value="">Odaberite uslugu</option>
                                            {usluge && usluge.map((u) => (
                                                <option key={u.sifra} value={u.sifra}>
                                                    {u.naziv}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            {/* Gumbi za akciju */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.NALOZI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Dodaj novi nalog
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}