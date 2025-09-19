const OpenAI = require('openai');

let OPENAI_API_KEY = process.env.OPENAI_API_KEY;
try {
  const local = require('../local-secret');
  if (local && local.OPENAI_API_KEY) OPENAI_API_KEY = local.OPENAI_API_KEY;
} catch (_) {}
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function askAI(req, res) {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Be concise and clear.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const content = completion.choices?.[0]?.message?.content || '';
    return res.json({ answer: content });
  } catch (err) {
    console.error('askAI error:', err);
    return res.status(500).json({ error: 'AI request failed', message: err.message });
  }
}

module.exports = { askAI };


