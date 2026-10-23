// /boleto.png → imagen del boleto de cotización (ver api/_boleto.js)
import { datos, imagen } from './_boleto.js';

export async function GET(request) {
	return imagen(datos(request.url));
}
