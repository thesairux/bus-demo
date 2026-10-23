// /boleto → página con el boleto y la vista previa para WhatsApp (ver api/_boleto.js)
import { pagina } from './_boleto.js';

export function GET(request) {
	return new Response(pagina(request.url), {
		headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
	});
}
