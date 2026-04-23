    import { Button, Card, Row, Col, Container } from "react-bootstrap";

export default function NalogPregledGrid({ 
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
        <Container className="py-3 px-0">
            <Row>
                {nalozi.map(nalog => (
                    <Col key={nalog.sifra} xs={12} md={6} className="mb-4">
                        <Card className="shadow-sm h-100">

                            {/* HEADER */}
                            <Card.Header className="bg-white py-3">
                                <span className="fw-bold text-primary" style={{ fontSize: "1.1rem" }}>
                                    {nalog.naziv}
                                </span>
                            </Card.Header>

                            {/* BODY */}
                            <Card.Body>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Vozilo:</span>
                                    <span className="fw-semibold">
                                        {dohvatiVozilo(nalog.vozilo)}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Klijent:</span>
                                    <span className="fw-semibold">
                                        {dohvatiKlijenta(nalog.klijent)}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Usluge:</span>
                                    <span className="fw-semibold text-end" style={{ maxWidth: "60%" }}>
                                        {dohvatiNaziveUsluga(nalog.usluge)}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Iznos:</span>
                                    <span className="fw-bold">
                                        {new Intl.NumberFormat("hr-HR", {
                                            style: "currency",
                                            currency: "EUR"
                                        }).format(izracunajUkupnoPoNalogu(nalog.usluge))}
                                    </span>
                                </div>

                            </Card.Body>

                            {/* FOOTER */}
                            <Card.Footer className="bg-light d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    className="flex-fill"
                                    onClick={() => navigate(`/nalozi/${nalog.sifra}`)}
                                >
                                    Promjena
                                </Button>

                                <Button
                                    variant="outline-danger"
                                    className="flex-fill"
                                    onClick={() => brisanje(nalog.sifra)}
                                >
                                    Obriši
                                </Button>

                                <Button
                                    variant="outline-info"
                                    className="flex-fill"
                                    onClick={() => pokreniPDF(nalog)}
                                >
                                    PDF
                                </Button>
                            </Card.Footer>

                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
