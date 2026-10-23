/**
 * Boleto de cotización como imagen (1200x630), para la vista previa de WhatsApp.
 * Lo usan api/boleto.js (la página /boleto) y api/boleto-img.js (la imagen /boleto.png).
 * Los datos llegan en el enlace: ?n=nombre&t=tipo&o=origen&d=destino&i=ida&r=regreso&p=pasajeros
 */
import { readFile } from 'node:fs/promises';
import { ImageResponse } from '@vercel/og';

// Datos de la empresa (cámbialos para cada cliente)
export const MARCA = 'Buses Demo';
const COLORES = { fondo: '#FFC61A', papel: '#FFFDF7', tinta: '#141517', gris: '#4a4c4f', acento: '#E2412E', talon: '#141517', texto: '#F2ECDF' };

const CAMPOS = { n: 'nombre', t: 'tipo', o: 'origen', d: 'destino', i: 'ida', r: 'vuelta', p: 'pasajeros' };

/** Lee los datos del enlace, limpios y con largo máximo. */
export function datos(url) {
	const q = new URL(url).searchParams;
	const out = {};
	for (const [k, nombre] of Object.entries(CAMPOS)) {
		out[nombre] = (q.get(k) || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 40);
	}
	out.pasajeros = out.pasajeros.replace(/\D/g, '').slice(0, 3);
	out.numero = String(numero(q.toString())).padStart(5, '0');
	return out;
}

/** Fecha 2026-11-12 → 12-11-2026 */
export function fecha(v) {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
	return m ? `${m[3]}-${m[2]}-${m[1]}` : v;
}

/** Ruta del viaje: "Ovalle → Pucón", o solo el destino. */
export function ruta(d) {
	return [d.origen, d.destino].filter(Boolean).join(' → ') || 'Viaje a cotizar';
}

/** El enlace para la imagen, con los mismos datos. */
export function query(url) {
	return new URL(url).search;
}

function numero(s) {
	let h = 5381;
	for (let i = 0; i < s.length; i++) { h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; }
	return h % 100000;
}

// Elemento para Satori (sin JSX): todos los div con display flex.
function h(type, style, ...children) {
	const kids = children.flat().filter((c) => c !== null && c !== undefined && c !== false && c !== '');
	return { type, props: { style: { display: 'flex', ...style }, children: kids.length === 1 ? kids[0] : kids } };
}

let fuentes;
async function cargarFuentes() {
	if (!fuentes) {
		const [d800, d900, script, sans4, sans7, mono] = await Promise.all([
			readFile(new URL('./_fuentes/big-shoulders-display-800.ttf', import.meta.url)),
			readFile(new URL('./_fuentes/big-shoulders-display-900.ttf', import.meta.url)),
			readFile(new URL('./_fuentes/yellowtail-400.ttf', import.meta.url)),
			readFile(new URL('./_fuentes/overpass-400.ttf', import.meta.url)),
			readFile(new URL('./_fuentes/overpass-700.ttf', import.meta.url)),
			readFile(new URL('./_fuentes/overpass-mono-700.ttf', import.meta.url)),
		]);
		fuentes = [
			{ name: 'Display', data: d800, weight: 800 },
			{ name: 'Display', data: d900, weight: 900 },
			{ name: 'Script', data: script, weight: 400 },
			{ name: 'Sans', data: sans4, weight: 400 },
			{ name: 'Sans', data: sans7, weight: 700 },
			{ name: 'Mono', data: mono, weight: 700 },
		];
	}
	return fuentes;
}

const etiqueta = (texto, color = COLORES.gris) =>
	h('div', { fontFamily: 'Mono', fontWeight: 700, fontSize: 16, letterSpacing: 3, color, textTransform: 'uppercase' }, texto);

function campo(titulo, valor) {
	return h('div', { flexDirection: 'column', width: '50%', marginTop: 22, paddingRight: 20 },
		etiqueta(titulo),
		h('div', { fontFamily: 'Sans', fontWeight: 700, fontSize: 31, color: COLORES.tinta, marginTop: 6, lineHeight: 1.1 }, valor || '—'));
}

function codigoDeBarras(semilla) {
	const barras = [];
	let s = Number(semilla) + 7;
	for (let i = 0; i < 34; i++) {
		s = (s * 1103515245 + 12345) % 2147483648;
		barras.push(h('div', { width: 2 + (s % 4) * 2, height: 64, background: COLORES.texto, marginRight: 2 + ((s >> 3) % 3) * 2 }));
	}
	return h('div', { flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden', width: '100%' }, barras);
}

/** La imagen PNG del boleto. */
export async function imagen(d) {
	const textoRuta = ruta(d).toUpperCase();
	const tam = Math.min(96, Math.floor(700 / (0.44 * textoRuta.length))); // que quepa en una línea
	const partes = textoRuta.split(' → ');
	const lineaRuta = partes.length === 2
		? [partes[0], h('span', { fontFamily: 'Sans', fontWeight: 700, fontSize: tam * 0.62, margin: `0 ${Math.round(tam * 0.2)}px`, flexShrink: 0, color: COLORES.acento }, '→'), partes[1]]
		: [textoRuta];

	const boleto = h('div', { width: '100%', height: '100%', background: COLORES.fondo, padding: 44, alignItems: 'center', justifyContent: 'center',
		backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.04) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.04) 75%, transparent 75%)',
		backgroundSize: '48px 48px' },
		h('div', { width: 1112, height: 542, borderRadius: 18, overflow: 'hidden', boxShadow: '0 26px 44px -22px rgba(0,0,0,0.55)' },
			// Cuerpo del boleto
			h('div', { flexDirection: 'column', justifyContent: 'space-between', width: 812, flexShrink: 0, background: COLORES.papel, padding: '34px 44px 34px' },
				h('div', { justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '2px dashed rgba(0,0,0,0.18)' },
					h('div', { fontFamily: 'Script', fontSize: 56, color: COLORES.acento, lineHeight: 1 }, MARCA),
					etiqueta('Solicitud de cotización')),
				h('div', { flexDirection: 'column', marginTop: 24 },
					etiqueta('Recorrido'),
					h('div', { fontFamily: 'Display', fontWeight: 900, fontSize: tam, color: COLORES.tinta, lineHeight: 1, marginTop: 8, alignItems: 'center' }, lineaRuta)),
				h('div', { flexWrap: 'wrap' },
					campo('Pasajero', d.nombre),
					campo('Tipo de viaje', d.tipo),
					campo('Ida', fecha(d.ida)),
					campo('Regreso', fecha(d.vuelta)))),
			// Talón
			h('div', { position: 'relative', flexDirection: 'column', justifyContent: 'space-between', width: 300, flexShrink: 0, background: COLORES.talon, padding: '34px 32px 32px', borderLeft: '3px dashed rgba(242,236,223,0.35)' },
				h('div', { position: 'absolute', left: -24, top: -24, width: 44, height: 44, borderRadius: 22, background: COLORES.fondo }),
				h('div', { position: 'absolute', left: -24, bottom: -24, width: 44, height: 44, borderRadius: 22, background: COLORES.fondo }),
				etiqueta(`N° ${d.numero}`, COLORES.fondo),
				h('div', { flexDirection: 'column' },
					etiqueta('Pasajeros', 'rgba(242,236,223,0.7)'),
					h('div', { fontFamily: 'Display', fontWeight: 900, fontSize: d.pasajeros.length > 2 ? 140 : 170, color: COLORES.fondo, lineHeight: 0.9, marginTop: 6 }, d.pasajeros || '—')),
				codigoDeBarras(d.numero))));

	return new ImageResponse(boleto, {
		width: 1200,
		height: 630,
		fonts: await cargarFuentes(),
		headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
	});
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** La página /boleto: muestra el boleto y trae las etiquetas para la vista previa de WhatsApp. */
export function pagina(url) {
	const d = datos(url);
	const origen = new URL(url).origin;
	const img = `${origen}/boleto.png${query(url)}`;
	const titulo = `Cotización: ${ruta(d)}${d.pasajeros ? ` · ${d.pasajeros} pasajeros` : ''}`;
	const detalle = [d.nombre, d.tipo, d.ida && `Ida ${fecha(d.ida)}`, d.vuelta && `Regreso ${fecha(d.vuelta)}`].filter(Boolean).join(' · ');
	return `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(titulo)} · ${esc(MARCA)}</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(MARCA)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(detalle || 'Solicitud de cotización')}">
<meta property="og:image" content="${esc(img)}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(titulo)}">
<meta name="twitter:card" content="summary_large_image">
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;gap:20px;padding:24px 16px;box-sizing:border-box;background:#141517;color:#F2ECDF;font:16px/1.5 system-ui,sans-serif;text-align:center}
img{display:block;width:100%;max-width:900px;height:auto;border-radius:12px}
a{color:#FFC61A}
</style>
</head>
<body>
<main>
<img src="${esc(img)}" width="1200" height="630" alt="${esc(titulo)}">
<p>${esc(detalle)}</p>
<p><a href="/">Volver a ${esc(MARCA)}</a></p>
</main>
</body>
</html>`;
}
