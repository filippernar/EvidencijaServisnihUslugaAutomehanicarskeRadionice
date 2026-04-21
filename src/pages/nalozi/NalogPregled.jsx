import { useEffect, useState } from "react"
import NalogService from "../../services/nalozi/NalogService"
import UslugeService from "../../services/usluge/UslugeService"
import VoziloService from "../../services/vozilo/VoziloService" 
import KlijentService from "../../services/klijent/KlijentService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import NalogPDFGenerator from "../../components/NalogPDFGenerator"

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
        const odgovor = await NalogService.get()
        if(!odgovor.success){
            alert('Nije implementiran servis za naloge')
            return
        }
        setNalozi(odgovor.data)
    }

    async function ucitajUsluge() {
        const odgovor = await UslugeService.get()
        if(!odgovor.success){
            alert('Nije implementiran servis za usluge')
            return
        }
        setUsluge(odgovor.data)
    }
    
    async function ucitajVozila() {
        const odgovor = await VoziloService.get()
        if(!odgovor.success){
            alert('Nije implementiran servis za vozila')
            return
        }
        setVozila(odgovor.data)
    }

    async function ucitajKlijente() {
        const odgovor = await KlijentService.get()
        if(!odgovor.success){
            alert('Nije implementiran servis za klijente')
            return
        }
        setKlijenti(odgovor.data)
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati nalog?')) return;
        await NalogService.obrisi(sifra);
        ucitajNaloze();
    }

    // ---------------------------------------------------------
    // 🔥 PRAVI PDF GENERATOR – koristi tvoj NalogPDFGenerator.js
    // ---------------------------------------------------------
    function pokreniPDF(nalog) {

        const vozilo = vozila.find(v => v.sifra === nalog.vozilo)
        const klijent = klijenti.find(k => k.sifra === nalog.klijent)

        const odabraneUsluge = nalog.usluge
            .map(sifra => usluge.find(u => u.sifra === parseInt(sifra)))
            .filter(u => u)

        const ukupno = odabraneUsluge.reduce(
            (s, u) => s + parseFloat(u.cijena), 
            0
        )

        const generirajPDF = NalogPDFGenerator({
            nalog,
            vozilo,
            klijent,
            odabraneUsluge,
            ukupno
        })

        generirajPDF()
    }

    // --- POMOĆNE FUNKCIJE ---

    function dohvatiNaziveUsluga(sifreUsluga) {
        if (!sifreUsluga || sifreUsluga.length === 0) {
            return <i className="text-muted">Nema dodanih usluga</i>
        }
        return sifreUsluga
            .map(sifra => {
                const u = usluge.find(x => x.sifra === parseInt(sifra))
                return u ? u.naziv : "Nepoznata usluga"
            })
            .join(", ")
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
        return sifreUsluga.reduce((suma, sifra) => {
            const u = usluge.find(x => x.sifra === parseInt(sifra))
            return suma + (u ? parseFloat(u.cijena) : 0)
        }, 0)
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
                    {nalozi.map(nalog => (
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
                                    onClick={()=> navigate(`/nalozi/${nalog.sifra}`)}>
                                    Promjena
                                </Button>
                                &nbsp;
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => brisanje(nalog.sifra)}>
                                    Obriši
                                </Button>
                                &nbsp;
                                <Button 
                                    variant="info" 
                                    size="sm"
                                    onClick={() => pokreniPDF(nalog)}>
                                    PDF
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
