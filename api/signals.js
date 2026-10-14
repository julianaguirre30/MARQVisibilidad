// Función de Vercel: guarda lo que cada cliente hace en su showroom (desde cualquier dispositivo)
// para que el equipo lo vea en MARQ Contigo. Usa una base Redis de Upstash conectada desde Vercel → Storage.

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'marq:signals';
const KEEP = 1000;
const TYPES = ['open', 'view', 'brochure', 'visit', 'profile', 'like', 'nope', 'doubt', 'simulate', 'proposal'];

const redis = command => fetch(URL_, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(command),
}).then(res => res.json());

const text = (value, max) => (typeof value === 'string' && value.length <= max ? value : null);

export default async function handler(req, res) {
  if (!URL_ || !TOKEN) return res.status(200).json({ configured: false, signals: [] });

  if (req.method === 'GET') {
    const { result = [] } = await redis(['LRANGE', KEY, -500, -1]);
    const signals = result.map(item => { try { return JSON.parse(item); } catch { return null; } }).filter(Boolean);
    return res.status(200).json({ configured: true, signals });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const signal = {
      id: text(body.id, 40), personId: text(body.personId, 40), name: text(body.name, 40) || '',
      type: TYPES.includes(body.type) ? body.type : null, projectId: text(body.projectId, 60),
      label: text(body.label, 160), at: new Date().toISOString(),
    };
    if (!signal.id || !signal.personId || !signal.type || !signal.label) return res.status(400).json({ error: 'Pedido inválido' });
    await redis(['RPUSH', KEY, JSON.stringify(signal)]);
    await redis(['LTRIM', KEY, -KEEP, -1]);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
