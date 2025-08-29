// /api/stream.js  –  Vercel Serverless Function
import fetch from 'node-fetch';

export default async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({error: 'Falta url'});

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await r.text();

    // Regex universal para .m3u8 / .mp4
    const match = html.match(/https?:\/\/[^"']+\.(?:m3u8|mp4)(?:\?[^"'\s]*)?/i);
    const direct = match ? match[0] : url;

    // 302 redirect al vídeo real
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.redirect(direct);
  } catch {
    res.status(500).json({error: 'Error al resolver'});
  }
};
