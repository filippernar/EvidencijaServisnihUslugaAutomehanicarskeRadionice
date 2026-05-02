import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import KlijentService from "../../services/klijent/KlijentService"
import { ShemaKlijent } from "../../schemas/ShemaKlijent"

export default function KlijentNovi(){

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    async function dodaj(klijent){
        await KlijentService.dodaj(klijent).then(()=>{
            navigate(RouteNames.KLIJENT_PREGLED)
        })
    }

    function odradiSubmit(e){ 
        e.preventDefault() 
        const podaci = new FormData(e.target)
        const objekt = Object.fromEntries(podaci)

        const rezultat = ShemaKlijent.safeParse(objekt)

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
            <h3>Unos novog klijenta</h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control
                        type="text"
                        name="ime"
                        isInvalid={!!errors.ime}
                        onFocus={() => ocistiGresku("ime")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.ime}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="prezime" className="mt-2">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control
                        type="text"
                        name="prezime"
                        isInvalid={!!errors.prezime}
                        onFocus={() => ocistiGresku("prezime")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.prezime}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email" className="mt-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        isInvalid={!!errors.email}
                        onFocus={() => ocistiGresku("email")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="oib" className="mt-2">
                    <Form.Label>OIB</Form.Label>
                    <Form.Control
                        type="text"
                        name="oib"
                        maxLength={11}
                        isInvalid={!!errors.oib}
                        onFocus={() => ocistiGresku("oib")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.oib}
                    </Form.Control.Feedback>
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.KLIJENT_PREGLED} className="btn btn-danger w-100">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success" className="w-100">
                            Dodaj novog klijenta
                        </Button>
                    </Col>
                </Row>

            </Form>
        </>
    )
}
