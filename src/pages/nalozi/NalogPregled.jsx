import { useEffect, useState } from "react"
import NalogService from "../../services/nalozi/NalogService"
import UslugeService from "../../services/usluge/UslugeService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { GrValidate } from "react-icons/gr"

export default function NalogPregled(){

    const navigate = useNavigate()

    const [nalozi, setNalozi] = useState([])
    const [usluge, setUsluge] = useState([])

    useEffect(()=>{
        ucitajNaloze()
        ucitajUsluge()
    },[])

    async function ucitajNaloze() {
        await NalogService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za naloge')
                return
            }
            setNalozi(odgovor.data)
        })
    }

    async function ucitajUsluge() {
        await UslugeService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za usluge')
                return
            }
            setUsluge(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati nalog?')) return;
        await NalogService.obrisi(sifra);
        // Osvježavanje liste nakon brisanja
        ucitajNaloze();
    }

    function dohvatiNazivUsluge(sifraUsluge) {
        const usluga = usluge.find(u => u.sifra === sifraUsluge)
        return usluga ? usluga.naziv : 'Nepoznata usluga'
    }

    return(
        <>
        <Link to={RouteNames.NALOZI_NOVI}
        className="btn btn-success w-100 my-3">
            Dodavanje novog naloga
        </Link>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Naziv/Opis naloga</th>
                    <th>Usluga</th>
                    <th>Akcija</th>
                    <th>Aktivan</th>
                    
                    
                </tr>
            </thead>
            <tbody>
                {nalozi && nalozi.map((nalog)=>(
                    <tr key={nalog.sifra}>
                        <td className="lead">{nalog.naziv}</td>
                        <td>{dohvatiNazivUsluge(nalog.usluga)}</td>
                        
                        
                        <td>
                            <Button onClick={()=>{navigate(`/nalozi/${nalog.sifra}`)}}>
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={() => brisanje(nalog.sifra)}>
                                Obriši
                            </Button>
                            
                        </td>
                        
                    </tr>
                ))}
            </tbody>
        </Table>
        
        </>
    )
}   