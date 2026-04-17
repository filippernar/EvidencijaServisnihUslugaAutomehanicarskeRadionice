import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import KlijentService from "../../services/klijent/KlijentService"
import { Button, Col, Form, Row } from "react-bootstrap"
import { RouteNames } from "../../constants"

export default function KlijentPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [klijent, setKlijent] = useState({})

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

        // --- KONTROLA 1: Ime (Postojanje) ---
        if (!podaci.get('ime') || podaci.get('ime').trim().length === 0) {
            alert("Ime je obavezno i ne smije sadržavati samo razmake!");
            return;
        }

        // --- KONTROLA 2: Ime (Minimalna duljina) ---
        if (podaci.get('ime').trim().length < 2) {
            alert("Ime mora imati najmanje 2 znaka!");
            return;
        }

        // --- KONTROLA 3: Prezime (Postojanje) ---
        if (!podaci.get('prezime') || podaci.get('prezime').trim().length === 0) {
            alert("Prezime je obavezno i ne smije sadržavati samo razmake!");
            return;
        }

        // --- KONTROLA 4: Prezime (Minimalna duljina) ---
        if (podaci.get('prezime').trim().length < 2) {
            alert("Prezime mora imati najmanje 2 znaka!");
            return;
        }

        // --- KONTROLA 5: Email (Postojanje) ---
        if (!podaci.get('email') || podaci.get('email').trim().length === 0) {
            alert("Email je obavezan!");
            return;
        }

        // --- KONTROLA 6: Email (Format) ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(podaci.get('email'))) {
            alert("Email nije u ispravnom formatu!");
            return;
        }

        // --- KONTROLA 7: OIB (Postojanje) ---
        if (!podaci.get('oib') || podaci.get('oib').trim().length === 0) {
            alert("OIB je obavezan!");
            return;
        }

        // --- KONTROLA 8: OIB (Duljina) ---
        if (podaci.get('oib').trim().length !== 11) {
            alert("OIB mora imati točno 11 znamenki!");
            return;
        }

        // --- KONTROLA 9: OIB (Samo brojevi) ---
        if (!/^\d+$/.test(podaci.get('oib'))) {
            alert("OIB smije sadržavati samo brojeve!");
            return;
        }

        promjeni({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            email: podaci.get('email'),
            oib: podaci.get('oib')
        })
    }

    return(
         <>
            <h3>Promjena klijenta</h3>
            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required 
                    defaultValue={klijent.ime}/>
                </Form.Group>

                <Form.Group controlId="prezime" className="mt-2">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime" required 
                    defaultValue={klijent.prezime}/>
                </Form.Group>

                <Form.Group controlId="email" className="mt-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" required 
                    defaultValue={klijent.email}/>
                </Form.Group>

                <Form.Group controlId="oib" className="mt-2">
                    <Form.Label>OIB</Form.Label>
                    <Form.Control type="text" name="oib" required maxLength={11}
                    defaultValue={klijent.oib}/>
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