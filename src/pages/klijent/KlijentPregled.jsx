import { useEffect, useState } from "react"
import KlijentService from "../../services/klijent/KlijentService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function KlijentPregled(){

    const navigate = useNavigate()

    const [klijenti, setKlijenti] = useState([])
    const [sortField, setSortField] = useState("prezime") 
    const [sortOrder, setSortOrder] = useState("asc")     

    useEffect(()=>{
        ucitajKlijente()
    },[])

    async function ucitajKlijente() {
        await KlijentService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }

            setKlijenti(sortiraj(odgovor.data, sortField, sortOrder))
        })
    }

    function sortiraj(podaci) {
    podaci.sort((a, b) => {
        // Dodajemo '|| ""' kako bi spriječili pucanje ako je ime ili prezime null/undefined
        const prezimeA = (a.prezime || "").toLowerCase();
        const prezimeB = (b.prezime || "").toLowerCase();
        const imeA = (a.ime || "").toLowerCase();
        const imeB = (b.ime || "").toLowerCase();

        if (prezimeA < prezimeB) return -1;
        if (prezimeA > prezimeB) return 1;
        
        if (imeA < imeB) return -1;
        if (imeA > imeB) return 1;
        
        return 0;
    });
    return podaci;
}

    function handleSort(field) {
        let newOrder = sortOrder

        if (field === sortField) {
            newOrder = sortOrder === "asc" ? "desc" : "asc"
            setSortOrder(newOrder)
        } else {
            setSortField(field)
            newOrder = "asc"
            setSortOrder("asc")
        }

        setKlijenti(sortiraj(klijenti, field, newOrder))
    }

    //OBA STUPCA IMAJU ▲ ILI ▼
    function ikona(field) {
        const isActive = field === sortField

        if (isActive) {
            return sortOrder === "asc" ? " ▲" : " ▼"
        }

        // neaktivni stupac prikazuje SUPROTNU strelicu
        return sortOrder === "asc" ? " ▼" : " ▲"
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati?')) return;
        await KlijentService.obrisi(sifra);
        await KlijentService.get().then((odgovor)=>{
            setKlijenti(sortiraj(odgovor.data, sortField, sortOrder))
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
                    <th onClick={() => handleSort("ime")} style={{cursor:"pointer"}}>
                        Ime{ikona("ime")}
                    </th>
                    <th onClick={() => handleSort("prezime")} style={{cursor:"pointer"}}>
                        Prezime{ikona("prezime")}
                    </th>
                    <th>Email</th>
                    <th>OIB</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {klijenti && klijenti.map((klijent)=>(
                    <tr key={klijent.sifra}>
                        <td>{klijent.ime}</td>
                        <td>{klijent.prezime}</td>
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
