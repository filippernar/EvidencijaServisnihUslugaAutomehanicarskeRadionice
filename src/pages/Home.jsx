import { IME_APLIKACIJE } from "../constants";
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Col, Row, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import VoziloService from "../services/vozilo/VoziloService";
import UslugeService from "../services/usluge/UslugeService";
import NalogService from "../services/nalozi/NalogService";
import KlijentService from "../services/klijent/KlijentService";

export default function Home() {
    const [brojVozila, setBrojVozila] = useState(0);
    const [brojUsluga, setBrojUsluga] = useState(0);
       const [brojNaloga, setBrojNaloga] = useState(0);
    const [brojKlijenata, setBrojKlijenata] = useState(0);
    
    const [animatedVozila, setAnimatedVozila] = useState(0);
    const [animatedUsluge, setAnimatedUsluge] = useState(0);
    const [animatedNalozi, setAnimatedNalozi] = useState(0);
    const [animatedKlijenti, setAnimatedKlijenti] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vozilaRezultat = await VoziloService.get();
                const uslugeRezultat = await UslugeService.get();
                const naloziRezultat = await NalogService.get();
                const klijentiRezultat = await KlijentService.get();

                setBrojVozila(vozilaRezultat.data.length);
                setBrojUsluga(uslugeRezultat.data.length);
                setBrojNaloga(naloziRezultat.data.length);
                setBrojKlijenata(klijentiRezultat.data.length);

            } catch (error) {
                console.error('Greška pri dohvaćanju podataka:', error);
            }
        };

        fetchData();
    }, []);

    // Animacije brojača
    useEffect(() => {
        if (animatedVozila < brojVozila) {
            const timer = setTimeout(() => {
                setAnimatedVozila(prev => Math.min(prev + 1, brojVozila));
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [animatedVozila, brojVozila]);

    useEffect(() => {
        if (animatedUsluge < brojUsluga) {
            const timer = setTimeout(() => {
                setAnimatedUsluge(prev => Math.min(prev + 1, brojUsluga));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [animatedUsluge, brojUsluga]);

    useEffect(() => {
        if (animatedNalozi < brojNaloga) {
            const timer = setTimeout(() => {
                setAnimatedNalozi(prev => Math.min(prev + 1, brojNaloga));
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [animatedNalozi, brojNaloga]);

    useEffect(() => {
        if (animatedKlijenti < brojKlijenata) {
            const timer = setTimeout(() => {
                setAnimatedKlijenti(prev => Math.min(prev + 1, brojKlijenata));
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [animatedKlijenti, brojKlijenata]);

    return (
        <>
            <div style={{ textAlign: 'center'}}>
                <Row>
                    <Col md={6}>
                        <p className="lead m-5 text-center">Dobrodošli na {IME_APLIKACIJE}</p>
                        <div style={{maxWidth: '500px', margin: 'auto'}}>
                            <DotLottieReact
                                src="/car safe.lottie"
                                loop
                                autoplay
                            />
                        </div>
                    </Col>

                    <Col className="d-flex align-items-center justify-content-center">
                        <div style={{ width: '100%', maxWidth: '500px' }}>

                            <Row>

                                <Col md={6} className="mb-3">
                                    <Card className="shadow-lg border-0 statistikaPanel h-100">
                                        <Card.Body className="text-center">
                                            <p className="text-white">Ukupno vozila</p>
                                            <div className="statistikaTekst">
                                                {animatedVozila}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <Card className="shadow-lg border-0 statistikaPanel h-100">
                                        <Card.Body className="text-center">
                                            <p className="text-white">Aktivne usluge</p>
                                            <div className="statistikaTekst">
                                                {animatedUsluge}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <Card className="shadow-lg border-0 statistikaPanel h-100">
                                        <Card.Body className="text-center">
                                            <p className="text-white">Otvoreni nalozi</p>
                                            <div className="statistikaTekst">
                                                {animatedNalozi}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <Card className="shadow-lg border-0 statistikaPanel h-100">
                                        <Card.Body className="text-center">
                                            <p className="text-white">Registrirani klijenti</p>
                                            <div className="statistikaTekst">
                                                {animatedKlijenti}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                            </Row>

                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}
