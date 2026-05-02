import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import UslugeService from "../../services/usluge/UslugeService"
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { ShemaUsluga } from "../../schemas/ShemaUsluga"

export default function UslugaPromjena(){

    const navigate = useNavigate()
    const params = useParams()

    const [usluga, setUsluga] = useState(null)
    const [aktivan, setAktivan] = useState(false)
    const [errors, setErrors] = useState({})

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

            if (s.datumPokretanja) {
                s.datumPokretanja = s.datumPokretanja.substring(0,10)
            }

            setUsluga(s)
            setAktivan(s.aktivan) // ostaje potpuno netaknuto
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
        const objekt = Object.fromEntries(podaci)

        // Pretvorbe brojeva
        objekt.trajanje = parseInt(objekt.trajanje) || 0
        objekt.cijena = parseFloat(objekt.cijena)

        // Datum
        if (objekt.datumPokretanja) {
            objekt.datumPokretanja = new Date(objekt.datumPokretanja).toISOString()
        }

        // AKTIVAN — ostaje iz state-a, ne dira se
        objekt.aktivan = aktivan

        // --- ZOD VALIDACIJA (bez aktivan) ---
        const rezultat = ShemaUsluga.safeParse(objekt)

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

    if (!usluga) {
        return (
            <Container className="text-center mt-5">
                <p>Učitavam podatke o usluzi...</p>
            </Container>
        )
    }

    return(
        <>
            <h3>Promjena usluge</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">
                                Podaci o usluzi: {usluga.naziv}
                            </Card.Title>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv usluge</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            defaultValue={usluga.naziv}
                                            isInvalid={!!errors.naziv}
                                            onFocus={() => ocistiGresku('naziv')}
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
                                        <Form.Label className="fw-bold">Trajanje (min)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="trajanje"
                                            defaultValue={usluga.trajanje}
                                            isInvalid={!!errors.trajanje}
                                            onFocus={() => ocistiGresku('trajanje')}
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
                                            step="0.01"
                                            name="cijena"
                                            defaultValue={usluga.cijena}
                                            isInvalid={!!errors.cijena}
                                            onFocus={() => ocistiGresku('cijena')}
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
                                        <Form.Label className="fw-bold">Datum početka</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="datumPokretanja"
                                            defaultValue={usluga.datumPokretanja}
                                            isInvalid={!!errors.datumPokretanja}
                                            onFocus={(e) => {
                                                ocistiGresku('datumPokretanja')
                                                e.target.showPicker()
                                            }}
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
