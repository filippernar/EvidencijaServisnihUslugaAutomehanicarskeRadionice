import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import UslugeService from "../../services/usluge/UslugeService"
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"

export default function UslugaPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    
    // Postavljamo na null kako bismo znali kada su podaci stigli s backend-a
    const [usluga, setUsluga] = useState(null) 
    const [aktivan, setAktivan] = useState(false)

    useEffect(()=>{
        ucitajUslugu()
    },[])

    async function ucitajUslugu() {
        await UslugeService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije moguće učitati podatke o usluzi.')
                return
            }
            const s = odgovor.data
            // Formatiranje datuma za HTML input type="date"
            if (s.datumPokretanja) {
                s.datumPokretanja = s.datumPokretanja.substring(0,10)
            }
            setUsluga(s)
            setAktivan(s.aktivan)
        })
    }

    async function promjeni(uslugaPodaci) {
        await UslugeService.promjeni(params.sifra, uslugaPodaci).then(()=>{
            navigate(RouteNames.USLUGE)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)

        // --- VALIDACIJA ---
        if (!podaci.get('naziv')?.trim() || podaci.get('naziv').trim().length < 3) {
            alert("Naziv usluge mora imati najmanje 3 znaka!");
            return;
        }

        const cijena = parseFloat(podaci.get('cijena'));
        if (isNaN(cijena) || cijena < 0) {
            alert("Cijena mora biti pozitivan broj!");
            return;
        }

        promjeni({
            naziv: podaci.get('naziv'),
            trajanje: parseInt(podaci.get('trajanje')) || 0,
            cijena: cijena,
            datumPokretanja: podaci.get('datumPokretanja') ? new Date(podaci.get('datumPokretanja')).toISOString() : null,
            aktivan: aktivan // koristimo stanje iz switch-a
        })
    }

    // --- KLJUČNI DIO: Zaštita od renderiranja praznih podataka ---
    if (!usluga) {
        return (
            <Container className="text-center mt-5">
                <p>Učitavam podatke o usluzi...</p>
            </Container>
        );
    }

    return(
         <>
            <h3>Promjena usluge</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o usluzi: {usluga.naziv}</Card.Title>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv usluge</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            defaultValue={usluga.naziv}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="trajanje" className="mb-3">
                                        <Form.Label className="fw-bold">Trajanje (min)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="trajanje"
                                            defaultValue={usluga.trajanje}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="cijena" className="mb-3">
                                        <Form.Label className="fw-bold">Cijena (€)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            name="cijena"
                                            defaultValue={usluga.cijena}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="align-items-center">
                                <Col md={6}>
                                    <Form.Group controlId="datumPokretanja" className="mb-3">
                                        <Form.Label className="fw-bold">Datum početka</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="datumPokretanja"
                                            defaultValue={usluga.datumPokretanja}
                                            onClick={(e) => e.target.showPicker()}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="aktivan" className="mb-3 mt-md-3">
                                        <Form.Check
                                            type="switch"
                                            label="Usluga je aktivna"
                                            checked={aktivan}
                                            onChange={(e) => setAktivan(e.target.checked)}
                                            className="fs-5"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.USLUGE} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Spremi promjene
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}