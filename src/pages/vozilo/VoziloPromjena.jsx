import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import VoziloService from "../../services/vozilo/VoziloService"
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"

export default function VoziloPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [vozilo, setVozilo] = useState(null) 

    useEffect(()=>{
        ucitajVozilo()
    },[])

    async function ucitajVozilo() {
        await VoziloService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setVozilo(odgovor.data)
        })
    }

    async function promjeni(voziloPodaci) {
        await VoziloService.promjeni(params.sifra, voziloPodaci).then(()=>{
            navigate(RouteNames.VOZILA)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)

        // --- VALIDACIJA ---
        if (!podaci.get('registracija')?.trim()) {
            alert("Registracija je obavezna!");
            return;
        }

        const godiste = parseInt(podaci.get('godiste'));
        const trenutnaGodina = new Date().getFullYear();
        if (isNaN(godiste) || godiste < 1900 || godiste > trenutnaGodina + 1) {
            alert("Unesite ispravno godište vozila!");
            return;
        }

        promjeni({
            registracija: podaci.get('registracija'),
            marka: podaci.get('marka'),
            model: podaci.get('model'),
            godiste: godiste,
            prijedeniKilometri: parseInt(podaci.get('prijedeniKilometri')) || 0
        })
    }

    if (!vozilo) {
        return (
            <Container className="text-center mt-5">
                <p>Učitavam podatke o vozilu...</p>
            </Container>
        );
    }

    return(
         <>
            <h3>Promjena vozila</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o vozilu: {vozilo.registracija}</Card.Title>
                            
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="registracija" className="mb-3">
                                        <Form.Label className="fw-bold">Registracija</Form.Label>
                                        <Form.Control type="text" name="registracija" required 
                                        defaultValue={vozilo.registracija}/>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="marka" className="mb-3">
                                        <Form.Label className="fw-bold">Marka</Form.Label>
                                        <Form.Control type="text" name="marka" required 
                                        defaultValue={vozilo.marka}/>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="model" className="mb-3">
                                        <Form.Label className="fw-bold">Model</Form.Label>
                                        <Form.Control type="text" name="model" required 
                                        defaultValue={vozilo.model}/>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="godiste" className="mb-3">
                                        <Form.Label className="fw-bold">Godište</Form.Label>
                                        <Form.Control type="number" name="godiste" required 
                                        defaultValue={vozilo.godiste}/>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="prijedeniKilometri" className="mb-3">
                                        <Form.Label className="fw-bold">Prijeđeni kilometri</Form.Label>
                                        <Form.Control type="number" name="prijedeniKilometri" required 
                                        defaultValue={vozilo.prijedeniKilometri}/>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            {/* Gumbi posloženi desno kao u Uslugama */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.VOZILA} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success" className="px-4">
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