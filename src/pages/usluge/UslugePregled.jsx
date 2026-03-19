import { useEffect, useState } from "react"
import UslugeService from "../../services/usluge/UslugeService"
import { Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import { GrValidate } from "react-icons/gr"
import FormatDatuma from "../../components/FormatDatuma"

export default function UslugePregled(){


    const [usluge, setUsluge] = useState([])


    useEffect(()=>{
        ucitajUsluge()
    },[])

    async function ucitajUsluge() {
        await UslugeService.get().then((odgovor)=>{
            setUsluge(odgovor.data)
        })
    }


    return(
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Trajanje</th>
                        <th>Cijena</th>
                        <th>Datum pokretanja</th>
                        <th>Aktivan</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {usluge && usluge.map((usluge)=>(
                        <tr>     
                            <td>{usluge.naziv}</td>
                            <td>{usluge.trajanje}</td>
                            <td>
                                <NumericFormat 
                                value={usluge.cijena}
                                displayType={'text'}
                                thousandSeparator='.'
                                decimalSeparator=','
                                suffix={' €'}
                                decimalScale={2}
                                fixedDecimalScale
                                />
                            </td>
                            <td>
                                <FormatDatuma datum={usluge.datumPokretanja} />

                            </td>
                            <td>
                                <GrValidate 
                                size={25}
                                color={usluge.aktivan ? 'green' : 'red'}
                                />
                            </td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}