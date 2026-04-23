import { useEffect, useState } from "react"
import UslugeService from "../../services/usluge/UslugeService"
import { Button, Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import { GrValidate } from "react-icons/gr"
import FormatDatuma from "../../components/FormatDatuma"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from 'react-router-dom';

export default function UslugePregled(){

    const [usluge, setUsluge] = useState([])
    const navigate = useNavigate();

    // 🔥 Sortiranje samo po NAZIVU
    const [sortOrder, setSortOrder] = useState("asc")

    useEffect(()=>{
        ucitajUsluge()
    },[])

    async function ucitajUsluge() {
        await UslugeService.get().then((odgovor)=>{

            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }

            setUsluge(sortiraj(odgovor.data, sortOrder))
        })
    }

    function sortiraj(lista, order) {
        return [...lista].sort((a, b) => {
            const A = a.naziv.toLowerCase()
            const B = b.naziv.toLowerCase()

            if (A < B) return order === "asc" ? -1 : 1
            if (A > B) return order === "asc" ? 1 : -1
            return 0
        })
    }

    function handleSort() {
        const newOrder = sortOrder === "asc" ? "desc" : "asc"
        setSortOrder(newOrder)
        setUsluge(sortiraj(usluge, newOrder))
    }

    // 🔥 Strelica uvijek prikazana
    function ikona() {
        return sortOrder === "asc" ? " ▲" : " ▼"
    }

    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await UslugeService.obrisi(sifra)
        ucitajUsluge()
    }

    return(
        <>
            <Link to={RouteNames.USLUGA_NOVA}
            className="btn btn-success w-100 mb-3 mt-3">
                Dodavanje nove usluge
            </Link>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th onClick={handleSort} style={{cursor:"pointer"}}>
                            Naziv{ikona()}
                        </th>              
                        <th>Trajanje</th>
                        <th>Cijena</th>
                        <th>Datum pokretanja</th>
                        <th>Aktivan</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {usluge && usluge.map((usluga)=>(
                        <tr key={usluga.sifra}>     
                            <td>{usluga.naziv}</td>
                            <td>{usluga.trajanje}</td>
                            <td>
                                <NumericFormat 
                                value={usluga.cijena}
                                displayType={'text'}
                                thousandSeparator='.'
                                decimalSeparator=','
                                suffix={' €'}
                                decimalScale={2}
                                fixedDecimalScale
                                />
                            </td>
                            <td>
                                <FormatDatuma datum={usluga.datumPokretanja} />
                            </td>
                            <td>
                                <GrValidate 
                                size={25}
                                color={usluga.aktivan ? 'green' : 'red'}
                                />
                            </td>
                            <td>
                                <Button onClick={()=>{navigate(`/usluge/${usluga.sifra}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{obrisi(usluga.sifra)}}>
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
