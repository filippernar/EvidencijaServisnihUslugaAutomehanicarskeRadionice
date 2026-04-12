import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import NalogService from "../../services/nalozi/NalogService"
import UslugaService from "../../services/usluge/UslugeService"
import VoziloService from "../../services/vozilo/VoziloService" 
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"

export default function NalogPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [nalog, setNalog] = useState({})
    const [usluge, setUsluge] = useState([])
    const [vozila, setVozila] = useState([]) 

    useEffect(()=>{
        ucitajNalog()
        ucitajUsluge()
        ucitajVozila() 
    },[])

    async function ucitajNalog() {
        await NalogService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za naloge')
                return
            }
            setNalog(odgovor.data)
        })
    }

    async function ucitajUsluge() {
        await UslugaService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za usluge')
                return
            }
            setUsluge(odgovor.data)
        })
    }

   
    async function ucitajVozila() {
        await VoziloService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za vozila')
                return
            }
            setVozila(odgovor.data)
        })
    }

    async function promjeni(nalog) {
        await NalogService.promjeni(params.sifra, nalog).then(()=>{
            navigate(RouteNames.NALOZI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)

        if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
            alert("Naziv naloga je obavezan!");
            return;
        }

        if (podaci.get('naziv').trim().length < 3) {
            alert("Naziv naloga mora imati najmanje 3 znaka!");
            return;
        }

        if (!podaci.get('usluga') || podaci.get('usluga') === "") {
            alert("Morate odabrati uslugu za ovaj nalog!");
            return;
        }

        // --- KONTROLA ZA VOZILO ---
        if (!podaci.get('vozilo') || podaci.get('vozilo') === "") {
            alert("Morate odabrati vozilo!");
            return;
        }

        const odabranaUsluga = parseInt(podaci.get('usluga'));
        const odabranoVozilo = parseInt(podaci.get('vozilo')); // Dodano

        promjeni({
            naziv: podaci.get('naziv'),
            usluga: odabranaUsluga,
            vozilo: odabranoVozilo 
        })
    }

    return(
         <>
            <h3>Promjena naloga</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o nalogu br. {nalog.sifra}</Card.Title>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv/Opis naloga</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            placeholder="Unesite naziv naloga"
                                            required
                                            defaultValue={nalog.naziv}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Dodan Select za Vozilo */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="vozilo" className="mb-3">
                                        <Form.Label className="fw-bold">Vozilo</Form.Label>
                                        <Form.Select 
                                            name="vozilo" 
                                            required 
                                            value={nalog.vozilo || ''} 
                                            onChange={(e) => setNalog({...nalog, vozilo: parseInt(e.target.value)})}
                                        >
                                            <option value="">Odaberite vozilo</option>
                                            {vozila && vozila.map((v) => (
                                                <option key={v.sifra} value={v.sifra}>
                                                    {v.marka} {v.model} ({v.registracija})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="usluga" className="mb-3">
                                        <Form.Label className="fw-bold">Dodijeljena usluga</Form.Label>
                                        <Form.Select 
                                            name="usluga" 
                                            required 
                                            value={nalog.usluga || ''} 
                                            onChange={(e) => setNalog({...nalog, usluga: parseInt(e.target.value)})}
                                        >
                                            <option value="">Odaberite uslugu</option>
                                            {usluge && usluge.map((u) => (
                                                <option key={u.sifra} value={u.sifra}>
                                                    {u.naziv} ({u.cijena} €)
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.NALOZI} className="btn btn-danger px-4">
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