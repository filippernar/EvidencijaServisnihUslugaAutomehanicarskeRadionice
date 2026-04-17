import { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr } from '@faker-js/faker';
import UslugeService from '../../services/usluge/UslugeService';
import VoziloService from '../../services/vozilo/VoziloService';
import KlijentService from '../../services/klijent/KlijentService';
import NalogService from '../../services/nalozi/NalogService';


export default function GeneriranjePodataka() {
    const [brojUsluga, setBrojUsluga] = useState(5);
    const [brojVozila, setBrojVozila] = useState(10);   
    const [brojKlijenata, setBrojKlijenata] = useState(10);
    const [brojNaloga, setBrojNaloga] = useState(5);
    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    const faker = new Faker({
        locale: [hr]
    });

    const generirajUsluge = async (broj) => {
        const tipoviUsluga = [
            'Zamjena ulja', 'Izmjena guma', 'Servis kočnica', 'Dijagnostika', 
            'Punjenje klime', 'Popravak ovjesa', 'Lakirarski radovi', 
            'Čišćenje DPF-a', 'Veliki servis', 'Mali servis'
        ];

        for (let i = 0; i < broj; i++) {
            await UslugeService.dodaj({
                naziv: tipoviUsluga[i % tipoviUsluga.length] + (i >= tipoviUsluga.length ? ` ${Math.floor(i / tipoviUsluga.length) + 1}` : ''),
                cijena: faker.number.float({ min: 20, max: 500, precision: 0.01 }).toFixed(2)
            });
        }
    };

    const generirajKlijente = async (broj) => {
        for (let i = 0; i < broj; i++) {
            await KlijentService.dodaj({
                ime: faker.person.firstName(),
                prezime: faker.person.lastName(),
                telefon: faker.phone.number(),
                email: faker.internet.email()
            });
        }
    };

    const generirajVozila = async (broj) => {
        const marke = ['Volkswagen', 'BMW', 'Audi', 'Mercedes', 'Opel', 'Renault'];
        for (let i = 0; i < broj; i++) {
            await VoziloService.dodaj({
                marka: marke[faker.number.int({ min: 0, max: marke.length - 1 })],
                model: faker.vehicle.model(),
                registracija: faker.vehicle.vrm(),
                godinaProizvodnje: faker.number.int({ min: 2000, max: 2024 })
            });
        }
    };

    const generirajNaloze = async (broj) => {
        const resUsluge = await UslugeService.get();
        const resVozila = await VoziloService.get();
        const resKlijenti = await KlijentService.get();

        if (resUsluge.data.length === 0 || resVozila.data.length === 0 || resKlijenti.data.length === 0) {
            throw new Error('Prvo generirajte usluge, vozila i klijente.');
        }

        for (let i = 0; i < broj; i++) {
            const randomVozilo = resVozila.data[faker.number.int({ min: 0, max: resVozila.data.length - 1 })];
            const randomKlijent = resKlijenti.data[faker.number.int({ min: 0, max: resKlijenti.data.length - 1 })];
            
            // Odaberi 1-3 nasumične usluge
            const nasumicneUsluge = [];
            const brojNasumicnih = faker.number.int({ min: 1, max: 3 });
            for(let j=0; j < brojNasumicnih; j++) {
                nasumicneUsluge.push(resUsluge.data[faker.number.int({ min: 0, max: resUsluge.data.length - 1 })].sifra);
            }

            await NalogService.dodaj({
                naziv: 'Radni nalog ' + faker.string.numeric(5),
                vozilo: randomVozilo.sifra,
                klijent: randomKlijent.sifra,
                usluge: nasumicneUsluge
            });
        }
    };

    // --- HANDLERI ---

    const izvrsiAkciju = async (akcija, naziv) => {
        setLoading(true);
        setPoruka(null);
        try {
            await akcija();
            setPoruka({ tip: 'success', tekst: `Uspješno: ${naziv}` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const obrisiSve = async (Service, naziv) => {
        if (!window.confirm(`Obriši sve iz: ${naziv}?`)) return;
        setLoading(true);
        try {
            const res = await Service.get();
            for (const item of res.data) {
                await Service.obrisi(item.sifra);
            }
            setPoruka({ tip: 'success', tekst: `Obrisano sve iz: ${naziv}` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h1>Generiranje podataka</h1>
            <p className="text-muted">Alat za popunjavanje baze testnim podacima.</p>

            {poruka && <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>{poruka.tekst}</Alert>}

            <Row>
                <Col md={3}>
                    <Form.Label>Broj usluga</Form.Label>
                    <Form.Control type="number" value={brojUsluga} onChange={(e) => setBrojUsluga(parseInt(e.target.value))} />
                    <Button className="w-100 mt-2" onClick={() => izvrsiAkciju(() => generirajUsluge(brojUsluga), 'Usluge')} disabled={loading}>Generiraj Usluge</Button>
                </Col>
                <Col md={3}>
                    <Form.Label>Broj klijenata</Form.Label>
                    <Form.Control type="number" value={brojKlijenata} onChange={(e) => setBrojKlijenata(parseInt(e.target.value))} />
                    <Button className="w-100 mt-2" onClick={() => izvrsiAkciju(() => generirajKlijente(brojKlijenata), 'Klijenti')} disabled={loading}>Generiraj Klijente</Button>
                </Col>
                <Col md={3}>
                    <Form.Label>Broj vozila</Form.Label>
                    <Form.Control type="number" value={brojVozila} onChange={(e) => setBrojVozila(parseInt(e.target.value))} />
                    <Button className="w-100 mt-2" onClick={() => izvrsiAkciju(() => generirajVozila(brojVozila), 'Vozila')} disabled={loading}>Generiraj Vozila</Button>
                </Col>
                <Col md={3}>
                    <Form.Label>Broj naloga</Form.Label>
                    <Form.Control type="number" value={brojNaloga} onChange={(e) => setBrojNaloga(parseInt(e.target.value))} />
                    <Button className="w-100 mt-2" variant="success" onClick={() => izvrsiAkciju(() => generirajNaloga(brojNaloga), 'Nalozi')} disabled={loading}>Generiraj Naloze</Button>
                </Col>
            </Row>

            <hr className="my-5" />

            <h3>Brisanje podataka</h3>
            <Row>
                <Col><Button variant="danger" className="w-100" onClick={() => obrisiSve(UslugeService, 'Usluge')} disabled={loading}>Obriši Usluge</Button></Col>
                <Col><Button variant="danger" className="w-100" onClick={() => obrisiSve(KlijentService, 'Klijenti')} disabled={loading}>Obriši Klijente</Button></Col>
                <Col><Button variant="danger" className="w-100" onClick={() => obrisiSve(VoziloService, 'Vozila')} disabled={loading}>Obriši Vozila</Button></Col>
                <Col><Button variant="danger" className="w-100" onClick={() => obrisiSve(NalogService, 'Nalozi')} disabled={loading}>Obriši Naloze</Button></Col>
            </Row>
        </Container>
    );
}