import { Button, Table } from "react-bootstrap";

export default function NalogPregledTablica({ 
    nalozi, 
    navigate, 
    brisanje, 
    pokreniPDF,
    dohvatiVozilo,
    dohvatiKlijenta,
    dohvatiNaziveUsluga,
    izracunajUkupnoPoNalogu
}) {

    return (
        <Table striped bordered hover responsive className="align-middle shadow-sm">
            <thead>
                <tr>
                    <th>Naziv/Opis naloga</th>
                    <th>Vozilo</th>
                    <th>Klijent</th>
                    <th>Usluge</th>
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
                                onClick={() => navigate(`/nalozi/${nalog.sifra}`)}
                            >
                                Promjena
                            </Button>
                            &nbsp;
                            <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => brisanje(nalog.sifra)}
                            >
                                Obriši
                            </Button>
                            &nbsp;
                            <Button 
                                variant="info" 
                                size="sm"
                                onClick={() => pokreniPDF(nalog)}
                            >
                                PDF
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
