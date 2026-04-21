import { useEffect, useState } from "react"
import { Form, Button, Row, Col, Container, Card, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import NalogService from "../../services/nalozi/NalogService"
import UslugaService from "../../services/usluge/UslugeService"
import VoziloService from "../../services/vozilo/VoziloService"
import KlijentService from "../../services/klijent/KlijentService" 

export default function NalogNovi() {

    const navigate = useNavigate()
    const [vozila, setVozila] = useState([])
    const [klijenti, setKlijenti] = useState([]) 
    const [usluge, setUsluge] = useState([])
    const [odabraneUsluge, setOdabraneUsluge] = useState([])
    const [pretragaUsluga, setPretragaUsluga] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)

    useEffect(() => {
        ucitajVozila()
        ucitajKlijente()
        ucitajUsluge()
    }, [])

    async function ucitajVozila() {
        await VoziloService.get().then((odgovor) => {
            if (odgovor.success) setVozila(odgovor.data)
        })
    }

    async function ucitajKlijente() { 
        await KlijentService.get().then((odgovor) => {
            if (odgovor.success) setKlijenti(odgovor.data)
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

    function dodajUslugu(usluga) {
        if (!odabraneUsluge.find(u => u.sifra === usluga.sifra)) {
            setOdabraneUsluge([...odabraneUsluge, usluga])
        }
        setPretragaUsluga('')
        setPrikaziAutocomplete(false)
        setOdabraniIndex(-1)
    }

    function ukloniUslugu(sifra) {
        setOdabraneUsluge(odabraneUsluge.filter(u => u.sifra !== sifra))
    }

    function filtrirajUsluge() {
        if (!pretragaUsluga) return []
        return usluge.filter(u =>
            !odabraneUsluge.find(ou => ou.sifra === u.sifra) &&
            u.naziv.toLowerCase().includes(pretragaUsluga.toLowerCase())
        )
    }

    function handleKeyDown(e) {
        const filtrirane = filtrirajUsluge()

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOdabraniIndex(prev =>
                prev < filtrirane.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setOdabraniIndex(prev => prev > 0 ? prev - 1 : 0)
        } else if (e.key === 'Enter' && odabraniIndex >= 0 && filtrirane.length > 0) {
            e.preventDefault()
            dodajUslugu(filtrirane[odabraniIndex])
        } else if (e.key === 'Escape') {
            setPrikaziAutocomplete(false)
            setOdabraniIndex(-1)
        }
    }

    async function dodaj(nalog) {
        await NalogService.dodaj(nalog).then(() => {
            navigate(RouteNames.NALOZI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        dodaj({
            naziv: podaci.get('naziv'),
            vozilo: parseInt(podaci.get('vozilo')),
            klijent: parseInt(podaci.get('klijent')), 
            usluge: odabraneUsluge.map(u => u.sifra)
        })
    }

    //IZRAČUNAJ UKUPAN IZNOS ZA PLAĆANJE
function izracunajUkupno() {
    return odabraneUsluge.reduce((suma, u) => suma + (parseFloat(u.cijena) || 0), 0);
}
    return (
        <>
            <h3>Unos novog naloga</h3>
            
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Row>
                        {/* Lijeva strana - Podaci o nalogu */}
                        <Col md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="mb-4">Podaci o nalogu</Card.Title>
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label className="fw-bold">Naziv/Opis naloga</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            placeholder="Npr. Servis kočnica"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="vozilo" className="mb-3">
                                        <Form.Label className="fw-bold">Vozilo</Form.Label>
                                        <Form.Select name="vozilo" required>
                                            <option value="">Odaberite vozilo</option>
                                            {vozila && vozila.map((v) => (
                                                <option key={v.sifra} value={v.sifra}>
                                                    {v.marka} {v.model} ({v.registracija}, {v.kilometri})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
            
                                    <Form.Group controlId="klijent" className="mb-3">
                                        <Form.Label className="fw-bold">Klijent</Form.Label>
                                        <Form.Select name="klijent" required>
                                            <option value="">Odaberite klijenta</option>
                                            {klijenti && klijenti.map((k) => (
                                                <option key={k.sifra} value={k.sifra}>
                                                    {k.ime} {k.prezime}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
    
    {/* IZRAČUNAJ UKUPNO*/}

    <div className="mt-4 border-top pt-3">
        <p className="text-muted mb-0">Ukupan iznos za plaćanje:</p>
        <h2 className="text-primary fw-bold">
            {new Intl.NumberFormat('hr-HR', { 
                style: 'currency', 
                currency: 'EUR' 
            }).format(izracunajUkupno())}
        </h2>
    </div>
                                    
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Desna strana - Usluge */}
                        <Col md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="mb-4">Usluge na nalogu</Card.Title>

                                    <Form.Group className="mb-3 position-relative">
                                        <Form.Label className="fw-bold">Dodaj uslugu</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Pretraži usluge..."
                                            value={pretragaUsluga}
                                            onChange={(e) => {
                                                setPretragaUsluga(e.target.value)
                                                setPrikaziAutocomplete(e.target.value.length > 0)
                                                setOdabraniIndex(-1)
                                            }}
                                            onFocus={() => setPrikaziAutocomplete(pretragaUsluga.length > 0)}
                                            onKeyDown={handleKeyDown}
                                        />
                                        {prikaziAutocomplete && filtrirajUsluge().length > 0 && (
                                            <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                                {filtrirajUsluge().map((u, index) => (
                                                    <div
                                                        key={u.sifra}
                                                        className="p-2"
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor: index === odabraniIndex ? '#007bff' : 'white',
                                                            color: index === odabraniIndex ? 'white' : 'black'
                                                        }}
                                                        onClick={() => dodajUslugu(u)}
                                                        onMouseEnter={() => setOdabraniIndex(index)}
                                                    >
                                                        {u.naziv}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Form.Group>

                                    {odabraneUsluge.length > 0 ? (
                                        <div style={{ overflow: 'auto', maxHeight: '300px' }}>
                                            <Table striped bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>Naziv usluge</th>
                                                        <th>Cijena</th>
                                                        <th style={{ width: '80px' }}>Akcija</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {odabraneUsluge.map(u => (
                                                        <tr key={u.sifra}>
                                                            <td>{u.naziv}</td>
                                                            <td>{u.cijena}</td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => ukloniUslugu(u.sifra)}
                                                                >
                                                                    Obriši
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <p className="text-muted text-center">Nema odabranih usluga</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <hr className="my-4" />

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Link to={RouteNames.NALOZI} className="btn btn-danger px-4"> Odustani </Link>
                        <Button type="submit" variant="success"> Dodaj novi nalog </Button>
                    </div>
                </Container>
            </Form>
        </>
    )
}