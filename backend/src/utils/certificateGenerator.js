const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const generateCertificatePDF = async ({
  studentName,
  eventName,
  completionDate,
  clubName,
  clubLogoPath,
  certificateId
}) => {
  const pdfDoc = await PDFDocument.create();
  // Standard A4 landscape: 841.89 x 595.28 points
  const width = 841.89;
  const height = 595.28;
  const page = pdfDoc.addPage([width, height]);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // Palette
  const gold = rgb(0.83, 0.68, 0.21); // #D4AF37
  const darkNavy = rgb(0.06, 0.09, 0.16); // #10172A
  const slate = rgb(0.39, 0.45, 0.55); // #64748B
  const cream = rgb(0.99, 0.98, 0.96);

  // Background cream fill
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: cream,
  });

  // Borders
  // Outer gold border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: gold,
    borderWidth: 4,
  });

  // Inner thin border
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: darkNavy,
    borderWidth: 1,
  });

  // Corner accents
  const cornerSize = 18;
  const corners = [
    [32, height - 32 - cornerSize],
    [width - 32 - cornerSize, height - 32 - cornerSize],
    [32, 32],
    [width - 32 - cornerSize, 32],
  ];
  corners.forEach(([cx, cy]) => {
    page.drawRectangle({
      x: cx,
      y: cy,
      width: cornerSize,
      height: cornerSize,
      color: gold,
    });
  });

  // Club Logo if available
  let logoYOffset = 0;
  if (clubLogoPath) {
    try {
      const fullLogoPath = path.join(__dirname, '..', '..', clubLogoPath.replace(/^\//, ''));
      if (fs.existsSync(fullLogoPath)) {
        const logoBytes = fs.readFileSync(fullLogoPath);
        let embeddedLogo;
        if (clubLogoPath.toLowerCase().endsWith('.png')) {
          embeddedLogo = await pdfDoc.embedPng(logoBytes);
        } else {
          embeddedLogo = await pdfDoc.embedJpg(logoBytes);
        }
        if (embeddedLogo) {
          const logoDim = embeddedLogo.scaleToFit(50, 50);
          page.drawImage(embeddedLogo, {
            x: width / 2 - logoDim.width / 2,
            y: height - 85,
            width: logoDim.width,
            height: logoDim.height,
          });
          logoYOffset = 25;
        }
      }
    } catch (e) {
      console.warn('Could not embed club logo in certificate:', e.message);
    }
  }

  // Header Institution / Brand
  const brandText = `${(clubName || 'CAMPUS CLUB').toUpperCase()}  •  OFFICIAL CREDENTIAL`;
  const brandWidth = fontBold.widthOfTextAtSize(brandText, 11);
  page.drawText(brandText, {
    x: width / 2 - brandWidth / 2,
    y: height - 90 - logoYOffset,
    size: 11,
    font: fontBold,
    color: gold,
  });

  // Certificate Title
  const titleText = 'CERTIFICATE OF PARTICIPATION';
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 26);
  page.drawText(titleText, {
    x: width / 2 - titleWidth / 2,
    y: height - 130 - logoYOffset,
    size: 26,
    font: fontBold,
    color: darkNavy,
  });

  // Presentation text
  const presText = 'THIS ACKNOWLEDGES THAT';
  const presWidth = fontRegular.widthOfTextAtSize(presText, 11);
  page.drawText(presText, {
    x: width / 2 - presWidth / 2,
    y: height - 165 - logoYOffset,
    size: 11,
    font: fontRegular,
    color: slate,
  });

  // Student Name
  const nameText = studentName || 'Distinguished Participant';
  const nameWidth = fontBold.widthOfTextAtSize(nameText, 30);
  page.drawText(nameText, {
    x: width / 2 - nameWidth / 2,
    y: height - 210 - logoYOffset,
    size: 30,
    font: fontBold,
    color: darkNavy,
  });

  // Gold divider under name
  const lineHalf = Math.max(nameWidth / 2 + 30, 140);
  page.drawLine({
    start: { x: width / 2 - lineHalf, y: height - 220 - logoYOffset },
    end: { x: width / 2 + lineHalf, y: height - 220 - logoYOffset },
    thickness: 1.5,
    color: gold,
  });

  // Description text
  const descText = 'has actively participated and successfully completed all designated sessions of';
  const descWidth = fontItalic.widthOfTextAtSize(descText, 14);
  page.drawText(descText, {
    x: width / 2 - descWidth / 2,
    y: height - 250 - logoYOffset,
    size: 14,
    font: fontItalic,
    color: slate,
  });

  // Event Name
  const eventText = `"${eventName || 'Campus Event'}"`;
  const eventWidth = fontBold.widthOfTextAtSize(eventText, 20);
  page.drawText(eventText, {
    x: width / 2 - eventWidth / 2,
    y: height - 285 - logoYOffset,
    size: 20,
    font: fontBold,
    color: darkNavy,
  });

  // Organized by / Date text
  const formattedDate = completionDate ? new Date(completionDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const orgText = `Conducted on ${formattedDate} under the auspices of ${clubName || 'Clubora'}.`;
  const orgWidth = fontRegular.widthOfTextAtSize(orgText, 12);
  page.drawText(orgText, {
    x: width / 2 - orgWidth / 2,
    y: height - 320 - logoYOffset,
    size: 12,
    font: fontRegular,
    color: slate,
  });

  // Signatures
  // Left: Date
  page.drawLine({
    start: { x: 90, y: 110 },
    end: { x: 270, y: 110 },
    thickness: 1,
    color: slate,
  });
  page.drawText(formattedDate, {
    x: 140,
    y: 118,
    size: 11,
    font: fontRegular,
    color: darkNavy,
  });
  page.drawText('DATE OF ISSUANCE', {
    x: 125,
    y: 95,
    size: 9,
    font: fontBold,
    color: slate,
  });

  // Right: Club President / Authorized Signatory
  page.drawLine({
    start: { x: width - 270, y: 110 },
    end: { x: width - 90, y: 110 },
    thickness: 1,
    color: slate,
  });
  const signTitle = `${clubName || 'Club'} President`;
  const signWidth = fontRegular.widthOfTextAtSize(signTitle, 11);
  page.drawText(signTitle, {
    x: width - 180 - signWidth / 2,
    y: 118,
    size: 11,
    font: fontRegular,
    color: darkNavy,
  });
  page.drawText('AUTHORIZED SIGNATORY', {
    x: width - 215,
    y: 95,
    size: 9,
    font: fontBold,
    color: slate,
  });

  // Bottom Credential Verification ID
  const certIdText = `Credential ID: ${certificateId}`;
  page.drawText(certIdText, {
    x: width / 2 - fontRegular.widthOfTextAtSize(certIdText, 9) / 2,
    y: 50,
    size: 9,
    font: fontRegular,
    color: slate,
  });

  const verifyNotice = 'Verify authenticity online with Clubora Credential Engine';
  page.drawText(verifyNotice, {
    x: width / 2 - fontRegular.widthOfTextAtSize(verifyNotice, 8) / 2,
    y: 38,
    size: 8,
    font: fontRegular,
    color: gold,
  });

  const pdfBytes = await pdfDoc.save();

  // Save to file
  const certsDir = path.join(__dirname, '..', '..', 'uploads', 'certificates');
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }

  const fileName = `certificate-${certificateId}-${Date.now()}.pdf`;
  const filePath = path.join(certsDir, fileName);
  fs.writeFileSync(filePath, pdfBytes);

  return `/uploads/certificates/${fileName}`;
};

module.exports = {
  generateCertificatePDF,
};
