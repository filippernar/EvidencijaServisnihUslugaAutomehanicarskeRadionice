import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import KlijentService from "../../services/klijent/KlijentService"
import { Button, Col, Form, Row } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { ShemaKlijent } from "../../schemas/ShemaKlijent"

export default function KlijentPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [klijent, setKlijent] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(()=>{
        ucitajKlijenta()
    },[])

    async function ucitajKlijenta() {
        await KlijentService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setKlijent(odgovor.data)
        })
    }

    async function promjeni(klijent) {
        await KlijentService.promjeni(params.sifra, klijent).then(()=>{
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
        promjeni(rezultat.data)
    }

    const ocistiGresku = (polje) => {
        if (errors[polje]) {
            const nove = { ...errors }
            delete nove[polje]
            setErrors(nove)
        }
    }

    return(
        <>
            <h3>Promjena klijenta</h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control
                        type="text"
                        name="ime"
                        defaultValue={klijent.ime}
                        isInvalid={!!errors.ime}
                        onFocus={() => ocistiGresku('ime')}
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
                        defaultValue={klijent.prezime}
                        isInvalid={!!errors.prezime}
                        onFocus={() => ocistiGresku('prezime')}
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
                        defaultValue={klijent.email}
                        isInvalid={!!errors.email}
                        onFocus={() => ocistiGresku('email')}
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
                        defaultValue={klijent.oib}
                        isInvalid={!!errors.oib}
                        onFocus={() => ocistiGresku('oib')}
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
                            Promjeni klijenta
                        </Button>
                    </Col>
                </Row>

            </Form>
        </>
    )
}
