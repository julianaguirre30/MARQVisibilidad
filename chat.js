/* ==========================================================================
   MARQ Contigo · Conversaciones de WhatsApp e Instagram dentro de la ficha
   --------------------------------------------------------------------------
   Prototipo: las conversaciones, las respuestas del cliente y la IA están
   simuladas. En producción los mensajes llegarían por la API oficial de
   WhatsApp Business (Meta) y la API de mensajería de Instagram, y las
   sugerencias las generaría un modelo de lenguaje con los datos de la ficha.
   ========================================================================== */

const CHANNEL_LABEL = { whatsapp: 'WhatsApp', instagram: 'Instagram', messenger: 'Messenger' };
// Con número se habla solo por WhatsApp; sin número, por Instagram o Messenger (Meta).
const channelsFor = person => (person.phone ? ['whatsapp'] : ['instagram', 'messenger']);
const chatAt = (daysAgo, time) => { const d = new Date(); d.setDate(d.getDate() - daysAgo); const [h, m] = time.split(':').map(Number); d.setHours(h, m, 0, 0); return d.toISOString(); };
const chatHoursAgo = hours => new Date(Date.now() - hours * 3600000).toISOString();
let chatSeq = 0;
const chatId = () => `m${Date.now().toString(36)}${(chatSeq++).toString(36)}`;
const msg = (from, at, text, att = null) => ({ id: chatId(), from, at, text, att, status: from === 'studio' ? 'read' : undefined });
const todayName = new Intl.DateTimeFormat('es-AR', { weekday: 'long' }).format(new Date());
const planNatalini = { kind: 'project', type: 'plan', src: 'https://estudiomarq.com.ar/wp-content/uploads/2024/07/3-P-6A17.png', name: 'Planta tipo · Pisos 6 a 17', project: 'Torre Natalini' };

// Conversaciones de ejemplo, coherentes con el historial de cada contacto.
const CHAT_SEED = {
  p1: { whatsapp: [
    msg('client', chatAt(9, '19:02'), 'Hola! Vi Torre Panorama en el tótem que está en Natalini. ¿Me pasan información?'),
    msg('studio', chatAt(9, '19:20'), '¡Hola Ana! Gracias por escribirnos. Te armé un espacio con toda la información de Torre Panorama y el equipo que lo lleva adelante. Miralo cuando quieras.'),
    msg('client', chatAt(9, '21:47'), 'Gracias! Lo estoy mirando. Busco mi primer departamento, de 2 dormitorios.'),
    msg('client', chatHoursAgo(21), 'Pedí una visita desde la página. ¿Cuándo podría ir al estudio?')
  ], instagram: [] },
  p2: { whatsapp: [
    msg('client', chatAt(6, '18:41'), 'Hola, ¿cómo están? Quería saber si puedo ver una unidad terminada de 2 dormitorios antes de decidir.'),
    msg('studio', chatAt(6, '18:52'), '¡Hola Diego! Claro que sí. En Torre Natalini tenemos unidades de 2 dormitorios terminadas. ¿Coordinamos una visita a la obra?'),
    msg('studio', chatAt(6, '18:53'), 'Te dejo el plano de la planta tipo para que lo vayas viendo.', planNatalini),
    msg('client', chatAt(6, '19:10'), 'Buenísimo, gracias. Lo miro y les confirmo.'),
    msg('client', chatAt(2, '11:05'), `¿Podría ser el ${todayName} a las 17:30?`),
    msg('studio', chatAt(2, '11:20'), `¡Perfecto! Te esperamos el ${todayName} a las 17:30 en la obra, Formosa 485 esquina Av. Rivadavia.`),
    msg('client', chatHoursAgo(3), '¡Hola! Confirmo lo de hoy. ¿Me podrían pasar fotos del piso 17 con la vista antes de ir?')
  ], instagram: [] },
  p3: { whatsapp: [
    msg('studio', chatAt(5, '10:15'), 'Hola Paula, ¿cómo estás? Te escribo de Estudio MARQ por MARQ Collection. ¿Te gustaría conocer el showroom?'),
    msg('client', chatAt(5, '12:40'), '¡Sí! Vamos con mi pareja. ¿Hay lugar para mascotas en el edificio?'),
    msg('studio', chatAt(5, '12:52'), '¡Sí! MARQ Collection tiene amenities pensados también para mascotas. Te reservo un horario en el showroom.'),
    msg('client', chatHoursAgo(2), '¡Hola! Vamos hoy a las 11 con mi pareja y el perro, ¿hay problema? 🐶')
  ], instagram: [] },
  p5: { whatsapp: [], instagram: [
    msg('client', chatAt(25, '22:10'), 'Hola, ¿tienen lotes con vista a la laguna?'),
    msg('studio', chatAt(24, '09:30'), '¡Hola Carla! Sí, en Pueblo Mío hay lotes frente a la laguna. ¿Te gustaría recorrerlos?'),
    msg('client', chatAt(10, '20:05'), 'Fui a ver Pueblo Mío y Parque Arboledas, me encantaron. Prefiero dos lotes juntos.'),
    msg('client', chatAt(3, '18:44'), '¿Me pasan una propuesta por dos lotes contiguos en 12 cuotas?')
  ] },
  p7: { whatsapp: [
    msg('studio', chatAt(1, '17:40'), 'Hola Lucía, ¿cómo estás? Te escribo de Estudio MARQ por las unidades de 1 dormitorio de Torre Natalini.'),
    msg('client', chatHoursAgo(14), '¡Hola! Sí, gracias. ¿Están terminadas? Es para alquilar.')
  ], instagram: [] },
  p9: { whatsapp: [], instagram: [
    msg('client', chatAt(6, '13:15'), 'Hola, vi la publicidad de la preventa de MARQ Collection. ¿Me cuentan más?'),
    msg('studio', chatAt(6, '13:40'), '¡Hola Martín! Claro. ¿Lo buscás para vivir o como inversión?'),
    msg('client', chatAt(6, '14:02'), 'Inversión. Me interesan dos unidades de 1 dormitorio en pozo.'),
    msg('studio', chatAt(1, '16:30'), 'Te esperamos mañana a las 10 en el showroom para ver las tipologías.'),
    msg('client', chatAt(1, '16:45'), 'Perfecto, ahí estaré.')
  ] },
  p11: { whatsapp: [
    msg('studio', chatAt(3, '09:00'), 'Hola Gustavo, te recordamos la visita a la unidad 14B de Torre Natalini.'),
    msg('client', chatAt(2, '18:10'), 'Perdón por no ir, tuve un imprevisto 🙏')
  ], instagram: [] },
  p13: { whatsapp: [
    msg('client', chatHoursAgo(26), 'Hola, completé el formulario de la preventa. ¿Las unidades de Collection se pueden alquilar?')
  ], instagram: [] }
};
initialPeople.forEach(person => { person.chat = structuredClone(CHAT_SEED[person.id] || { whatsapp: [], instagram: [] }); });
people.forEach(person => { if (!person.chat) person.chat = structuredClone(CHAT_SEED[person.id] || { whatsapp: [], instagram: [] }); });

// Estado de la interfaz (no se guarda).
const chatUi = { channel: {}, tab: {}, draft: {}, menu: false, picker: null, assist: null, typing: {} };

/* ---------- Utilidades ---------- */

const chatMessages = (person, channel) => person.chat?.[channel] || [];
const chatList = (person, channel) => { person.chat ||= {}; return (person.chat[channel] ||= []); };
const lastClientMessage = (person, channel) => [...chatMessages(person, channel)].reverse().find(item => item.from === 'client');
const unanswered = (person, channel) => { const list = chatMessages(person, channel); let count = 0; for (let i = list.length - 1; i >= 0 && list[i].from === 'client'; i--) count++; return count; };
const preferredChannel = person => { const list = channelsFor(person); return list.includes(chatUi.channel[person.id]) ? chatUi.channel[person.id] : list.find(key => chatMessages(person, key).length) || list[0]; };
const clock = iso => new Date(iso).toTimeString().slice(0, 5);
function dayLabel(iso) {
  const date = isoDate(new Date(iso));
  const diff = dayDiff(date);
  if (diff === 0) return 'Hoy';
  if (diff === -1) return 'Ayer';
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' }).format(new Date(iso));
}
// Mensajes de cierre ("¡gracias!", "perfecto") que no necesitan respuesta.
const isAck = text => text.length < 60 && !/\?/.test(text) && /^(¡?\s*)(perfecto|genial|gracias|muchas gracias|dale|ok|buen[ií]simo|joya|qu[eé] lindo|listo)/i.test(text.trim());
const interestedProjects = person => person.projects.map(projectById).filter(Boolean);
const mainProject = person => interestedProjects(person)[0];

/* ---------- IA simulada: resumen, sugerencias y redacción ---------- */

function chatSuggestions(person, channel) {
  const first = firstName(person);
  const project = mainProject(person);
  const meeting = isMeeting(person.nextAction) ? person.nextAction : null;
  const list = chatMessages(person, channel);
  const last = list[list.length - 1];
  const out = [];
  if (!last) {
    out.push(`Hola ${first}, ¿cómo estás? Te escribo de Estudio MARQ por tu consulta${project ? ` sobre ${project.name}` : ''}. ¿Te puedo ayudar en algo?`);
    if (project) out.push(`Hola ${first}, te comparto información de ${project.name}. ¿Querés que coordinemos una visita?`);
    return out;
  }
  if (last.from === 'studio') {
    out.push(`${first}, ¿pudiste ver lo que te mandé? Cualquier duda me escribís.`);
    if (!meeting) out.push('¿Te gustaría venir esta semana a conocer el proyecto en persona?');
    return out;
  }
  const text = last.text.toLowerCase();
  if (isAck(last.text)) {
    out.push(`¡A vos, ${first}! Cualquier consulta me escribís.`);
    if (!meeting) out.push('¿Te gustaría coordinar una visita para verlo en persona?');
    else out.push(`Te espero ${relativeDay(meeting.date).toLowerCase()} a las ${meeting.time} h. ¡Cualquier cosa avisame!`);
    return out;
  }
  const videos = project ? videosFor(project) : [];
  if (/foto|imagen|vista|ver c[oó]mo/.test(text)) {
    out.push(`¡Claro, ${first}! Te paso las fotos${/piso \d+/.test(text) ? ` del ${text.match(/piso \d+/)[0]}` : ''} con la vista.`);
    if (videos.length) out.push(`Te mando también el recorrido en video: «${videos.find(video => text.match(/\d+/) && video.title.includes(text.match(/\d+/)[0]))?.title || videos[0].title}».`);
  }
  if (/plano|planta|metro|m2|superficie/.test(text)) out.push('Te paso los planos de las unidades para que los veas con calma.');
  if (/perd[oó]n|disculp|imprevisto/.test(text)) out.push(`¡No te preocupes, ${first}! ¿Querés que reprogramemos la visita para esta semana?`);
  if (/perro|mascota|gato/.test(text)) out.push('¡Por supuesto, pueden venir con él! El edificio está pensado también para mascotas.');
  if (/alquil|renta|invert/.test(text)) out.push('¡Sí! Muchos de nuestros clientes compran para alquilar. ¿Querés que te cuente cómo funciona?');
  if (/precio|valor|cuota|financ|cuesta|propuesta|cu[aá]nto/.test(text)) out.push('Te preparo una propuesta con los valores actualizados y te la envío hoy mismo.');
  if (/terminad/.test(text)) out.push('¡Sí! Las unidades están terminadas y listas para habitar. ¿Querés venir a verlas?');
  if (/visita|ir a ver|conocer|cu[aá]ndo|horario|hoy|ma[ñn]ana|confirmo/.test(text)) {
    out.push(meeting ? `¡Perfecto! Te esperamos ${relativeDay(meeting.date).toLowerCase()} a las ${meeting.time} h en ${MEETING_PLACES[meeting.place] || meeting.place}.` : `¡Buenísimo, ${first}! ¿Qué día de esta semana te queda bien para venir al estudio?`);
  }
  if (!out.length) out.push(`¡Gracias por escribirnos, ${first}! Enseguida te respondo con la información.`);
  if (!meeting && out.length < 3) out.push('¿Te gustaría coordinar una visita para conocerlo en persona?');
  return [...new Set(out)].slice(0, 3);
}

function chatBrief(person) {
  const first = firstName(person);
  const segment = segmentOf(person);
  const profile = person.profile || {};
  const projects = interestedProjects(person);
  const channel = preferredChannel(person);
  const last = lastClientMessage(person, channel);
  const pending = unanswered(person, channel);
  const meeting = isMeeting(person.nextAction) ? person.nextAction : null;
  const signal = [...(person.signals || [])].sort((a, b) => b.at.localeCompare(a.at))[0];
  const project = projects[0];
  const photos = project ? photosFor(project).length : 0;
  const plans = project ? (officialFor(project.id)?.plans || []).length : 0;
  const videos = project ? videosFor(project).length : 0;
  const what = segment === 'inversor'
    ? `es <b>inversor</b>${profile.goal ? `: busca <b>${esc(profile.goal.toLowerCase())}</b>` : ''}${profile.typology ? ` en ${esc(profile.typology)}` : ''}`
    : `busca <b>vivienda propia</b>${profile.typology ? ` de ${esc(profile.typology)}` : ''}${profile.financing ? ` (${esc(profile.financing.toLowerCase())})` : ''}`;
  const lines = [];
  if (last) lines.push(['💬', `Último mensaje ${esc(relativeTime(last.at).toLowerCase())}: «${esc(last.text.length > 90 ? `${last.text.slice(0, 90)}…` : last.text)}»${pending ? ` · <b>${pending} sin responder</b>` : ''}`]);
  if (meeting) lines.push(['📅', `Reunión <b>${esc(relativeDay(meeting.date).toLowerCase())} a las ${esc(meeting.time)} h</b> en ${esc(MEETING_PLACES[meeting.place] || meeting.place)}.`]);
  else if (person.nextAction) lines.push(['➜', `Próximo paso: ${esc(person.nextAction.text)} (${esc(relativeDay(person.nextAction.date).toLowerCase())}).`]);
  if (signal) lines.push(['◎', `En su showroom: ${esc(signal.label.charAt(0).toLowerCase() + signal.label.slice(1))} (${esc(relativeTime(signal.at).toLowerCase())}).`]);
  if (project && (photos || plans || videos)) lines.push(['◆', `Material listo de ${esc(project.name)}: ${[photos && `${photos} fotos`, plans && `${plans} planos`, videos && `${videos} videos`].filter(Boolean).join(', ')}.`]);
  // Sin IA: un resumen armado con reglas, de todo lo hablado y con foco en lo último.
  const list = chatMessages(person, channel);
  const sentAtt = list.filter(item => item.from === 'studio' && item.att).map(item => item.att.name).filter(Boolean);
  let hint;
  if (!list.length) hint = `Todavía no hay conversación con ${first} por ${CHANNEL_LABEL[channel]}.`;
  else {
    hint = last ? `${first} escribió ${relativeTime(last.at).toLowerCase()}: «${last.text.length > 80 ? `${last.text.slice(0, 80)}…` : last.text}».` : `Se le mandó ${listJoin(sentAtt.slice(-2)) || 'información'}.`;
    hint += pending && last && !isAck(last.text) ? ' Falta responderle.' : ' Está al día.';
  }
  const real = list.length ? aiBrief(person, channel) : null;
  if (real) hint = real;
  return `<div class="ai-brief">
    <span class="ai-brief-label">${icon('sparkles')}Resumen de la conversación <small>${aiEnabled() ? (real ? 'IA' : 'pensando…') : 'IA · simulada'}</small></span>
    <p>${esc(hint)}</p>
    ${aiConnectBox()}
  </div>`;
}

// "Mejorar redacción": ordena lo que escribió la persona sin cambiar lo que quiso decir.
function improveText(text, tone, person) {
  const first = firstName(person);
  let out = ` ${text.trim()} `
    .replace(/\s+/g, ' ')
    .replace(/\b(q|k)\b/gi, 'que').replace(/\b(xq|pq|porq)\b/gi, 'porque').replace(/\btmb\b/gi, 'también')
    .replace(/\bxfa\b/gi, 'por favor').replace(/\bdsp\b/gi, 'después').replace(/\bmsj\b/gi, 'mensaje').replace(/\bhs\b/gi, 'h')
    .replace(/\bcualquier cosa\b/gi, 'cualquier consulta').trim();
  out = out.replace(new RegExp(`\\b${first}\\b`, 'gi'), first);
  out = out.replace(/^(hola|buenas|buen d[ií]a)[\s,!.]*/i, '');
  out = out.replace(new RegExp(`^${first}[\\s,!.]*`, 'i'), '');
  out = out.replace(/\s+(cualquier consulta)/i, '. $1').replace(/\s+(avisame|avisá|me avisás)\s*$/i, ', $1');
  out = out.replace(/(^|[.!?]\s+)([a-záéíóúñ])/g, (m, p, c) => p + c.toUpperCase());
  if (!/[.!?]$/.test(out)) out += '.';
  if (tone === 'formal') {
    out = out.replace(/\bte paso\b/gi, 'te comparto').replace(/\bavisame\b/gi, 'no dudes en escribirnos').replace(/\bdale\b/gi, 'perfecto');
    out = out.charAt(0).toUpperCase() + out.slice(1);
    return `Hola ${first}, ¿cómo estás? ${out} Saludos, Estudio MARQ.`;
  }
  if (tone === 'corto') return `¡Hola ${first}! ${out.split(/(?<=[.!?])\s/)[0]}`;
  return `¡Hola ${first}! ${out}`;
}

/* ---------- Render ---------- */

function attachmentHtml(att) {
  if (!att) return '';
  if (att.kind === 'showroom') return `<a class="wa-link" href="${esc(att.url)}" target="_blank" rel="noopener">${att.src ? `<img src="${esc(att.src)}" alt="" loading="lazy">` : ''}<span><b>${esc(att.name)} · Estudio MARQ</b><small>${esc(plural(att.count || 0, 'proyecto', 'proyectos'))} · planos, brochure y agendar visita</small><em>${esc(att.url.replace(/^https?:\/\//, ''))}</em></span></a>`;
  const tag = att.kind === 'project' ? `<span class="wa-studio-tag">${icon('sparkles')}Del proyecto${att.project ? ` · ${esc(att.project)}` : ''}</span>` : '';
  if (att.type === 'video') return `${tag}<button type="button" class="wa-video" data-chat-video="${esc(att.videoId)}" data-chat-vkind="${esc(att.vkind)}" data-chat-vtitle="${esc(att.name)}"><img src="${esc(att.src)}" alt=""><span>${icon('play')}</span></button><div class="wa-file small"><b>${esc(att.name)}</b><small>Video · ${esc(att.project || '')}</small></div>`;
  if (att.kind === 'doc' || att.type === 'brochure') {
    const ext = (att.ext || (att.url || att.name).split('.').pop() || 'PDF').slice(0, 4).toUpperCase();
    return `${tag}<a class="wa-file" ${att.url ? `href="${esc(att.url)}" target="_blank" rel="noopener"` : ''}><span class="wa-ext">${esc(/^[A-Z]{2,4}$/.test(ext) ? ext : 'PDF')}</span><span><b>${esc(att.name)}</b><small>${esc(att.size || (att.type === 'brochure' ? 'Brochure del proyecto' : 'Documento'))}</small></span></a>`;
  }
  return `${tag}<button type="button" class="wa-image ${att.type === 'plan' ? 'is-plan' : ''}" data-chat-zoom="${esc(att.src)}"><img src="${esc(att.src)}" alt="${esc(att.name || '')}" loading="lazy"></button>${att.type === 'plan' ? `<div class="wa-file small"><b>${esc(att.name)}</b><small>Plano · ${esc(att.project || '')}</small></div>` : ''}`;
}

const ticks = status => status === 'sent' ? '<span class="wa-tick">✓</span>' : status === 'delivered' ? '<span class="wa-tick gray">✓✓</span>' : '<span class="wa-tick read">✓✓</span>';

function chatPanel(person) {
  const channel = preferredChannel(person);
  const tab = chatUi.tab[person.id] || 'chat';
  const list = chatMessages(person, channel);
  const draft = chatUi.draft[person.id] || '';
  let lastDay = '';
  const wall = list.map(item => {
    const day = dayLabel(item.at);
    const sep = day !== lastDay ? `<span class="wa-day">${esc(day)}</span>` : '';
    lastDay = day;
    return `${sep}<div class="wa-msg ${item.from === 'studio' ? 'out' : 'in'} ${item.att ? 'has-att' : ''}">${attachmentHtml(item.att)}${item.text ? `<p>${esc(item.text)}</p>` : ''}<span class="wa-time">${clock(item.at)}${item.from === 'studio' ? ticks(item.status) : ''}</span></div>`;
  }).join('');
  const tabs = channelsFor(person).map(key => {
    const count = unanswered(person, key);
    return `<button type="button" class="chat-tab ${tab === 'chat' && channel === key ? 'on' : ''}" data-chat-channel="${key}"><i class="chat-dot is-${key}">${key === 'whatsapp' ? icon('whatsapp') : key === 'messenger' ? 'm' : '◎'}</i>${CHANNEL_LABEL[key]}${count ? `<em>${count}</em>` : ''}</button>`;
  }).join('');
  const windowNote = channel === 'whatsapp' ? '' : '<span class="chat-window ok">Sin número de teléfono</span>';
  const sugsHidden = chatUi.sugsHidden?.[person.id] === chatSig(person, channel);
  const suggestions = sugsHidden ? [] : (aiSuggestions(person, channel) || chatSuggestions(person, channel));
  const body = tab === 'actividad'
    ? `<div class="chat-activity">${activityPanel(person)}</div>`
    : `<div class="wa-wall" id="wa-wall">${list.length ? wall : `<div class="wa-empty">${icon(channel === 'whatsapp' ? 'whatsapp' : 'sparkles')}<b>Todavía no hay conversación por ${CHANNEL_LABEL[channel]}</b><span>Escribile para empezar.</span></div>`}${chatUi.typing[person.id] ? '<div class="wa-msg in typing"><span></span><span></span><span></span></div>' : ''}</div>
      ${suggestions.length ? `<div class="chat-sugs"><span class="chat-sugs-lead">${icon('sparkles')}Sugerencias</span>${suggestions.map((text, index) => `<button type="button" class="chat-sug" data-chat-sug="${index}" data-text="${esc(text)}">${esc(text)}</button>`).join('')}<button type="button" class="chat-sugs-close" data-chat-sugs-close aria-label="Ocultar sugerencias">${icon('x')}</button></div>` : ''}
      ${chatUi.assist ? assistPanel(person) : ''}
      <div class="chat-composer">
        <button type="button" class="chat-btn ${chatUi.menu ? 'on' : ''}" data-chat-menu aria-label="Adjuntar">${icon('paperclip')}</button>
        ${chatUi.menu ? clipMenu(channel) : ''}
        <textarea id="chat-input" rows="1" placeholder="Escribí un mensaje">${esc(draft)}</textarea>
        <button type="button" class="chat-btn ai ${chatUi.assist ? 'on' : ''}" data-chat-assist aria-label="Mejorar redacción">${icon('sparkles')}</button>
        <button type="button" class="chat-btn send" data-chat-send aria-label="Enviar">${icon('send')}</button>
      </div>
      ${chatUi.picker ? projectPicker(person) : ''}`;
  return `<section class="chat-card" id="chat-panel" data-person="${esc(person.id)}">
    <div class="chat-tabs">${tabs}<button type="button" class="chat-tab ${tab === 'actividad' ? 'on' : ''}" data-chat-activity>Actividad</button>${tab === 'chat' ? windowNote : ''}</div>
    ${body}
    <input type="file" id="chat-file-image" accept="image/*" multiple hidden>
    <input type="file" id="chat-file-doc" accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.zip,.ppt,.pptx" hidden>
  </section>`;
}

const clipMenu = channel => `<div class="chat-clip">
  <button type="button" data-chat-attach="image"><i style="background:#007bfc">${icon('image')}</i><span>Foto o imagen<small>Desde la computadora</small></span></button>
  ${channel !== 'instagram' ? `<button type="button" data-chat-attach="doc"><i style="background:#7f66ff">${icon('file')}</i><span>Documento<small>PDF, planos, presupuestos</small></span></button>` : ''}
  <button type="button" data-chat-attach="project"><i style="background:#b88642">${icon('sparkles')}</i><span>Del proyecto<small>Renders, planos${channel === 'whatsapp' ? ', videos y brochures' : ' y videos'}</small></span></button>
  <p>Sin GIF, stickers ni encuestas${channel === 'instagram' ? ' · Instagram no admite documentos' : ''}</p>
</div>`;

function pickerItems(project, type) {
  const official = officialFor(project.id);
  if (type === 'photo') return photosFor(project).map((item, index) => ({ key: `photo|${item.src}`, type, src: item.src, name: `${project.name} · foto ${index + 1}` }));
  if (type === 'plan') return (official?.plans || []).map((src, index) => ({ key: `plan|${src}`, type, src, name: `Plano ${index + 1} · ${project.name}` }));
  if (type === 'video') return videosFor(project).map(video => ({ key: `video|${video.id}`, type, src: video.thumb || '', name: video.title, videoId: video.id, vkind: video.kind }));
  return brochuresFor(project.id).map(item => ({ key: `brochure|${item.url}`, type: 'brochure', src: '', name: `${item.label.replace(/^Brochure$/, 'Brochure')} · ${project.name}`, url: item.url }));
}

function projectPicker(person) {
  const projects = interestedProjects(person).length ? interestedProjects(person) : projects_forSale();
  const state = chatUi.picker;
  const project = projects.find(item => item.id === state.project) || projects[0];
  state.project = project.id;
  const channel = preferredChannel(person);
  const types = [['photo', 'Fotos y renders'], ['plan', 'Planos'], ['video', 'Videos'], ...(channel === 'whatsapp' ? [['brochure', 'Brochures']] : [])].map(([key, label]) => [key, label, pickerItems(project, key).length]).filter(([key, , count]) => count || key === 'photo');
  if (!types.some(([key]) => key === state.type)) state.type = 'photo';
  const items = pickerItems(project, state.type);
  return `<div class="chat-picker-backdrop" data-chat-picker-close></div>
  <div class="chat-picker" role="dialog" aria-label="Material del proyecto">
    <div class="chat-picker-head"><div><h4>Material del proyecto</h4><p>Lo que envíes queda registrado en la actividad de ${esc(firstName(person))}.</p></div><button type="button" class="dialog-close" data-chat-picker-close aria-label="Cerrar">${icon('x')}</button></div>
    ${projects.length > 1 ? `<div class="chat-picker-projects">${projects.map(item => `<button type="button" class="${item.id === project.id ? 'on' : ''}" data-chat-pproject="${esc(item.id)}">${esc(item.name)}</button>`).join('')}</div>` : ''}
    <div class="chat-picker-tabs">${types.map(([key, label, count]) => `<button type="button" class="${key === state.type ? 'on' : ''}" data-chat-ptype="${key}">${label} · ${count}</button>`).join('')}</div>
    <div class="chat-picker-grid">${items.length ? items.map(item => `<button type="button" class="chat-pitem ${state.selected.includes(item.key) ? 'sel' : ''} ${item.type}" data-chat-pitem="${esc(item.key)}">${item.src ? `<img src="${esc(item.src)}" alt="" loading="lazy">` : `<span class="chat-pdoc">${icon('file')}</span>`}${state.selected.includes(item.key) ? `<i>${state.selected.indexOf(item.key) + 1}</i>` : ''}<span>${item.type === 'video' ? '▶ ' : ''}${esc(item.name)}</span></button>`).join('') : '<p class="admin-empty">Este proyecto todavía no tiene material de este tipo.</p>'}</div>
    <div class="chat-picker-foot"><span>${state.selected.length ? `${state.selected.length} seleccionado${state.selected.length === 1 ? '' : 's'}` : 'Elegí uno o más'}</span><button type="button" class="chat-picker-send" data-chat-psend ${state.selected.length ? '' : 'disabled'}>${icon('send')}Enviar${state.selected.length ? ` ${state.selected.length}` : ''}</button></div>
  </div>`;
}
const projects_forSale = () => projects.filter(project => detailFor(project).forSale);

const improvedDraft = (person, draft, tone) => (aiEnabled() && aiImprove(person, draft, tone)) || improveText(draft, tone, person);

function assistPanel(person) {
  const draft = (chatUi.draft[person.id] || '').trim();
  const tone = chatUi.assist.tone || 'cordial';
  return `<div class="chat-assist">
    <div class="chat-assist-head"><b>${icon('sparkles')}Mejorar redacción</b><button type="button" class="dialog-close" data-chat-assist aria-label="Cerrar">${icon('x')}</button></div>
    ${draft ? `<span class="chat-assist-label">Lo que escribiste</span><p class="chat-assist-before">${esc(draft)}</p>
      <span class="chat-assist-label">Sugerencia</span><p class="chat-assist-after">${esc(improvedDraft(person, draft, tone))}</p>
      <div class="chat-assist-tones">${[['cordial', 'Cordial'], ['formal', 'Más formal'], ['corto', 'Más corto']].map(([key, label]) => `<button type="button" class="${key === tone ? 'on' : ''}" data-chat-tone="${key}">${label}</button>`).join('')}</div>
      <div class="chat-assist-actions"><button type="button" class="admin-primary admin-small" data-chat-use>Usar este texto</button><button type="button" class="admin-secondary admin-small" data-chat-assist>Dejar el mío</button></div>`
      : '<p class="chat-assist-empty">Escribí el mensaje como te salga y te propongo una versión prolija, sin cambiar lo que querés decir.</p>'}
    <small>La IA nunca envía sola. No inventa precios ni fechas.</small>
  </div>`;
}

/* ---------- IA real con Groq (opcional) ----------
   Si la persona pega su clave de Groq, el cliente responde, las sugerencias, el resumen y
   "Mejorar redacción" salen del modelo. Sin clave o si falla la red, quedan las reglas de arriba.
   La clave se guarda solo en este navegador: nunca va al repositorio. */

const GROQ_MODEL = 'openai/gpt-oss-120b';
const GROQ_STORE = 'marq-groq-key';
const groqKey = () => { try { return localStorage.getItem(GROQ_STORE) || window.GROQ_KEY || ''; } catch { return window.GROQ_KEY || ''; } };
// Publicado en Vercel, la IA pasa por /api/groq y la clave queda guardada en el servidor.
let aiProxy = false;
const aiEnabled = () => Boolean(groqKey()) || aiProxy;
const aiCache = { sugs: {}, brief: {}, improve: {}, pending: new Set() };
if (!groqKey() && /^https?:$/.test(location.protocol)) {
  fetch('/api/groq').then(res => (res.ok ? res.json() : null)).then(data => {
    if (!data?.configured) return;
    aiProxy = true;
    if (currentChatPerson()) renderChat({ keepScroll: true, focus: false });
  }).catch(() => {});
}
const AI_RULES = 'Reglas: español rioplatense con voseo siempre (avisame, querés, podés; nunca avísame ni quieres), mensajes cortos como de WhatsApp, sin emojis de más. Nunca inventes precios, cuotas, valores, financiación ni fechas que no estén en los datos; si piden precio, se ofrece enviar una propuesta con valores actualizados.';

async function groq(messages, { json = false, temperature = 0.7 } = {}) {
  const key = groqKey();
  if (!key && !aiProxy) throw new Error('sin clave');
  const res = key
    ? await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: GROQ_MODEL, messages, temperature, max_tokens: 1200, reasoning_effort: 'low', ...(json ? { response_format: { type: 'json_object' } } : {}) }),
    })
    : await fetch('/api/groq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages, json, temperature }) });
  if (!res.ok) { if (res.status === 401 && key) toast('La clave de Groq no es válida'); throw new Error(`Groq ${res.status}`); }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() || '';
  return json ? JSON.parse(text) : text;
}

function personContext(person) {
  return JSON.stringify({
    nombre: person.name, tipo: segmentOf(person), perfil: person.profile, etapa: person.stage,
    proyectos: interestedProjects(person).map(project => project.name),
    proximoPaso: person.nextAction, notas: person.notes,
    historial: (person.history || []).slice(-6),
  });
}

const describeAtt = att => !att ? '' : att.kind === 'showroom' ? `[link a su showroom personal con ${att.count} proyectos, planos, brochure y botón para agendar visita] ` : `[adjunto: ${att.type === 'video' ? 'video' : att.type === 'plan' ? 'plano' : att.kind === 'doc' ? 'documento' : 'foto'} «${att.name || ''}»${att.project ? ` de ${att.project}` : ''}] `;
const transcript = (person, channel, max = 20) => chatMessages(person, channel).slice(-max).map(item => `${item.from === 'client' ? 'Cliente' : 'Estudio'}: ${describeAtt(item.att)}${item.text}`).join('\n');
const chatSig = (person, channel) => `${channel}:${chatMessages(person, channel).slice(-1)[0]?.id || 'vacío'}`;

// Pide algo al modelo una sola vez por estado de la conversación y vuelve a dibujar al llegar.
function aiFetch(bucket, id, sig, task) {
  const tag = `${bucket}|${id}|${sig}`;
  if (!aiEnabled() || aiCache.pending.has(tag) || aiCache[bucket][id]?.sig === sig) return;
  aiCache.pending.add(tag);
  task().then(value => {
    aiCache[bucket][id] = { sig, value };
    if (currentChatPerson()?.id === id.split('|')[0]) renderChat({ keepScroll: true, focus: document.activeElement?.id === 'chat-input' });
  }).catch(() => {}).finally(() => aiCache.pending.delete(tag));
}
const aiValue = (bucket, id, sig) => (aiCache[bucket][id]?.sig === sig ? aiCache[bucket][id].value : null);

function aiSuggestions(person, channel) {
  const sig = chatSig(person, channel);
  aiFetch('sugs', person.id, sig, async () => {
    const out = await groq([
      { role: 'system', content: `Sos asistente del equipo comercial de Estudio MARQ, una desarrolladora inmobiliaria de Resistencia, Chaco. Proponé 3 respuestas distintas que el equipo podría mandarle al cliente por ${CHANNEL_LABEL[channel]}, cada una de 1 o 2 oraciones. ${AI_RULES} Respondé en JSON: {"sugerencias": ["...", "...", "..."]}` },
      { role: 'user', content: `Datos del cliente: ${personContext(person)}\n\nConversación:\n${transcript(person, channel) || '(todavía no hay mensajes)'}` },
    ], { json: true });
    return (out.sugerencias || []).filter(Boolean).slice(0, 3);
  });
  return aiValue('sugs', person.id, sig);
}

function aiBrief(person, channel) {
  const sig = `${chatSig(person, channel)}:${person.history?.length || 0}`;
  aiFetch('brief', person.id, `${sig}:corto`, () => groq([
    { role: 'system', content: `Sos asistente del equipo comercial de Estudio MARQ. Resumí la conversación para alguien del equipo que la retoma, en UNA o DOS oraciones cortas (máximo 30 palabras), usando el nombre del cliente: lo esencial de lo hablado y, sobre todo, qué pidió al final y si falta responderle. No escribas un mensaje para el cliente, no saludes y no des órdenes. No inventes nada que no esté en la conversación.` },
    { role: 'user', content: `Cliente: ${person.name}\n\nConversación completa por ${CHANNEL_LABEL[channel]}:\n${transcript(person, channel, 200) || '(sin mensajes)'}` },
  ], { temperature: 0.4 }));
  return aiValue('brief', person.id, `${sig}:corto`);
}

const TONE_HINT = { cordial: 'cordial y cercano', formal: 'más formal y profesional (sin dejar el voseo)', corto: 'lo más breve posible, una sola oración' };
function aiImprove(person, draft, tone) {
  const id = `${person.id}|${tone}`;
  aiFetch('improve', id, draft, () => groq([
    { role: 'system', content: `Reescribí el mensaje que un vendedor de Estudio MARQ le quiere mandar al cliente ${firstName(person)}. Corregí ortografía y abreviaturas, tono ${TONE_HINT[tone]}. No agregues información nueva ni cambies lo que quiso decir. ${AI_RULES} Devolvé solo el mensaje final, sin comillas.` },
    { role: 'user', content: draft },
  ], { temperature: 0.3 }));
  return aiValue('improve', id, draft);
}

async function aiClientReply(person, channel) {
  return groq([
    { role: 'system', content: `Interpretás a ${person.name}, un cliente real de Estudio MARQ (desarrolladora inmobiliaria de Resistencia, Chaco) que chatea por ${CHANNEL_LABEL[channel]}. Tu perfil: ${personContext(person)}. Respondé SOLO como el cliente al último mensaje del estudio, en 1 a 3 oraciones cortas, natural, como alguien escribiendo en el celular. Podés hacer preguntas, pedir fotos, planos o una visita, o agradecer. No hables como asistente ni menciones que sos una IA.` },
    { role: 'user', content: `Conversación hasta ahora:\n${transcript(person, channel)}\n\nEscribí la próxima respuesta del cliente.` },
  ], { temperature: 0.9 });
}

const aiConnectBox = () => aiEnabled()
  ? ''
  : `<form class="ai-connect" data-ai-form><span>Conectá Groq para que la IA sea real</span><div><input type="password" name="key" placeholder="Pegá tu clave gsk_…" autocomplete="off"><button type="submit">Conectar</button></div><small>Se guarda solo en este navegador. Creala en console.groq.com/keys.</small></form>`;

/* ---------- Acciones ---------- */

const currentChatPerson = () => personById(companyView.querySelector('#chat-panel')?.dataset.person);

function renderChat({ keepScroll = false, focus = true } = {}) {
  const panel = companyView.querySelector('#chat-panel');
  const person = currentChatPerson();
  if (!panel || !person) return;
  const wall = panel.querySelector('#wa-wall');
  const scroll = wall?.scrollTop;
  const typing = document.activeElement?.id === 'chat-input' && !chatUi.picker && !chatUi.menu;
  if (typing && wall) {
    // Mientras se escribe no se toca el cuadro de texto: en el celular, reemplazarlo cierra el teclado.
    const next = document.createElement('div');
    next.innerHTML = chatPanel(person);
    const swap = selector => { const old = panel.querySelector(selector); const fresh = next.querySelector(selector); if (old && fresh) old.replaceWith(fresh); return fresh; };
    swap('.chat-tabs');
    swap('#wa-wall');
    panel.querySelector('.chat-sugs')?.remove();
    const sugs = next.querySelector('.chat-sugs');
    if (sugs) panel.querySelector('.chat-assist, .chat-composer')?.before(sugs);
    const input = panel.querySelector('#chat-input');
    const draft = chatUi.draft[person.id] || '';
    if (input.value !== draft) { input.value = draft; input.setSelectionRange(draft.length, draft.length); }
    autoGrow(input);
  } else {
    panel.outerHTML = chatPanel(person);
  }
  const fresh = companyView.querySelector('#wa-wall');
  if (fresh) fresh.scrollTop = keepScroll && scroll !== undefined ? scroll : fresh.scrollHeight;
  const brief = companyView.querySelector('.ai-brief');
  if (brief) brief.outerHTML = chatBrief(person);
  if (typing) return;
  const input = companyView.querySelector('#chat-input');
  if (input) { autoGrow(input); if (focus && !chatUi.picker && !isPhone()) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); } }
}

/* ---------- Celular: el chat ocupa el espacio que deja el teclado, como en WhatsApp ---------- */
const isPhone = () => matchMedia('(max-width: 640px)').matches;
function fitToKeyboard() {
  const view = window.visualViewport;
  document.documentElement.style.setProperty('--vv-top', `${view ? view.offsetTop : 0}px`);
  document.documentElement.style.setProperty('--vv-height', `${view ? view.height : innerHeight}px`);
  const wall = companyView.querySelector('#wa-wall');
  if (wall && document.body.classList.contains('chat-typing')) wall.scrollTop = wall.scrollHeight;
}
window.visualViewport?.addEventListener('resize', fitToKeyboard);
window.visualViewport?.addEventListener('scroll', fitToKeyboard);
companyView.addEventListener('focusin', event => {
  if (event.target.id !== 'chat-input' || !isPhone()) return;
  document.body.classList.add('chat-typing');
  fitToKeyboard();
});
companyView.addEventListener('focusout', event => {
  if (event.target.id !== 'chat-input') return;
  setTimeout(() => { if (document.activeElement?.id !== 'chat-input') document.body.classList.remove('chat-typing'); }, 120);
});
// Tocar enviar o una sugerencia no debe cerrar el teclado.
companyView.addEventListener('pointerdown', event => {
  if (document.activeElement?.id === 'chat-input' && event.target.closest('[data-chat-send],[data-chat-sug],[data-chat-sugs-close]')) event.preventDefault();
});

function autoGrow(input) { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 140)}px`; }

function logChat(person, channel, note) {
  person.history.push({ date: todayIso(), channel: CHANNEL_LABEL[channel], note });
}

function sendMessage(person, { text = '', att = null } = {}) {
  const channel = preferredChannel(person);
  const item = { id: chatId(), from: 'studio', at: new Date().toISOString(), text: text.trim(), att, status: 'sent' };
  chatList(person, channel).push(item);
  logChat(person, channel, att ? `Envió ${att.name}${att.project ? ` (${att.project})` : ''} por ${CHANNEL_LABEL[channel]}.` : `Mensaje por ${CHANNEL_LABEL[channel]}: “${item.text.length > 80 ? `${item.text.slice(0, 80)}…` : item.text}”`);
  savePeople();
  setTimeout(() => { item.status = 'delivered'; savePeople(); if (currentChatPerson()?.id === person.id) renderChat({ keepScroll: true, focus: false }); }, 900);
  setTimeout(() => { item.status = 'read'; savePeople(); if (currentChatPerson()?.id === person.id) renderChat({ keepScroll: true, focus: false }); }, 2600);
  return item;
}

// Respuesta simulada del cliente, para que la demo se sienta viva.
function simulateReply(person, channel, sent) {
  const answers = sent.some(item => item.att?.type === 'video') ? '¡Qué lindo el recorrido! Gracias 🙌'
    : sent.some(item => item.att?.type === 'plan') ? 'Genial, lo reviso con calma y te aviso.'
    : sent.some(item => item.att) ? '¡Gracias! Me encantan.'
    : /\?\s*$/.test(sent[sent.length - 1].text) ? 'Sí, dale. Me viene bien.'
    : 'Perfecto, ¡muchas gracias!';
  const reply = aiEnabled() ? aiClientReply(person, channel).catch(() => answers) : Promise.resolve(answers);
  const typingAt = new Promise(done => setTimeout(done, 3200));
  typingAt.then(() => { chatUi.typing[person.id] = true; if (currentChatPerson()?.id === person.id) renderChat({ keepScroll: false, focus: false }); });
  Promise.all([reply, typingAt.then(() => new Promise(done => setTimeout(done, 2000)))]).then(([text]) => {
    chatUi.typing[person.id] = false;
    chatList(person, channel).push({ id: chatId(), from: 'client', at: new Date().toISOString(), text: text || answers });
    savePeople();
    if (currentChatPerson()?.id === person.id) renderChat({ focus: false });
  });
}

function sendDraft(person) {
  const channel = preferredChannel(person);
  const text = (chatUi.draft[person.id] || '').trim();
  if (!text) { toast('Escribí un mensaje'); return; }
  const item = sendMessage(person, { text });
  chatUi.draft[person.id] = ''; chatUi.assist = null;
  renderChat();
  simulateReply(person, channel, [item]);
}

// Las imágenes se achican antes de guardarlas para no llenar el almacenamiento del navegador.
function shrinkImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 900 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = () => resolve(null);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

companyView.addEventListener('click', event => {
  const target = event.target.closest('[data-chat-sugs-close],[data-chat-channel],[data-chat-activity],[data-chat-menu],[data-chat-attach],[data-chat-assist],[data-chat-tone],[data-chat-use],[data-chat-sug],[data-chat-send],[data-chat-picker-close],[data-chat-pproject],[data-chat-ptype],[data-chat-pitem],[data-chat-psend],[data-chat-zoom],[data-chat-video],[data-chat-profile],[data-chat-focus]');
  if (!target) return;
  const person = currentChatPerson() || personById(target.dataset.chatFocus);
  if (!person) return;
  const d = target.dataset;
  if (d.chatSugsClose !== undefined) { (chatUi.sugsHidden ||= {})[person.id] = chatSig(person, preferredChannel(person)); renderChat({ keepScroll: true, focus: false }); return; }
  if (d.chatFocus !== undefined) { chatUi.tab[person.id] = 'chat'; renderChat(); companyView.querySelector('#chat-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (d.chatChannel) { chatUi.channel[person.id] = d.chatChannel; chatUi.tab[person.id] = 'chat'; chatUi.menu = false; chatUi.picker = null; renderChat(); }
  else if (d.chatActivity !== undefined) { chatUi.tab[person.id] = 'actividad'; chatUi.menu = false; renderChat({ focus: false }); }
  else if (d.chatMenu !== undefined) { chatUi.menu = !chatUi.menu; chatUi.assist = null; renderChat({ keepScroll: true, focus: false }); }
  else if (d.chatAttach) {
    chatUi.menu = false;
    if (d.chatAttach === 'project') { chatUi.picker = { project: mainProject(person)?.id, type: 'photo', selected: [] }; renderChat({ keepScroll: true, focus: false }); }
    else { renderChat({ keepScroll: true, focus: false }); companyView.querySelector(d.chatAttach === 'image' ? '#chat-file-image' : '#chat-file-doc').click(); }
  }
  else if (d.chatAssist !== undefined) { chatUi.assist = chatUi.assist ? null : { tone: 'cordial' }; chatUi.menu = false; renderChat({ keepScroll: true }); }
  else if (d.chatTone) { chatUi.assist.tone = d.chatTone; renderChat({ keepScroll: true }); }
  else if (d.chatUse !== undefined) { chatUi.draft[person.id] = improvedDraft(person, (chatUi.draft[person.id] || '').trim(), chatUi.assist.tone); chatUi.assist = null; renderChat({ keepScroll: true }); }
  else if (d.chatSug !== undefined) { chatUi.draft[person.id] = d.text || chatSuggestions(person, preferredChannel(person))[Number(d.chatSug)]; renderChat({ keepScroll: true }); }
  else if (d.chatSend !== undefined) sendDraft(person);
  else if (d.chatPickerClose !== undefined) { chatUi.picker = null; renderChat({ keepScroll: true }); }
  else if (d.chatPproject) { chatUi.picker = { project: d.chatPproject, type: 'photo', selected: [] }; renderChat({ keepScroll: true, focus: false }); }
  else if (d.chatPtype) { chatUi.picker.type = d.chatPtype; renderChat({ keepScroll: true, focus: false }); }
  else if (d.chatPitem) {
    const list = chatUi.picker.selected;
    chatUi.picker.selected = list.includes(d.chatPitem) ? list.filter(key => key !== d.chatPitem) : [...list, d.chatPitem];
    renderChat({ keepScroll: true, focus: false });
  }
  else if (d.chatPsend !== undefined) {
    const project = projectById(chatUi.picker.project);
    const all = ['photo', 'plan', 'video', 'brochure'].flatMap(type => pickerItems(project, type));
    const chosen = chatUi.picker.selected.map(key => all.find(item => item.key === key)).filter(Boolean);
    const caption = (chatUi.draft[person.id] || '').trim();
    const sent = chosen.map((item, index) => sendMessage(person, { text: index === chosen.length - 1 ? caption : '', att: { kind: 'project', type: item.type, src: item.src, name: item.name, project: project.name, url: item.url, videoId: item.videoId, vkind: item.vkind } }));
    chatUi.picker = null; chatUi.draft[person.id] = '';
    renderChat();
    toast(`${sent.length === 1 ? 'Se envió 1 archivo' : `Se enviaron ${sent.length} archivos`} de ${project.name}`);
    simulateReply(person, preferredChannel(person), sent);
  }
  else if (d.chatZoom) openLightbox(d.chatZoom, 'Imagen de la conversación');
  else if (d.chatVideo) openLightbox(null, d.chatVtitle, { kind: d.chatVkind, id: d.chatVideo, title: d.chatVtitle, vertical: true });
  else if (d.chatProfile !== undefined) companyView.querySelector('.contact-aside')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

companyView.addEventListener('input', event => {
  if (event.target.id !== 'chat-input') return;
  const person = currentChatPerson(); if (!person) return;
  chatUi.draft[person.id] = event.target.value;
  autoGrow(event.target);
  if (chatUi.assist) {
    clearTimeout(chatUi.assistTimer);
    chatUi.assistTimer = setTimeout(() => {
      const box = companyView.querySelector('.chat-assist');
      if (box) box.outerHTML = assistPanel(person);
    }, aiEnabled() ? 700 : 0);
  }
});

companyView.addEventListener('keydown', event => {
  if (event.target.id === 'chat-input' && event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); const person = currentChatPerson(); if (person) sendDraft(person); }
  if (event.key === 'Escape' && (chatUi.picker || chatUi.menu || chatUi.assist)) { chatUi.picker = null; chatUi.menu = false; chatUi.assist = null; renderChat({ keepScroll: true }); }
});

companyView.addEventListener('change', async event => {
  if (event.target.id !== 'chat-file-image' && event.target.id !== 'chat-file-doc') return;
  const person = currentChatPerson(); if (!person) return;
  const files = [...event.target.files];
  const caption = (chatUi.draft[person.id] || '').trim();
  const sent = [];
  for (const [index, file] of files.entries()) {
    const text = index === files.length - 1 ? caption : '';
    if (event.target.id === 'chat-file-image') {
      const src = await shrinkImage(file);
      if (src) sent.push(sendMessage(person, { text, att: { kind: 'image', src, name: file.name } }));
    } else {
      const kb = file.size / 1024;
      sent.push(sendMessage(person, { text, att: { kind: 'doc', name: file.name, ext: file.name.split('.').pop(), size: kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(kb))} KB` } }));
    }
  }
  if (!sent.length) return;
  chatUi.draft[person.id] = '';
  renderChat();
  simulateReply(person, preferredChannel(person), sent);
});

// "Enviar" del showroom: manda el link como tarjeta en la conversación, igual que una vista previa de WhatsApp.
companyView.addEventListener('click', event => {
  const button = event.target.closest('[data-chat-showroom]');
  if (!button) return;
  const person = personById(button.dataset.chatShowroom);
  if (!person?.showroom) return;
  const channel = preferredChannel(person);
  chatUi.tab[person.id] = 'chat';
  const cover = projectById(person.showroom.projects[0]);
  const item = sendMessage(person, { text: showroomMessage(person), att: { kind: 'showroom', url: showroomUrl(person), name: `Showroom de ${firstName(person)}`, src: cover ? photosFor(cover)[0]?.src || cover.image : '', count: person.showroom.projects.length } });
  renderChat({ focus: false });
  companyView.querySelector('#chat-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  toast(`Showroom enviado por ${CHANNEL_LABEL[channel]}`);
  simulateReply(person, channel, [item]);
});

companyView.addEventListener('submit', event => {
  if (!event.target.matches('[data-ai-form]')) return;
  event.preventDefault();
  const key = event.target.key.value.trim();
  if (!/^gsk_/.test(key)) { toast('La clave de Groq empieza con gsk_'); return; }
  try { localStorage.setItem(GROQ_STORE, key); } catch {}
  toast('IA conectada');
  renderChat({ keepScroll: true, focus: false });
});

companyView.addEventListener('click', event => {
  if (!event.target.closest('[data-ai-disconnect]')) return;
  try { localStorage.removeItem(GROQ_STORE); } catch {}
  aiCache.sugs = {}; aiCache.brief = {}; aiCache.improve = {};
  toast('IA desconectada');
  renderChat({ keepScroll: true, focus: false });
});
