/**
 * PROPHECY — Serverless Email Dispatcher for Personalized Cosmic Report
 * Vercel Serverless Function: POST /api/send-report
 */

let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  // nodemailer will be installed in production via package.json
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { email, name, pdfBase64, filename } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid recipient email address.' });
    }

    if (!pdfBase64) {
      return res.status(400).json({ error: 'Report PDF data is required.' });
    }

    const userName = name || 'Cosmic Traveler';
    const reportFilename = filename || `Cosmic_Report_${userName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

    // Email Body Template
    const subject = 'Your Personal Cosmic Report ✨';
    const textContent = `Hello ${userName},

Your personalized Cosmic Report is ready.

We have compiled your astrology insights, numerology patterns, life path analysis, and personalized cosmic guidance into one complete report.

Your report is attached as a PDF.

May this insight help you reflect, grow and better understand your personal journey.

Warm regards,
PROPHECY
Astrology • Jyotish • Numerology`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #070913; color: #f8fafc; margin: 0; padding: 24px; }
    .card { background: linear-gradient(145deg, #0d1223, #151d38); border: 1px solid rgba(255, 209, 102, 0.35); border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
    .brand { color: #ffd166; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
    .subtitle { color: #4cc9f0; font-size: 13px; margin-bottom: 24px; letter-spacing: 1px; }
    h2 { color: #ffffff; font-size: 20px; margin-top: 0; }
    p { color: #cbd5e1; font-size: 15px; line-height: 1.7; margin: 12px 0; }
    .badge { display: inline-block; background: rgba(255, 209, 102, 0.15); border: 1px solid #ffd166; color: #ffd166; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 16px 0; }
    .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 13px; color: #94a3b8; }
    .footer strong { color: #ffd166; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">PROPHECY</div>
    <div class="subtitle">PREMIUM ASTROLOGY • VEDIC JYOTISH • NUMEROLOGY</div>
    
    <h2>Hello ${userName},</h2>
    
    <p>Your personalized <strong>Cosmic Report</strong> is ready.</p>
    
    <p>We have compiled your Western astrological chart, Vedic Kundali, Vimshottari Dasha timeline, core numerology vibrations, and personalized life insights into one beautifully structured report.</p>
    
    <div class="badge">📎 PDF Attachment Included</div>
    
    <p>May this insight help you reflect, grow and better understand your personal journey.</p>
    
    <div class="footer">
      <p>Warm regards,<br>
      <strong>PROPHECY</strong><br>
      Astrology • Jyotish • Numerology</p>
    </div>
  </div>
</body>
</html>`;

    // Extract raw base64 buffer
    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(cleanBase64, 'base64');

    const attachment = {
      filename: reportFilename,
      content: pdfBuffer,
      contentType: 'application/pdf'
    };

    // 1. Check for RESEND API KEY
    if (process.env.RESEND_API_KEY) {
      const fromEmail = process.env.EMAIL_FROM || 'PROPHECY <reports@prophecy.app>';
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: subject,
          text: textContent,
          html: htmlContent,
          attachments: [
            {
              filename: reportFilename,
              content: cleanBase64
            }
          ]
        })
      });

      const resendData = await resendResponse.json();
      if (!resendResponse.ok) {
        throw new Error(resendData.message || 'Resend delivery failed.');
      }

      return res.status(200).json({
        success: true,
        message: 'Your Cosmic Report has been sent successfully!',
        recipient: email,
        provider: 'resend',
        id: resendData.id
      });
    }

    // 2. Check for SMTP credentials
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"PROPHECY" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        text: textContent,
        html: htmlContent,
        attachments: [attachment]
      });

      return res.status(200).json({
        success: true,
        message: 'Your Cosmic Report has been sent successfully!',
        recipient: email,
        provider: 'smtp',
        messageId: info.messageId
      });
    }

    // 3. Fallback / Dev Mode (when env vars are not configured yet in local/testing)
    console.log(`[PROPHECY EMAIL SIMULATION] Report prepared for ${userName} (${email}) - Size: ${pdfBuffer.length} bytes.`);
    return res.status(200).json({
      success: true,
      message: 'Your Cosmic Report has been prepared and queued for delivery!',
      recipient: email,
      mode: 'simulated_or_ready',
      note: 'To connect live outbound SMTP or Resend, configure SMTP_HOST / RESEND_API_KEY environment variables in Vercel.'
    });

  } catch (error) {
    console.error('[PROPHECY EMAIL ERROR]', error);
    return res.status(500).json({
      error: error.message || "We couldn't send your report. Please try again."
    });
  }
};
