// api/resolve.js  –  Vercel serverless function
import playwright from 'playwright-aws-lambda';

export default async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Falta url' });

  try {
    const browser = await playwright.launchChromium({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    // Espera el <video> y captura su src
    const src = await page.$eval('video', v => v.src);
    await browser.close();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.redirect(src);   // 302 al vídeo real
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
