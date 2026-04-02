import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import VoziloService from "../../services/vozilo/VoziloService"
import { Button, Col, Form, Row, Container } from "react-bootstrap"
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

    // --- KLJUČNI DIO: Ako podaci još nisu učitani, vrati poruku učitavanja ---
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
                <Form.Group controlId="registracija">
                    <Form.Label>Registracija</Form.Label>
                    <Form.Control type="text" name="registracija" required 
                    defaultValue={vozilo.registracija}/>
                </Form.Group>

                <Form.Group controlId="marka">
                    <Form.Label>Marka</Form.Label>
                    <Form.Control type="text" name="marka" required 
                    defaultValue={vozilo.marka}/>
                </Form.Group>

                <Form.Group controlId="model">
                    <Form.Label>Model</Form.Label>
                    <Form.Control type="text" name="model" required 
                    defaultValue={vozilo.model}/>
                </Form.Group>

                <Form.Group controlId="godiste">
                    <Form.Label>Godište</Form.Label>
                    <Form.Control type="number" name="godiste" required 
                    defaultValue={vozilo.godiste}/>
                </Form.Group>

                <Form.Group controlId="prijedeniKilometri">
                    <Form.Label>Prijeđeni kilometri</Form.Label>
                    <Form.Control type="number" name="prijedeniKilometri" required 
                    defaultValue={vozilo.prijedeniKilometri}/>
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.VOZILA} className="btn btn-danger w-100">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success" className="w-100">
                            Promjeni vozilo
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}