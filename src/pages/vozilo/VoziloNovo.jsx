import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import VoziloService from "../../services/vozilo/VoziloService"
import { ShemaVozilo } from "../../schemas/ShemaVozilo"

export default function VoziloNovi(){

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    async function dodaj(vozilo){
        await VoziloService.dodaj(vozilo).then(()=>{
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
        dodaj(rezultat.data)
    }

    const ocistiGresku = (polje) => {
        if (errors[polje]) {
            const nove = { ...errors }
            delete nove[polje]
            setErrors(nove)
        }
    }

    return (
        <>
            <h3>Unos novog vozila</h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="registracija">
                    <Form.Label>Registracija</Form.Label>
                    <Form.Control
                        type="text"
                        name="registracija"
                        isInvalid={!!errors.registracija}
                        onFocus={() => ocistiGresku('registracija')}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.registracija}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="marka" className="mt-2">
                    <Form.Label>Marka</Form.Label>
                    <Form.Control
                        type="text"
                        name="marka"
                        isInvalid={!!errors.marka}
                        onFocus={() => ocistiGresku('marka')}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.marka}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="model" className="mt-2">
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                        type="text"
                        name="model"
                        isInvalid={!!errors.model}
                        onFocus={() => ocistiGresku('model')}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.model}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="godiste" className="mt-2">
                    <Form.Label>Godište</Form.Label>
                    <Form.Control
                        type="number"
                        name="godiste"
                        isInvalid={!!errors.godiste}
                        onFocus={() => ocistiGresku('godiste')}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.godiste}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="prijedeniKilometri" className="mt-2">
                    <Form.Label>Prijeđeni kilometri</Form.Label>
                    <Form.Control
                        type="number"
                        name="prijedeniKilometri"
                        isInvalid={!!errors.kilometri}
                        onFocus={() => ocistiGresku('kilometri')}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.kilometri}
                    </Form.Control.Feedback>
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.VOZILA} className="btn btn-danger w-100">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success" className="w-100">
                            Dodaj novo vozilo
                        </Button>
                    </Col>
                </Row>

            </Form>
        </>
    )
}
