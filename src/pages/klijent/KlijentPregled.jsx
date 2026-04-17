import { useEffect, useState } from "react"
import KlijentService from "../../services/klijent/KlijentService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function KlijentPregled(){

    const navigate = useNavigate()

    const [klijenti, setKlijenti] = useState([])

    useEffect(()=>{
        ucitajKlijente()
    },[])

    async function ucitajKlijente() {
        await KlijentService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setKlijenti(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati?')) return;
        await KlijentService.obrisi(sifra);
        await KlijentService.get().then((odgovor)=>{
            setKlijenti(odgovor.data)
        })
    }

    return(
        <>
        <Link to={RouteNames.KLIJENT_NOVI}
        className="btn btn-success w-100 my-3">
            Dodavanje novog klijenta
        </Link>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Ime</th>
                    <th>Prezime</th>
                    <th>Email</th>
                    <th>OIB</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {klijenti && klijenti.map((klijent)=>(
                    <tr key={klijent.sifra}>
                        <td className="lead">{klijent.ime}</td>
                        <td className="lead">{klijent.prezime}</td>
                        <td>{klijent.email}</td>
                        <td>{klijent.oib}</td>
                        <td>
                            <Button onClick={()=>{navigate(`/klijenti/${klijent.sifra}`)}}>
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={() => brisanje(klijent.sifra)}>
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