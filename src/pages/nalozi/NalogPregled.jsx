import { useEffect, useState } from "react"
import NalogService from "../../services/nalozi/NalogService"
import UslugeService from "../../services/usluge/UslugeService"
import VoziloService from "../../services/vozilo/VoziloService" 
import KlijentService from "../../services/klijent/KlijentService" // Dodano
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function NalogPregled(){

    const navigate = useNavigate()

    const [nalozi, setNalozi] = useState([])
    const [usluge, setUsluge] = useState([])
    const [vozila, setVozila] = useState([]) 
    const [klijenti, setKlijenti] = useState([]) // Dodano

    useEffect(()=>{
        ucitajPodatke()
    },[])

    async function ucitajPodatke() {
        await ucitajUsluge()
        await ucitajVozila()
        await ucitajKlijente() // Dodano
        await ucitajNaloze()
    }

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

    async function ucitajKlijente() { // Dodano
        await KlijentService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za klijente')
                return
            }
            setKlijenti(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati nalog?')) return;
        await NalogService.obrisi(sifra);
        ucitajNaloze();
    }

    function dohvatiNaziveUsluga(sifreUsluga) {
        if (!sifreUsluga || !Array.isArray(sifreUsluga) || sifreUsluga.length === 0) {
            return <i className="text-muted">Nema dodanih usluga</i>
        }

        return sifreUsluga.map(sifra => {
            const usluga = usluge.find(u => u.sifra === parseInt(sifra));
            return usluga ? usluga.naziv : 'Nepoznata usluga';
        }).join(', ');
    }
    
    function dohvatiVozilo(sifraVozila) {
        const vozilo = vozila.find(v => v.sifra === parseInt(sifraVozila))
        return vozilo ? `${vozilo.marka} ${vozilo.model} (${vozilo.registracija})` : 'Nepoznato vozilo'
    }

    function dohvatiKlijenta(sifraKlijenta) { // Dodano
        const klijent = klijenti.find(k => k.sifra === parseInt(sifraKlijenta))
        return klijent ? `${klijent.ime} ${klijent.prezime}` : 'Nepoznat klijent'
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
                        <th>Vozilo</th>
                        <th>Klijent</th> {/* Dodana kolona */}
                        <th>Usluge na nalogu</th>
                        <th className="text-center">Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {nalozi && nalozi.map((nalog)=>(
                        <tr key={nalog.sifra}>
                            <td className="fw-semibold">{nalog.naziv}</td>
                            <td>{dohvatiVozilo(nalog.vozilo)}</td>
                            <td>{dohvatiKlijenta(nalog.klijent)}</td> {/* Prikaz klijenta */}
                            <td>{dohvatiNaziveUsluga(nalog.usluge)}</td>
                            
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
                    {(!nalozi || nalozi.length === 0) && (
                        <tr>
                            <td colSpan="5" className="text-center">Nema dostupnih naloga</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    )
}