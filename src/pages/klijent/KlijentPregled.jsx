import { useEffect, useState } from "react"
import KlijentService from "../../services/klijent/KlijentService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function KlijentPregled() {

    const navigate = useNavigate()

    const [klijenti, setKlijenti] = useState([])
    const [sortField, setSortField] = useState("prezime")
    const [sortOrder, setSortOrder] = useState("asc")

    useEffect(() => {
        ucitajKlijente()
    }, [])

    async function ucitajKlijente() {
        await KlijentService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert("Nije implementiran servis")
                return
            }

            // inicijalno sortiranje po prezimenu uzlazno
            const sortirani = sortiraj(odgovor.data, "prezime", "asc")
            setKlijenti(sortirani)
            setSortField("prezime")
            setSortOrder("asc")
        })
    }

    function sortiraj(podaci, field, order) {
        if (!Array.isArray(podaci)) {
            return []
        }

        const sorted = [...podaci].sort((a, b) => {
            const valA = (a?.[field] ?? "").toString().toLowerCase()
            const valB = (b?.[field] ?? "").toString().toLowerCase()

            if (valA < valB) return order === "asc" ? -1 : 1
            if (valA > valB) return order === "asc" ? 1 : -1
            return 0
        })

        return sorted
    }

    function handleSort(field) {
        let newOrder = sortOrder

        if (field === sortField) {
            newOrder = sortOrder === "asc" ? "desc" : "asc"
        } else {
            newOrder = "asc"
        }

        setSortField(field)
        setSortOrder(newOrder)

        setKlijenti((prev) => sortiraj(prev, field, newOrder))
    }

    function ikona(field) {
        const isActive = field === sortField

        if (isActive) {
            return sortOrder === "asc" ? " ▲" : " ▼"
        }

        // neaktivni stupac prikazuje suprotnu strelicu
        return sortOrder === "asc" ? " ▼" : " ▲"
    }

    async function brisanje(sifra) {
        if (!confirm("Sigurno obrisati?")) return

        await KlijentService.obrisi(sifra)

        await KlijentService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert("Greška kod brisanja")
                return
            }

            setKlijenti(sortiraj(odgovor.data, sortField, sortOrder))
        })
    }

    // -----------------------------
    //  DODANO: prikaz poruke ako je lista prazna
    // -----------------------------
    if (klijenti.length === 0) {
        return (
            <div className="alert alert-info text-center my-4">
                Idi na <strong>PROGRAMI → GENERIRAJ PODATKE</strong>
            </div>
        )
    }

    return (
        <>
            <Link
                to={RouteNames.KLIJENT_NOVI}
                className="btn btn-success w-100 my-3"
            >
                Dodavanje novog klijenta
            </Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th
                            onClick={() => handleSort("ime")}
                            style={{ cursor: "pointer" }}
                        >
                            Ime{ikona("ime")}
                        </th>
                        <th
                            onClick={() => handleSort("prezime")}
                            style={{ cursor: "pointer" }}
                        >
                            Prezime{ikona("prezime")}
                        </th>
                        <th>Email</th>
                        <th>OIB</th>
                        <th>Akcija</th>
                    </tr>
                </thead>

                <tbody>
                    {klijenti && klijenti.map((klijent) => (
                        <tr key={klijent.sifra}>
                            <td>{klijent.ime}</td>
                            <td>{klijent.prezime}</td>
                            <td>{klijent.email}</td>
                            <td>{klijent.oib}</td>
                            <td>
                                <Button onClick={() => navigate(`/klijenti/${klijent.sifra}`)}>
                                    Promjeni
                                </Button>
                                &nbsp;&nbsp;
                                <Button
                                    variant="danger"
                                    onClick={() => brisanje(klijent.sifra)}
                                >
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
