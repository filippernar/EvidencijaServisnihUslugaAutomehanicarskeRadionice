import { Button, Col, Form, Row } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import VoziloService from "../../services/vozilo/VoziloService"

export default function VoziloNovi(){

    const navigate = useNavigate()

    async function dodaj(vozilo){
        await VoziloService.dodaj(vozilo).then(()=>{
            navigate(RouteNames.VOZILA)
        })
    }

    function odradiSubmit(e){ 
        e.preventDefault() 
        const podaci = new FormData(e.target)

        // --- KONTROLA 1: Registracija ---
        if (!podaci.get('registracija') || podaci.get('registracija').trim().length === 0) {
            alert("Registracija je obavezna!");
            return;
        }

        // --- KONTROLA 2: Marka ---
        if (!podaci.get('marka') || podaci.get('marka').trim().length === 0) {
            alert("Marka je obavezna!");
            return;
        }

        // --- KONTROLA 3: Model ---
        if (!podaci.get('model') || podaci.get('model').trim().length === 0) {
            alert("Model je obavezan!");
            return;
        }

        // --- KONTROLA 4: Godište ---
        const godiste = parseInt(podaci.get('godiste'));
        const trenutnaGodina = new Date().getFullYear();
        if (isNaN(godiste) || godiste < 1900 || godiste > trenutnaGodina + 1) {
            alert("Unesite ispravno godište vozila (1900 - " + (trenutnaGodina + 1) + ")!");
            return;
        }

        // --- KONTROLA 5: Prijeđeni kilometri ---
        const kilometri = parseInt(podaci.get('prijedeniKilometri'));
        if (isNaN(kilometri) || kilometri < 0) {
            alert("Prijeđeni kilometri moraju biti pozitivan broj!");
            return;
        }

        dodaj({
            registracija: podaci.get('registracija'),
            marka: podaci.get('marka'),
            model: podaci.get('model'),
            godiste: godiste,
            kilometri: kilometri
        })
    }

    return (
        <>
            <h3>Unos novog vozila</h3>
            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="registracija">
                    <Form.Label>Registracija</Form.Label>
                    <Form.Control type="text" name="registracija" required />
                </Form.Group>

                <Form.Group controlId="marka">
                    <Form.Label>Marka</Form.Label>
                    <Form.Control type="text" name="marka" required />
                </Form.Group>

                <Form.Group controlId="model">
                    <Form.Label>Model</Form.Label>
                    <Form.Control type="text" name="model" required />
                </Form.Group>

                <Form.Group controlId="godiste">
                    <Form.Label>Godište</Form.Label>
                    <Form.Control type="number" name="godiste" required />
                </Form.Group>

                <Form.Group controlId="prijedeniKilometri">
                    <Form.Label>Prijeđeni kilometri</Form.Label>
                    <Form.Control type="number" name="prijedeniKilometri" required />
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