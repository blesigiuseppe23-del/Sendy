import { PDFDocument, rgb } from 'pdf-lib';

const formatDate = (date) => {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const generateShippingLabel = async (orderData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  const {
    sender,
    recipient,
    package: pkg,
    selectedCarrier,
    order,
    pricing,
    services
  } = orderData;

  const isGiftMode = services?.giftMode;

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595,
    height: 842,
    color: rgb(1, 1, 1),
  });

  // Header bar
  page.drawRectangle({
    x: 0,
    y: 762,
    width: 595,
    height: 80,
    color: rgb(0.1, 0.1, 0.15),
  });

  // Logo and title
  page.drawText('SENDY', {
    x: 30,
    y: 805,
    size: 36,
    color: rgb(0.53, 0.81, 0.92),
  });

  // Gift mode indicator
  if (isGiftMode) {
    page.drawText('GIFT', {
      x: 130,
      y: 805,
      size: 18,
      color: rgb(1, 0.75, 0.8),
    });
  }

  page.drawText('Lettera di Vettura', {
    x: 30,
    y: 775,
    size: 16,
    color: rgb(0.7, 0.7, 0.8),
  });

  // Order info on the right
  page.drawText(`Ordine: ${order?.id || 'N/A'}`, {
    x: 420,
    y: 810,
    size: 14,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Data: ${formatDateTime(order?.createdAt || new Date())}`, {
    x: 420,
    y: 790,
    size: 12,
    color: rgb(0.7, 0.7, 0.8),
  });

  // Tracking number - large and prominent
  page.drawText('TRACKING', {
    x: 30,
    y: 720,
    size: 12,
    color: rgb(0.4, 0.4, 0.5),
  });

  page.drawText(order?.tracking || '', {
    x: 30,
    y: 685,
    size: 28,
    color: rgb(0.2, 0.2, 0.3),
  });

  // Horizontal line
  page.drawLine({
    start: { x: 30, y: 660 },
    end: { x: 565, y: 660 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.9),
  });

  // Sender Section
  page.drawText('MITTENTE', {
    x: 30,
    y: 630,
    size: 14,
    color: rgb(0.33, 0.63, 0.77),
  });

  const senderName = `${sender?.nome || ''} ${sender?.cognome || ''}`.trim();
  page.drawText(senderName || 'N/A', {
    x: 30,
    y: 605,
    size: 16,
    color: rgb(0.1, 0.1, 0.15),
  });

  page.drawText(sender?.indirizzo || '', {
    x: 30,
    y: 580,
    size: 12,
    color: rgb(0.2, 0.2, 0.3),
  });

  if (sender?.piano || sender?.scala) {
    let details = [];
    if (sender?.piano) details.push(`Piano ${sender.piano}`);
    if (sender?.scala) details.push(`Scala ${sender.scala}`);
    page.drawText(details.join(', '), {
      x: 30,
      y: 560,
      size: 11,
      color: rgb(0.4, 0.4, 0.5),
    });
  }

  page.drawText(`Tel: ${sender?.telefono || 'N/A'}`, {
    x: 30,
    y: 530,
    size: 11,
    color: rgb(0.4, 0.4, 0.5),
  });

  page.drawText(`Email: ${sender?.email || 'N/A'}`, {
    x: 30,
    y: 510,
    size: 11,
    color: rgb(0.4, 0.4, 0.5),
  });

  // Horizontal line
  page.drawLine({
    start: { x: 30, y: 480 },
    end: { x: 565, y: 480 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.9),
  });

  // Recipient Section
  page.drawText('DESTINATARIO', {
    x: 30,
    y: 450,
    size: 14,
    color: rgb(0.23, 0.72, 0.45),
  });

  const recipientName = `${recipient?.nome || ''} ${recipient?.cognome || ''}`.trim();
  page.drawText(recipientName || 'N/A', {
    x: 30,
    y: 425,
    size: 16,
    color: rgb(0.1, 0.1, 0.15),
  });

  page.drawText(recipient?.indirizzo || '', {
    x: 30,
    y: 400,
    size: 12,
    color: rgb(0.2, 0.2, 0.3),
  });

  if (recipient?.piano || recipient?.scala) {
    let details = [];
    if (recipient?.piano) details.push(`Piano ${recipient.piano}`);
    if (recipient?.scala) details.push(`Scala ${recipient.scala}`);
    page.drawText(details.join(', '), {
      x: 30,
      y: 380,
      size: 11,
      color: rgb(0.4, 0.4, 0.5),
    });
  }

  page.drawText(`Tel: ${recipient?.telefono || 'N/A'}`, {
    x: 30,
    y: 350,
    size: 11,
    color: rgb(0.4, 0.4, 0.5),
  });

  page.drawText(`Email: ${recipient?.email || 'N/A'}`, {
    x: 30,
    y: 330,
    size: 11,
    color: rgb(0.4, 0.4, 0.5),
  });

  // Horizontal line
  page.drawLine({
    start: { x: 30, y: 300 },
    end: { x: 565, y: 300 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.9),
  });

  // Package Section
  page.drawText('DETTAGLI PACCO', {
    x: 30,
    y: 270,
    size: 14,
    color: rgb(0.95, 0.6, 0.1),
  });

  page.drawText(`Peso reale: ${pkg?.peso || 0} kg`, {
    x: 30,
    y: 245,
    size: 12,
    color: rgb(0.2, 0.2, 0.3),
  });

  page.drawText(`Peso volumetrico: ${(pkg?.pesoVolumetrico || 0).toFixed(2)} kg`, {
    x: 200,
    y: 245,
    size: 12,
    color: rgb(0.2, 0.2, 0.3),
  });

  page.drawText(`Dimensioni: ${pkg?.lunghezza || 0} x ${pkg?.larghezza || 0} x ${pkg?.altezza || 0} cm`, {
    x: 30,
    y: 220,
    size: 12,
    color: rgb(0.2, 0.2, 0.3),
  });

  page.drawText(`Peso determinante: ${(pkg?.pesoDeterminante || 0).toFixed(2)} kg`, {
    x: 200,
    y: 220,
    size: 12,
    color: rgb(0.2, 0.2, 0.3),
  });

  // Carrier Section
  page.drawText('CORRIERE', {
    x: 30,
    y: 180,
    size: 14,
    color: rgb(0.86, 0.4, 0),
  });

  page.drawText(selectedCarrier?.name || 'N/A', {
    x: 30,
    y: 155,
    size: 18,
    color: rgb(0.1, 0.1, 0.15),
  });

  page.drawText(`Consegna stimata: ${selectedCarrier?.delivery || 'N/D'}`, {
    x: 30,
    y: 130,
    size: 12,
    color: rgb(0.4, 0.4, 0.5),
  });

  // Services (if any extra)
  if (services?.floorDelivery || services?.insurance || isGiftMode) {
    page.drawLine({
      start: { x: 30, y: 110 },
      end: { x: 565, y: 110 },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.9),
    });

    page.drawText('SERVIZI EXTRA', {
      x: 30,
      y: 85,
      size: 12,
      color: rgb(0.6, 0.4, 0.8),
    });

    let yPos = 60;
    if (services?.floorDelivery) {
      page.drawText('- Consegna al piano', {
        x: 30,
        y: yPos,
        size: 11,
        color: rgb(0.3, 0.3, 0.4),
      });
      yPos -= 18;
    }
    if (services?.insurance) {
      page.drawText('- Assicurazione extra', {
        x: 30,
        y: yPos,
        size: 11,
        color: rgb(0.3, 0.3, 0.4),
      });
      yPos -= 18;
    }
    if (isGiftMode) {
      page.drawText('- Modalità regalo attiva', {
        x: 30,
        y: yPos,
        size: 11,
        color: rgb(0.3, 0.3, 0.4),
      });
    }
  }

  // Pricing section - only if not gift mode
  if (!isGiftMode) {
    page.drawLine({
      start: { x: 320, y: 200 },
      end: { x: 320, y: 80 },
      thickness: 1,
    color: rgb(0.85, 0.85, 0.9),
    });

    page.drawText('COSTI', {
      x: 350,
      y: 270,
      size: 14,
      color: rgb(0.55, 0.34, 0.8),
    });

    page.drawText('Prezzo base:', {
      x: 350,
      y: 245,
      size: 11,
      color: rgb(0.3, 0.3, 0.4),
    });

    page.drawText(formatPrice(pricing?.base || 0), {
      x: 500,
      y: 245,
      size: 11,
      color: rgb(0.1, 0.1, 0.15),
    });

    if (pricing?.extras > 0) {
      page.drawText('Extra:', {
        x: 350,
        y: 225,
        size: 11,
        color: rgb(0.3, 0.3, 0.4),
      });

      page.drawText(formatPrice(pricing.extras), {
        x: 500,
        y: 225,
        size: 11,
        color: rgb(0.1, 0.1, 0.15),
      });

      page.drawLine({
        start: { x: 350, y: 208 },
        end: { x: 555, y: 208 },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.9),
      });

      page.drawText('TOTALE:', {
        x: 350,
        y: 190,
        size: 14,
        color: rgb(0.1, 0.1, 0.15),
      });

      page.drawText(formatPrice(pricing?.total || 0), {
        x: 480,
        y: 190,
        size: 16,
        color: rgb(0.2, 0.52, 0.75),
      });
    }
  }

  // Gift mode footer message
  if (isGiftMode && services?.giftMessage) {
    // Draw a nice box for the gift message
    page.drawRectangle({
      x: 30,
      y: 15,
      width: 535,
      height: 55,
      color: rgb(0.99, 0.95, 0.95),
    });

    page.drawRectangle({
      x: 30,
      y: 15,
      width: 535,
      height: 55,
      borderColor: rgb(0.98, 0.83, 0.87),
      borderWidth: 2,
    });

    page.drawText('Messaggio d\'auguri:', {
      x: 45,
      y: 55,
      size: 10,
      color: rgb(0.5, 0.2, 0.4),
    });

    // Wrap gift message
    const lines = wrapText(pdfDoc, services.giftMessage, 520, 12);
    lines.forEach((line, i) => {
      page.drawText(line, {
        x: 45,
        y: 38 - (i * 14),
        size: 12,
        color: rgb(0.3, 0.1, 0.25),
        italic: true,
      });
    });

    // Small heart or gift emoji could be drawn here
  }

  // Footer
  page.drawLine({
    start: { x: 30, y: 45 },
    end: { x: 565, y: 45 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.9),
  });

  if (isGiftMode) {
    page.drawText('Questo pacco è un regalo speciale', {
      x: 200,
      y: 28,
      size: 10,
      color: rgb(0.55, 0.34, 0.8),
    });
  } else {
    page.drawText('www.sendy.it', {
      x: 260,
      y: 28,
      size: 10,
      color: rgb(0.4, 0.4, 0.5),
    });
  }

  const pdfBytes = await pdfDoc.save();

  return {
    bytes: pdfBytes,
    filename: `lettera-vettura-${order?.id || 'sendy'}.pdf`,
    blob: new Blob([pdfBytes], { type: 'application/pdf' }),
    url: URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })),
  };
};

// Helper to wrap text
function wrapText(pdfDoc, text, maxWidth, fontSize) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  // Approximate character width (monospace approximation)
  const charWidth = fontSize * 0.5;

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = testLine.length * charWidth;

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, 4); // Max 4 lines
}

export const downloadPDF = async (orderData) => {
  const result = await generateShippingLabel(orderData);

  const link = document.createElement('a');
  link.href = result.url;
  link.download = result.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(result.url);

  return result;
};

export default generateShippingLabel;
