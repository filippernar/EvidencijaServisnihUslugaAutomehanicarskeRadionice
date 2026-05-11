import { useState, useEffect } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr, en } from '@faker-js/faker';

import UslugeService from '../services/usluge/UslugeService';
import VoziloService from '../services/vozilo/VoziloService';
import KlijentService from '../services/klijent/KlijentService';

import { DATA_SOURCE, IME_APLIKACIJE, PrefixStorage } from '../constants';
import uslugeMemorija from '../services/usluge/UslugePodaci';
import klijentiMemorija from '../services/klijent/KlijentPodaci';
import vozilaMemorija from '../services/vozilo/VoziloPodaci';

// Ispravan faker: HR + EN fallback
const faker = new Faker({
    locale: [hr, en]
});

export default function GeneriranjePodataka() {
    const [brojUsluga, setBrojUsluga] = useState(10);
    const [brojVozila, setBrojVozila] = useState(10);
    const [brojKlijenata, setBrojKlijenata] = useState(10);
    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { 
        document.title = 'Generiranje podataka, ' + IME_APLIKACIJE;
    }, []);

    // --- GENERATORI ---

    const generirajUsluge = async (broj) => {
        const naziviUsluga = [
            'Zamjena ulja', 'Izmjena guma', 'Servis kočnica', 'Dijagnostika motora',
            'Punjenje klime', 'Mali servis', 'Veliki servis', 'Popravak ovjesa',
            'Zamjena akumulatora', 'Balansiranje kotača'
        ];

        for (let i = 0; i < broj; i++) {
            await UslugeService.dodaj({
                naziv: naziviUsluga[i % naziviUsluga.length] + 
                       (i >= naziviUsluga.length ? ` ${Math.floor(i / naziviUsluga.length) + 1}` : ''),
                cijena: faker.number.float({ min: 20, max: 500, precision: 0.01 }),
                trajanje: faker.number.int({ min: 30, max: 480 }),
                datumPokretanja: faker.date.soon().toISOString().split('T')[0]
            });
        }
    };

    const generirajKlijente = async (broj) => {
        for (let i = 0; i < broj; i++) {
            await KlijentService.dodaj({
                ime: faker.person.firstName(),
                prezime: faker.person.lastName(),
                telefon: faker.phone.number('+385 9# ### ####'),
                email: faker.internet.email().toLowerCase(),
                oib: faker.string.numeric(11)
            });
        }
    };

    const generirajVozila = async (broj) => {
        const klijentiRes = await KlijentService.get();
        const klijenti = klijentiRes.data;

        if (klijenti.length === 0) {
            throw new Error('Nema dostupnih klijenata. Prvo generirajte klijente.');
        }

        const marke = ['Audi', 'BMW', 'Volkswagen', 'Opel', 'Mercedes', 'Renault', 'Ford'];

        for (let i = 0; i < broj; i++) {
            const randomKlijent = klijenti[faker.number.int({ min: 0, max: klijenti.length - 1 })];
            const godiste = faker.number.int({ min: 2000, max: 2024 });

            await VoziloService.dodaj({
                marka: marke[faker.number.int({ min: 0, max: marke.length - 1 })],
                model: faker.vehicle.model() || 'Model X',
                registracija: faker.vehicle.vrm(),
                godiste: godiste,
                godinaProizvodnje: godiste,
                kilometri: faker.number.int({ min: 5000, max: 350000 }),
                klijent: randomKlijent.sifra
            });
        }
    };

    // --- HANDLERI ---

    const handleAkcija = async (funkcija, naziv, kolicina) => {
        setLoading(true);
        setPoruka(null);
        try {
            await funkcija(kolicina);
            setPoruka({ tip: 'success', tekst: `Uspješno generirano ${kolicina} za: ${naziv}` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: `Greška (${naziv}): ` + error.message });
        } finally {
            setLoading(false);
        }
    };

    const obrisiSve = async (Service, naziv) => {
        if (!window.confirm(`Jeste li sigurni da želite obrisati sve podatke za: ${naziv}?`)) return;
        setLoading(true);
        setPoruka(null);
        try {
            const res = await Service.get();
            for (const stavka of res.data) {
                await Service.obrisi(stavka.sifra);
            }
            setPoruka({ tip: 'success', tekst: `Uspješno obrisano: ${naziv}` });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri brisanju: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    // --- PRETAKANJE PODATAKA ---

    const handleMemorijaULocalStorage = async () => {
        if (!window.confirm('Jeste li sigurni da želite pretočiti podatke iz memorije u localStorage?')) return;

        setLoading(true);
        setPoruka(null);

        try {
            localStorage.setItem(PrefixStorage.USLUGE, JSON.stringify(uslugeMemorija.usluge || uslugeMemorija));
            localStorage.setItem(PrefixStorage.KLIJENTI, JSON.stringify(klijentiMemorija.klijenti || klijentiMemorija));
            localStorage.setItem(PrefixStorage.VOZILO, JSON.stringify(vozilaMemorija.vozila || vozilaMemorija));

            setPoruka({ tip: 'success', tekst: 'Podaci uspješno pretočeni iz memorije u localStorage!' });
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri pretakanju: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h1>Generiranje podataka</h1>
            <p className="text-muted">Popunjavanje baze automehaničarske radionice testnim podacima.</p>

            {poruka && <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>{poruka.tekst}</Alert>}

            <Row className="mb-4 text-center">
                <Col md={4}>
                    <Form.Group className="mb-3 border p-3 rounded shadow-sm">
                        <Form.Label className="fw-bold">Usluge</Form.Label>
                        <Form.Control type="number" value={brojUsluga} onChange={(e) => setBrojUsluga(parseInt(e.target.value))} />
                        <Button variant="primary" className="w-100 mt-2" onClick={() => handleAkcija(generirajUsluge, 'Usluge', brojUsluga)} disabled={loading}>
                            Generiraj usluge
                        </Button>
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3 border p-3 rounded shadow-sm">
                        <Form.Label className="fw-bold">Klijenti</Form.Label>
                        <Form.Control type="number" value={brojKlijenata} onChange={(e) => setBrojKlijenata(parseInt(e.target.value))} />
                        <Button variant="primary" className="w-100 mt-2" onClick={() => handleAkcija(generirajKlijente, 'Klijenti', brojKlijenata)} disabled={loading}>
                            Generiraj klijente
                        </Button>
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3 border p-3 rounded shadow-sm">
                        <Form.Label className="fw-bold">Vozila</Form.Label>
                        <Form.Control type="number" value={brojVozila} onChange={(e) => setBrojVozila(parseInt(e.target.value))} />
                        <Button variant="primary" className="w-100 mt-2" onClick={() => handleAkcija(generirajVozila, 'Vozila', brojVozila)} disabled={loading}>
                            Generiraj vozila
                        </Button>
                    </Form.Group>
                </Col>
            </Row>

            <hr className="my-5" />

            <h3 className="text-danger">Brisanje podataka</h3>
            <Row className="mt-3">
                <Col md={4}><Button variant="outline-danger" onClick={() => obrisiSve(UslugeService, 'Usluge')} disabled={loading} className="w-100 mb-2">Obriši sve usluge</Button></Col>
                <Col md={4}><Button variant="outline-danger" onClick={() => obrisiSve(KlijentService, 'Klijente')} disabled={loading} className="w-100 mb-2">Obriši sve klijente</Button></Col>
                <Col md={4}><Button variant="outline-danger" onClick={() => obrisiSve(VoziloService, 'Vozila')} disabled={loading} className="w-100 mb-2">Obriši sva vozila</Button></Col>
            </Row>

            {DATA_SOURCE !== 'memorija' && (
                <div className="mt-5">
                    <hr />
                    <h3>Migracija podataka</h3>
                    <Row className="mt-3">
                        <Col md={6}>
                            <Button variant="success" onClick={handleMemorijaULocalStorage} disabled={loading} className="w-100 mb-2">
                                {loading ? 'Pretakanje...' : 'Iz memorije u localStorage'}
                            </Button>
                        </Col>
                        <Col md={6}>
                            
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
    );
}
