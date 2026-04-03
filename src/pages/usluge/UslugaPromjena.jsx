import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import UslugeService from "../../services/usluge/UslugeService";
import { useEffect, useState } from "react";

export default function UslugaPromjena(){
    
    const params = useParams()
    const [usluga,setUsluga] = useState({})
    const [aktivan,setAktivan] = useState(false)

    const navigate = useNavigate()

    async function ucitajUsluga() {
        await UslugeService.getBySifra(params.sifra).then((odgovor)=>{

            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            
            const s = odgovor.data
            
            s.datumPokretanja = s.datumPokretanja.substring(0,10)
            
            setUsluga(s)

            setAktivan(s.aktivan)
        })
    }

    useEffect(()=>{
        ucitajUsluga()
    },[])

    async function Promjeni(usluga){
        await UslugeService.promjeni(params.sifra,usluga).then(()=>{
            navigate(RouteNames.USLUGE)
        })
    }


    function odradiSubmit(e){ 
        e.preventDefault() 
        const podaci = new FormData(e.target)

        // --- KONTROLA 1: Naziv (Postojanje) ---
if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
    alert("Naziv je obavezan i ne smije sadržavati samo razmake!")
    return
}

// --- KONTROLA 2: Naziv (Minimalna duljina) ---
if (podaci.get('naziv').trim().length < 3) {
    alert("Naziv usluge mora imati najmanje 3 znaka!")
    return
}

// --- KONTROLA 3: Trajanje (Logički raspon) ---
if (isNaN(podaci.get('trajanje')) || podaci.get('trajanje') < 1 || podaci.get('trajanje') > 500) {
    alert("Trajanje mora biti broj između 1 i 500 sati!")
    return
}

// --- KONTROLA 4: Cijena (postojanje + nenegativna) ---
if (!podaci.get('cijena') || podaci.get('cijena') === "") {
    alert("Obavezno cijena usluge!")
    return
}

if (podaci.get('cijena') < 0) {
    alert("Cijena ne može biti negativan broj!")
    return
}

// --- KONTROLA 5: Datum pokretanja (postojanje + ne u prošlosti) ---
if (!podaci.get('datumPokretanja') || podaci.get('datumPokretanja') === "") {
    alert("Morate odabrati datum pokretanja!")
    return
}

const odabraniDatum = new Date(podaci.get('datumPokretanja'))
const danas = new Date()
danas.setHours(0, 0, 0, 0)

if (odabraniDatum < danas) {
    alert("Datum pokretanja ne može biti u prošlosti!")
    return
}

        Promjeni({ 
            naziv: podaci.get('naziv'),
            trajanje: parseInt(podaci.get('trajanje')),
            cijena: parseFloat(podaci.get('cijena')),
            datumPokretanja: new Date(podaci.get('datumPokretanja')).toISOString(),
            aktivan: podaci.get('aktivan') === 'on'
        })
    }

    return(
        <>
        <h3>
            Unos nove usluge
        </h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required 
                defaultValue={usluga.naziv} />
            </Form.Group>

            <Form.Group controlId="trajanje">
                <Form.Label>Trajanje</Form.Label>
                <Form.Control type="number" name="trajanje" step={1} 
                defaultValue={usluga.trajanje}/>
            </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" name="cijena" step={0.01} 
                defaultValue={usluga.cijena}/>
            </Form.Group>

            <Form.Group controlId="datumPokretanja">
                <Form.Label>Datum pokretanja usluge</Form.Label>
                <Form.Control type="date" name="datumPokretanja" 
                defaultValue={usluga.datumPokretanja}/>
            </Form.Group>

            <Form.Group controlId="aktivan">
                <Form.Check label="Aktivan" name="aktivan" 
                checked={aktivan}
                onChange={(e)=>{setAktivan(e.target.checked)}}
                />
            </Form.Group>

            <hr style={{marginTop: '50px', border: '0'}} />

            <Row>
                <Col>
                    <Link to={RouteNames.USLUGE} className="btn btn-danger">
                    Odustani
                    </Link>
                </Col>
                <Col>
                    <Button type="submit" variant="success">
                       Promjeni uslugu
                    </Button>
                </Col>
            </Row>

        </Form>

        <h3>Promjena usluge</h3>

<Form onSubmit={odradiSubmit}>
    <Container className="mt-4">
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title className="mb-4">Podaci o usluzi</Card.Title>

                {/* Naziv usluge */}
                <Row>
                    <Col xs={12}>
                        <Form.Group controlId="naziv" className="mb-3">
                            <Form.Label className="fw-bold">Naziv usluge</Form.Label>
                            <Form.Control
                                type="text"
                                name="naziv"
                                placeholder="Unesite naziv usluge"
                                required
                                defaultValue={usluga.naziv}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Trajanje i Cijena */}
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="trajanje" className="mb-3">
                            <Form.Label className="fw-bold">Trajanje (min)</Form.Label>
                            <Form.Control
                                type="number"
                                name="trajanje"
                                step={1}
                                placeholder="0"
                                defaultValue={usluga.trajanje}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="cijena" className="mb-3">
                            <Form.Label className="fw-bold">Cijena (€)</Form.Label>
                            <Form.Control
                                type="number"
                                name="cijena"
                                step={0.01}
                                placeholder="0,00"
                                defaultValue={usluga.cijena}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="align-items-center">
                    {/* Datum pokretanja */}
                    <Col md={6}>
                        <Form.Group controlId="datumPokretanja" className="mb-3">
                            <Form.Label className="fw-bold">Datum početka usluge</Form.Label>
                            <Form.Control
                                type="date"
                                name="datumPokretanja"
                                onClick={(e) => e.target.showPicker()}
                                onFocus={(e) => e.target.showPicker()}
                                defaultValue={usluga.datumPokretanja}
                            />
                        </Form.Group>
                    </Col>

                    {/* Aktivan */}
                    <Col md={6}>
                        <Form.Group controlId="aktivan" className="mb-3 mt-md-3">
                            <Form.Check
                                type="switch"
                                label="Usluga je aktivna"
                                name="aktivan"
                                className="fs-5"
                                checked={aktivan}
                                onChange={(e) => setAktivan(e.target.checked)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <hr />

                {/* Gumbi */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                    <Link to={RouteNames.USLUGE} className="btn btn-danger px-4">
                        Odustani
                    </Link>

                    <Button type="submit" variant="success">
                        Promijeni uslugu
                    </Button>
                </div>
            </Card.Body>
        </Card>
    </Container>
</Form>

        </>
    )
}