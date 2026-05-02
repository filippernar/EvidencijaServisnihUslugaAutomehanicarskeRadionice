import { useEffect, useState } from "react"
import { Form, Button, Row, Col, Container, Card, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import NalogService from "../../services/nalozi/NalogService"
import UslugaService from "../../services/usluge/UslugeService"
import VoziloService from "../../services/vozilo/VoziloService"
import KlijentService from "../../services/klijent/KlijentService"
import { ShemaNalog } from "../../schemas/ShemaNalog"

export default function NalogNovi() {

    const navigate = useNavigate()
    const [vozila, setVozila] = useState([])
    const [klijenti, setKlijenti] = useState([])
    const [usluge, setUsluge] = useState([])
    const [odabraneUsluge, setOdabraneUsluge] = useState([])
    const [pretragaUsluga, setPretragaUsluga] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        ucitajVozila()
        ucitajKlijente()
        ucitajUsluge()
    }, [])

    async function ucitajVozila() {
        const odgovor = await VoziloService.get()
        if (odgovor.success) setVozila(odgovor.data)
    }

    async function ucitajKlijente() {
        const odgovor = await KlijentService.get()
        if (odgovor.success) setKlijenti(odgovor.data)
    }

    async function ucitajUsluge() {
        const odgovor = await UslugaService.get()
        if (odgovor.success) setUsluge(odgovor.data)
    }

    function dodajUslugu(usluga) {
        if (!odabraneUsluge.find(u => u.sifra === usluga.sifra)) {
            setOdabraneUsluge([...odabraneUsluge, usluga])
        }
        setPretragaUsluga('')
        setPrikaziAutocomplete(false)
        setOdabraniIndex(-1)
        ocistiGresku("usluge")
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
            setOdabraniIndex(prev => prev < filtrirane.length - 1 ? prev + 1 : prev)
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
        await NalogService.dodaj(nalog)
        navigate(RouteNames.NALOZI)
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        const objekt = Object.fromEntries(podaci)

        objekt.vozilo = parseInt(objekt.vozilo)
        objekt.klijent = parseInt(objekt.klijent)
        objekt.usluge = odabraneUsluge.map(u => u.sifra)

        const rezultat = ShemaNalog.safeParse(objekt)

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

    function izracunajUkupno() {
        return odabraneUsluge.reduce((suma, u) => suma + (parseFloat(u.cijena) || 0), 0)
    }

    return (
        <>
            <h3>Unos novog naloga</h3>

            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Row>

                        {/* Lijeva strana */}
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
                                            isInvalid={!!errors.naziv}
                                            onFocus={() => ocistiGresku("naziv")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.naziv}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="vozilo" className="mb-3">
                                        <Form.Label className="fw-bold">Vozilo</Form.Label>
                                        <Form.Select
                                            name="vozilo"
                                            isInvalid={!!errors.vozilo}
                                            onFocus={() => ocistiGresku("vozilo")}
                                        >
                                            <option value="">Odaberite vozilo</option>
                                            {vozila.map(v => (
                                                <option key={v.sifra} value={v.sifra}>
                                                    {v.marka} {v.model} ({v.registracija})
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.vozilo}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="klijent" className="mb-3">
                                        <Form.Label className="fw-bold">Klijent</Form.Label>
                                        <Form.Select
                                            name="klijent"
                                            isInvalid={!!errors.klijent}
                                            onFocus={() => ocistiGresku("klijent")}
                                        >
                                            <option value="">Odaberite klijenta</option>
                                            {klijenti.map(k => (
                                                <option key={k.sifra} value={k.sifra}>
                                                    {k.ime} {k.prezime}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.klijent}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <div className="mt-4 border-top pt-3">
                                        <p className="text-muted mb-0">Ukupan iznos za plaćanje:</p>
                                        <h2 className="text-primary fw-bold">
                                            {new Intl.NumberFormat('hr-HR', {
                                                style: 'currency',
                                                currency: 'EUR',
                                                minimumFractionDigits: 2
                                            }).format(izracunajUkupno())}
                                        </h2>
                                    </div>

                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Desna strana */}
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
                                                ocistiGresku("usluge")
                                            }}
                                            onFocus={() => setPrikaziAutocomplete(pretragaUsluga.length > 0)}
                                            onKeyDown={handleKeyDown}
                                            isInvalid={!!errors.usluge}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.usluge}
                                        </Form.Control.Feedback>

                                        {prikaziAutocomplete && filtrirajUsluge().length > 0 && (
                                            <div className="position-absolute w-100 bg-white border rounded shadow-sm"
                                                 style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
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
                                                            <td>
                                                                {new Intl.NumberFormat('hr-HR', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                }).format(u.cijena)} €
                                                            </td>
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
                        <Link to={RouteNames.NALOZI} className="btn btn-danger px-4">Odustani</Link>
                        <Button type="submit" variant="success">Dodaj novi nalog</Button>
                    </div>

                </Container>
            </Form>
        </>
    )
}
