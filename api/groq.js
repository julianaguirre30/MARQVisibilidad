// Función de Vercel: hace de intermediaria con Groq para que la clave nunca llegue al navegador.
// La clave se configura en Vercel → Settings → Environment Variables → GROQ_API_KEY.

const MODEL = 'openai/gpt-oss-120b';
const MAX_MESSAGES = 30;
const MAX_CHARS = 40000;
const PER_MINUTE = 30;
const hits = new Map(); // límite simple por IP (se reinicia con cada instancia, alcanza para un prototipo)

function tooMany(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(at => now - at < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > PER_MINUTE;
}

export default async function handler(req, res) {
  const key = process.env.GROQ_API_KEY;
  if (req.method === 'GET') return res.status(200).json({ configured: Boolean(key) });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  if (!key) return res.status(503).json({ error: 'Falta configurar GROQ_API_KEY en Vercel' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'anon';
  if (tooMany(ip)) return res.status(429).json({ error: 'Demasiados pedidos, probá en un minuto' });

  const { messages, json = false, temperature = 0.7 } = req.body || {};
  const valid = Array.isArray(messages) && messages.length > 0 && messages.length <= MAX_MESSAGES
    && messages.every(item => ['system', 'user', 'assistant'].includes(item?.role) && typeof item.content === 'string')
    && messages.reduce((total, item) => total + item.content.length, 0) <= MAX_CHARS;
  if (!valid) return res.status(400).json({ error: 'Pedido inválido' });

  const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL, messages, max_tokens: 1200, reasoning_effort: 'low',
      temperature: Math.min(Math.max(Number(temperature) || 0.7, 0), 1.2),
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  const data = await upstream.json().catch(() => ({}));
  return res.status(upstream.status).json(data);
}
