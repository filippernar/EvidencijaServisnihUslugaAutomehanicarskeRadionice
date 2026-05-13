import { useEffect, useState } from "react"
import VoziloService from "../../services/vozilo/VoziloService"
import { Button, Table, Pagination, Form, InputGroup } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { FaSearch } from "react-icons/fa"

export default function VoziloPregled(){

    const navigate = useNavigate()

    const [vozila, setVozila] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 5

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

    const filtriranaVozila = vozila.filter(v => {
        const term = searchTerm.toLowerCase()
        return (
            v.registracija.toLowerCase().includes(term) ||
            v.marka.toLowerCase().includes(term) ||
            v.model.toLowerCase().includes(term) ||
            (v.godiste + "").includes(term) ||
            (v.kilometri + "").includes(term)
        )
    })

    const totalPages = Math.ceil(filtriranaVozila.length / pageSize)

    const prikazanaVozila = filtriranaVozila.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    function promijeniStranicu(page) {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    function handleSearchChange(e) {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    if (vozila.length === 0) {
        return (
            <div className="alert alert-info text-center my-4">
                Idi na <strong>PROGRAMI → GENERIRAJ PODATKE</strong>
            </div>
        )
    }

    return(
        <>
        <Link to={RouteNames.VOZILA_NOVI}
        className="btn btn-success w-100 my-3">
            Dodavanje novog vozila
        </Link>

        <InputGroup className="mb-3">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
                type="text"
                placeholder="Pretraži vozila (registracija, marka, model)..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </InputGroup>

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

        <Pagination className="justify-content-center">
            <Pagination.Prev 
                onClick={() => promijeniStranicu(currentPage - 1)} 
                disabled={currentPage === 1} 
            />

            {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                    key={i}
                    active={i + 1 === currentPage}
                    onClick={() => promijeniStranicu(i + 1)}
                >
                    {i + 1}
                </Pagination.Item>
            ))}

            <Pagination.Next 
                onClick={() => promijeniStranicu(currentPage + 1)} 
                disabled={currentPage === totalPages} 
            />
        </Pagination>

        </>
    )
}
