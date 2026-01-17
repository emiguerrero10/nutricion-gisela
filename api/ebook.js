export default async function handler(req, res) {
  const { nombre = 'Anónimo', email = 'No informado' } = req.query;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Web Nutrición <onboarding@resend.dev>',
        to: ['guerreroemilio.a@gmail.com'], // 🔴 CAMBIAR por el mail real de Gisela
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
      throw new Error('Error enviando email');
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
