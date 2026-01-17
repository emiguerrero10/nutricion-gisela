export default async function handler(req, res) {
  const { nombre = 'Anónimo', email } = req.query;

  // Email obligatorio
  if (!email || !String(email).includes('@')) {
    return res.status(400).send('Email requerido para descargar el ebook.');
  }

  // 1) Registrar métrica (sin DB, usando KV de Vercel si lo agregás luego)
  // Por ahora lo dejamos sin romper nada.

  // 2) Intentar enviar mail (pero NO bloquear descarga si falla)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Lic. Gisela <hola@alimenta-tu-ser.com>',
          to: ['gisedeoro@gmail.com'],
          subject: '📘 Nueva descarga del ebook',
          html: `
            <h2>Nueva descarga del ebook</h2>
            <p><b>Nombre:</b> ${nombre}</p>
            <p><b>Email:</b> ${email}</p>
            <p>Fecha: ${new Date().toLocaleString('es-AR')}</p>
          `,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error('Resend error:', response.status, text);
        // NO cortamos: igual descargamos
      }
    } catch (err) {
      console.error('Resend exception:', err);
      // NO cortamos: igual descargamos
    }
  } else {
    console.warn('Falta RESEND_API_KEY en Vercel.');
    // NO cortamos
  }

  // 3) Descargar SIEMPRE
  res.writeHead(302, { Location: '/docs/ebook-habitos-saludables.pdf' });
  res.end();
}
