import React, { useEffect, useState } from 'react';
import { ReceiptModel } from '../types/receipt';
import jsPDF from 'jspdf';

interface Props {
  data: ReceiptModel;
}

const formatDate = (input: string) => {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const ReceiptCard: React.FC<Props> = ({ data }) => {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [instagramIcon, setInstagramIcon] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const logoBase64 = await fetchImageAsBase64('/assets/logo-transparent-2.jpg');
      const instagramBase64 = await fetchImageAsBase64(
        'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'
      );
      setLogoBase64(logoBase64);
      setInstagramIcon(instagramBase64);
    };

    fetchImages();
  }, []);

  const fetchImageAsBase64 = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const lineSpacing = 8;

    const logoWidth = 30;
    const logoHeight = 15;
    const logoY = 10;
    const spacingAfterLogo = 10;

    let y = logoY + logoHeight + spacingAfterLogo;

    // Logo
    if (logoBase64) {
      const centerX = (pageWidth - logoWidth) / 2;
      doc.addImage(logoBase64, 'JPEG', centerX, logoY, logoWidth, logoHeight);
    }

    // Title
    doc.setTextColor('#f5694b');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Receipt', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Fields
    doc.setFontSize(12);
    doc.setTextColor(50);
    const fields = [
      { label: 'Receipt #', value: `${data.booking_id}-${data.inv_no}` },
      { label: 'Guest', value: data.guest_full_name },
      { label: 'Email', value: data.email },
      { label: 'Property', value: data.property_title },
      { label: 'Address', value: data.property_address },
      { label: 'Monthly Fee', value: `$${data.monthly_fee}` },
      { label: 'Service Fee', value: `$${data.service_fee}` },
      { label: 'Total Paid', value: `$${data.total_paid}` },
      { label: 'Invoice Date', value: formatDate(data.invoice_date) },
      { label: 'Paid Date', value: formatDate(data.booking_paid_date) },
    ];

    fields.forEach(({ label, value }) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#f5694b');
      doc.text(`${label}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
      const text = doc.splitTextToSize(value, pageWidth - margin * 2 - 40);
      doc.text(text, margin + 40, y);
      y += lineSpacing * text.length;
    });

    // Footer divider
    y += 10;
    doc.setDrawColor('#f5694b');
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Footer text
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your booking!', pageWidth / 2, y, { align: 'center' });

    y += 7;
    doc.text('Contact us: hello@nomadroof.com', pageWidth / 2, y, { align: 'center' });

    // Instagram
    if (instagramIcon) {
      doc.addImage(instagramIcon, 'PNG', pageWidth / 2 - 20, y + 5, 5, 5);
      doc.text('@Nomadroof', pageWidth / 2 - 12, y + 9);
    }

    doc.save(`receipt_${data.booking_id}.pdf`);
  };

  return (
    <div className="p-4 rounded-2xl bg-white shadow-md mb-4 border border-gray-200 text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Booking Receipt Found</h2>
      <p className="text-gray-600 mb-4">You can download your receipt as a PDF below.</p>
      <button
        onClick={handleDownload}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg"
      >
        Download PDF
      </button>
    </div>
  );
};

export default ReceiptCard;
