import { useEffect, useState } from "react"
import VoziloService from "../../services/vozilo/VoziloService"
import { Button, Table, Pagination } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

export default function VoziloPregled(){

    const navigate = useNavigate()

    const [vozila, setVozila] = useState([])

    // Straničenje
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 5  // broj vozila po stranici

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

    // Izračun stranica
    const totalPages = Math.ceil(vozila.length / pageSize)

    const prikazanaVozila = vozila.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    function promijeniStranicu(page) {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
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
                {prikazanaVozila.map((vozilo)=>(
                    <tr key={vozilo.sifra}>
                        <td>{vozilo.registracija}</td>
                        <td>{vozilo.marka}</td>
                        <td>{vozilo.model}</td>
                        <td>{vozilo.godiste}.</td>
                        <td>{vozilo.kilometri} km</td>
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

        {/*  Bootstrap Pagination */}
        <Pagination className="justify-content-center">
            <Pagination.Prev onClick={() => promijeniStranicu(currentPage - 1)} disabled={currentPage === 1} />

            {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                    key={i}
                    active={i + 1 === currentPage}
                    onClick={() => promijeniStranicu(i + 1)}
                >
                    {i + 1}
                </Pagination.Item>
            ))}

            <Pagination.Next onClick={() => promijeniStranicu(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>

        </>
    )
}
