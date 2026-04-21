import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function NalogPDFGenerator({ nalog, vozilo, klijent, odabraneUsluge, ukupno }) {

    const fetchFontAsBase64 = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Font nije pronađen: ${url}`);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    };

    const generirajPDF = async () => {
        const [regBase64, boldBase64] = await Promise.all([
            fetchFontAsBase64('/fonts/Roboto-Regular.ttf'),
            fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
        ]);

        const doc = new jsPDF();

        // Registracija fontova za HR znakove
        doc.addFileToVFS('Roboto-Regular.ttf', regBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

        doc.setFont('Roboto', 'normal');
        
        // Logo / Zaglavlje
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50); 
        doc.text('AutoLog', 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(102, 102, 102);
        doc.text('SERVIS I ODRŽAVANJE VOZILA', 20, 27);

        // Naslov dokumenta
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`RADNI NALOG BR. ${nalog.sifra || ''}`, 20, 45);

        // Linija ispod naslova
        doc.setDrawColor(46, 125, 50);
        doc.setLineWidth(0.5);
        doc.line(20, 48, 190, 48);

        let yPosition = 60;

        // Podaci o nalogu i klijentu
        doc.setFontSize(14);
        doc.setFont('Roboto', 'bold');
        doc.text('Podaci o nalogu:', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('Roboto', 'normal');
        doc.text(`Opis: ${nalog.naziv}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Klijent: ${klijent ? klijent.ime + ' ' + klijent.prezime : 'Nije navedeno'}`, 25, yPosition);
        yPosition += 15;

        // Podaci o vozilu
        doc.setFontSize(14);
        doc.setFont('Roboto', 'bold');
        doc.text('Podaci o vozilu:', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('Roboto', 'normal');
        doc.text(`Vozilo: ${vozilo ? vozilo.marka + ' ' + vozilo.model : 'Nije navedeno'}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Registracija: ${vozilo ? vozilo.registracija : 'Nije navedeno'}`, 25, yPosition);
        yPosition += 15;

        // Popis usluga
        doc.setFontSize(14);
        doc.setFont('Roboto', 'bold');
        doc.text('Popis usluga:', 20, yPosition);
        yPosition += 10;

        if (odabraneUsluge && odabraneUsluge.length > 0) {
            const tableData = odabraneUsluge.map(u => [
                u.naziv,
                new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(u.cijena)
            ]);

            autoTable(doc, {
                startY: yPosition,
                head: [['Naziv usluge', 'Cijena']],
                body: tableData,
                tableWidth: 'auto', 
                margin: { left: 15, right: 15 },
                styles: { 
                    font: 'Roboto', 
                    fontStyle: 'normal',
                    fontSize: 10,
                    overflow: 'linebreak'
                },
                headStyles: { 
                    font: 'Roboto', 
                    fontStyle: 'bold',
                    fillColor: [46, 125, 50] 
                },
                columnStyles: {
                    0: { cellWidth: 'auto' }, 
                    1: { cellWidth: 40, halign: 'right' }, 
                }
            });

            // Ukupni iznos nakon tablice
            yPosition = doc.lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.setFont('Roboto', 'bold');
            doc.text(`UKUPNO ZA PLAĆANJE: ${new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(ukupno)}`, 195, yPosition, { align: 'right' });

        } else {
            doc.setFontSize(11);
            doc.setFont('Roboto', 'italic');
            doc.text('Nema dodanih usluga na ovom nalogu.', 25, yPosition);
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Stranica ${i} od ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
            doc.text(
                `Generirano: ${new Date().toLocaleString('hr-HR')}`,
                20,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    return generirajPDF;
}