import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import VoziloService from "../../services/vozilo/VoziloService"
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { ShemaVozilo } from "../../schemas/ShemaVozilo"

export default function VoziloPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [vozilo, setVozilo] = useState(null)

    const [errors, setErrors] = useState({})

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
        const objekt = Object.fromEntries(podaci)

        // Pretvorbe brojeva
        objekt.godiste = parseInt(objekt.godiste)
        objekt.kilometri = parseInt(objekt.prijedeniKilometri) || 0

        // --- ZOD VALIDACIJA ---
        const rezultat = ShemaVozilo.safeParse(objekt)

        if (!rezultat.success) {
            const nove = {}
            rezultat.error.issues.forEach(issue => {
                const key = issue.path[0]
                if (!nove[key]) nove[key] = issue.message
            })
            setErrors(nove)
            return
        }

        setErrors({})
        promjeni(rezultat.data)
    }

    const ocistiGresku = (polje) => {
        if (errors[polje]) {
            const nove = { ...errors }
            delete nove[polje]
            setErrors(nove)
        }
    }

    if (!vozilo) {
        return (
            <Container className="text-center mt-5">
                <p>Učitavam podatke o vozilu...</p>
            </Container>
        )
    }

    return(
        <>
            <h3>Promjena vozila</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">
                                Podaci o vozilu: {vozilo.registracija}
                            </Card.Title>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="registracija" className="mb-3">
                                        <Form.Label className="fw-bold">Registracija</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="registracija"
                                            defaultValue={vozilo.registracija}
                                            isInvalid={!!errors.registracija}
                                            onFocus={() => ocistiGresku('registracija')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.registracija}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="marka" className="mb-3">
                                        <Form.Label className="fw-bold">Marka</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="marka"
                                            defaultValue={vozilo.marka}
                                            isInvalid={!!errors.marka}
                                            onFocus={() => ocistiGresku('marka')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.marka}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="model" className="mb-3">
                                        <Form.Label className="fw-bold">Model</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="model"
                                            defaultValue={vozilo.model}
                                            isInvalid={!!errors.model}
                                            onFocus={() => ocistiGresku('model')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.model}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="godiste" className="mb-3">
                                        <Form.Label className="fw-bold">Godište</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="godiste"
                                            defaultValue={vozilo.godiste}
                                            isInvalid={!!errors.godiste}
                                            onFocus={() => ocistiGresku('godiste')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.godiste}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="prijedeniKilometri" className="mb-3">
                                        <Form.Label className="fw-bold">Prijeđeni kilometri</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="prijedeniKilometri"
                                            defaultValue={vozilo.kilometri}
                                            isInvalid={!!errors.kilometri}
                                            onFocus={() => ocistiGresku('kilometri')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.kilometri}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

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
