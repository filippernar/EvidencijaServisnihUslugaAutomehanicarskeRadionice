import { useEffect, useState } from "react"
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import NalogService from "../../services/nalozi/NalogService"
import UslugeService from "../../services/usluge/UslugeService"
import VoziloService from "../../services/vozilo/VoziloService" // Dodano

export default function NalogNovi() {

    const navigate = useNavigate()
    const [usluge, setUsluge] = useState([])
    const [vozila, setVozila] = useState([]) // Dodano

    useEffect(() => {
        ucitajUsluge()
        ucitajVozila() // Dodano
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

    // Dodana funkcija za učitavanje vozila
    async function ucitajVozila() {
        await VoziloService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za vozila')
                return
            }
            setVozila(odgovor.data)
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

        if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
            alert("Naziv naloga je obavezan!");
            return;
        }

        if (podaci.get('naziv').trim().length < 3) {
            alert("Naziv naloga mora imati najmanje 3 znaka!");
            return;
        }

        if (!podaci.get('usluga') || podaci.get('usluga') === "") {
            alert("Morate odabrati uslugu!");
            return;
        }

        // --- KONTROLA ZA VOZILO ---
        if (!podaci.get('vozilo') || podaci.get('vozilo') === "") {
            alert("Morate odabrati vozilo!");
            return;
        }

        const odabranaUsluga = parseInt(podaci.get('usluga'));
        const odabranoVozilo = parseInt(podaci.get('vozilo')); // Dodano

        dodaj({
            naziv: podaci.get('naziv'),
            usluga: odabranaUsluga,
            vozilo: odabranoVozilo // Dodano
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

                            {/* Dodan Select za Vozilo */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="vozilo" className="mb-3">
                                        <Form.Label className="fw-bold">Vozilo</Form.Label>
                                        <Form.Select name="vozilo" required>
                                            <option value="">Odaberite vozilo</option>
                                            {vozila && vozila.map((v) => (
                                                <option key={v.sifra} value={v.sifra}>
                                                    {v.marka} {v.model} ({v.registracija})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

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