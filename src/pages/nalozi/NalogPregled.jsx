import { useEffect, useState } from "react"
import NalogService from "../../services/nalozi/NalogService"
import UslugeService from "../../services/usluge/UslugeService"
import VoziloService from "../../services/vozilo/VoziloService" 
import KlijentService from "../../services/klijent/KlijentService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function NalogPregled(){

    const navigate = useNavigate()

    const [nalozi, setNalozi] = useState([])
    const [usluge, setUsluge] = useState([])
    const [vozila, setVozila] = useState([]) 
    const [klijenti, setKlijenti] = useState([])

    useEffect(()=>{
        ucitajPodatke()
    },[])

    async function ucitajPodatke() {
        await ucitajUsluge()
        await ucitajVozila()
        await ucitajKlijente()
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

    async function ucitajKlijente() {
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

    // --- POMOĆNE FUNKCIJE ---

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

    function dohvatiKlijenta(sifraKlijenta) {
        const klijent = klijenti.find(k => k.sifra === parseInt(sifraKlijenta))
        return klijent ? `${klijent.ime} ${klijent.prezime}` : 'Nepoznat klijent'
    }

    function izracunajUkupnoPoNalogu(sifreUsluga) {
        if (!sifreUsluga || !Array.isArray(sifreUsluga)) return 0;
        return sifreUsluga.reduce((suma, sifra) => {
            const usluga = usluge.find(u => u.sifra === parseInt(sifra));
            return suma + (usluga ? parseFloat(usluga.cijena) : 0);
        }, 0);
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
                        <th>Klijent</th>
                        <th>Usluge na nalogu</th>
                        <th>Iznos</th>
                        <th className="text-center">Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {nalozi && nalozi.map((nalog)=>(
                        <tr key={nalog.sifra}>
                            <td className="fw-semibold">{nalog.naziv}</td>
                            <td>{dohvatiVozilo(nalog.vozilo)}</td>
                            <td>{dohvatiKlijenta(nalog.klijent)}</td>
                            <td>{dohvatiNaziveUsluga(nalog.usluge)}</td>
                            <td className="fw-bold">
                                {new Intl.NumberFormat('hr-HR', { 
                                    style: 'currency', 
                                    currency: 'EUR' 
                                }).format(izracunajUkupnoPoNalogu(nalog.usluge))}
                            </td>
                            <td className="text-center">
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    onClick={()=>{navigate(`/nalozi/${nalog.sifra}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;
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
                            <td colSpan="6" className="text-center">Nema dostupnih naloga</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    )
}