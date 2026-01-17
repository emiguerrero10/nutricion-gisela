export default async function handler(req, res) {
  const { nombre = 'Anónimo', email } = req.query;

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).send('Falta RESEND_API_KEY en Vercel.');
  }

  // Email obligatorio (server-side)
  if (!email || !String(email).includes('@')) {
    return res.status(400).send('Email requerido para descargar el ebook.');
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Lic. Gisela <hola@alimenta-tu-ser.com>',
        to: ['gisedeoro@gmail.com'], // 🔴 CAMBIAR por el mail real de Gisela
        subject: '📘 Nueva descarga del ebook',
        html: `
          <h2>Nueva descarga del ebook</h2>
          <p><b>Nombre:</b> ${nombre}</p>
          <p><b>Email:</b> ${email}</p>
          <p>Fecha: ${new Date().toLocaleString('es-AR')}</p>
        `
      })
    });

    if (!response.ok) {
      const text = await response.text().catch(()=> '');
      console.error('Resend error:', response.status, text);
      return res.status(500).send(`Resend fallo (${response.status}): ${text}`);
    }

    // Redirige al PDF real
    res.writeHead(302, {
      Location: '/docs/ebook-habitos-saludables.pdf'
    });
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la descarga');
  }
}
