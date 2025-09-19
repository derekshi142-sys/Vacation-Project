const fetch = require('node-fetch');

function getSerperKey() {
  try {
    if (process.env.SERPER_API_KEY) return process.env.SERPER_API_KEY;
    // fallback to local-secret.js (gitignored)
    // eslint-disable-next-line global-require, import/no-unresolved
    const { SERPER_API_KEY } = require('../local-secret');
    return SERPER_API_KEY;
  } catch (_) {
    return null;
  }
}

exports.serperSearch = async (req, res) => {
  try {
    const apiKey = getSerperKey();
    if (!apiKey) {
      return res.status(500).json({ error: 'Serper API key not configured on server' });
    }

    const { q, gl = 'us', hl = 'en', num = 10, type = 'search' } = req.body || {};
    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({ error: 'Missing q (query) in body' });
    }

    const endpoint = `https://google.serper.dev/${type}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({ q, gl, hl, num }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'Serper error', details: text });
    }

    const data = await response.json();
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('Serper proxy error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};



