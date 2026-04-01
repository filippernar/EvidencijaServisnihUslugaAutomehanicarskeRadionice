import { Button, Col, Form, Row } from "react-bootstrap";
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
        </>
    )
}