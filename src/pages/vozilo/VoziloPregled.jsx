import { useEffect, useState } from "react"
import VoziloService from "../../services/vozilo/VoziloService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function VoziloPregled(){

    const navigate = useNavigate()

    const [vozila, setVozila] = useState([])

    useEffect(()=>{
        ucitajVozila()
    },[])

    async function ucitajVozila() {
        await VoziloService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setVozila(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati vozilo?')) return;
        await VoziloService.obrisi(sifra);
        await VoziloService.get().then((odgovor)=>{
            setVozila(odgovor.data)
        })
    }

    return(
        <>
        <Link to={RouteNames.VOZILA_NOVI}
        className="btn btn-success w-100 my-3">
            Dodavanje novog vozila
        </Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Registracija</th>
                    <th>Marka</th>
                    <th>Model</th>
                    <th>Godište</th>
                    <th>Kilometri</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {vozila && vozila.map((vozilo)=>(
                    <tr key={vozilo.sifra}>
                        <td className="lead">{vozilo.registracija}</td>
                        <td>{vozilo.marka}</td>
                        <td>{vozilo.model}</td>
                        <td>{vozilo.godiste}.</td>
                        <td>{vozilo.prijedeniKilometri} km</td>
                        <td>
                            <Button onClick={()=>{navigate(`/vozila/${vozilo.sifra}`)}}>
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={() => brisanje(vozilo.sifra)}>
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