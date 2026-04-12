import { useEffect, useState } from "react"
import NalogService from "../../services/nalozi/NalogService"
import UslugeService from "../../services/usluge/UslugeService"
import VoziloService from "../../services/vozilo/VoziloService" 
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function NalogPregled(){

    const navigate = useNavigate()

    const [nalozi, setNalozi] = useState([])
    const [usluge, setUsluge] = useState([])
    const [vozila, setVozila] = useState([]) 

    useEffect(()=>{
        ucitajNaloze()
        ucitajUsluge()
        ucitajVozila() 
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

    
    async function ucitajVozila() {
        await VoziloService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za vozila')
                return
            }
            setVozila(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati nalog?')) return;
        await NalogService.obrisi(sifra);
        ucitajNaloze();
    }

    function dohvatiNazivUsluge(sifraUsluge) {
        const usluga = usluge.find(u => u.sifra === sifraUsluge)
        return usluga ? usluga.naziv : 'Nepoznata usluga'
    }

    
    function dohvatiVozilo(sifraVozila) {
        const vozilo = vozila.find(v => v.sifra === sifraVozila)
        return vozilo ? `${vozilo.marka} ${vozilo.model} (${vozilo.registracija})` : 'Nepoznato vozilo'
    }

    return(
        <>
        <Link to={RouteNames.NALOZI_NOVI}
        className="btn btn-success w-100 my-3">
            Dodavanje novog naloga
        </Link>
        <Table striped bordered hover className="align-middle shadow-sm">
            <thead>
                <tr>
                    <th>Naziv/Opis naloga</th>
                    <th>Vozilo</th> {}
                    <th>Usluga</th>
                    <th className="text-center">Akcija</th>
                </tr>
            </thead>
            <tbody>
                {nalozi && nalozi.map((nalog)=>(
                    <tr key={nalog.sifra}>
                        <td className="fw-semibold">{nalog.naziv}</td>
                        <td>{dohvatiVozilo(nalog.vozilo)}</td> {}
                        <td>{dohvatiNazivUsluge(nalog.usluga)}</td>
                        
                        <td className="text-center">
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={()=>{navigate(`/nalozi/${nalog.sifra}`)}}>
                                Promjena
                            </Button>
                            &nbsp;&nbsp;
                            <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={() => brisanje(nalog.sifra)}>
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