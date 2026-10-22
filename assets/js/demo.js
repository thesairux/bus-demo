/**
 * Ajustes de la demo (estática) de Altiro Rutas.
 * En la página real de cada cliente, la solicitud llega a su correo y a su panel; aquí se simula.
 */
(function () {
	'use strict';

	// Cambia a false para ocultar la etiqueta "Demo · Altiro Rutas".
	var MOSTRAR_ETIQUETA = true;

	var form = document.querySelector('[data-quote]');

	// 1. Destino precargado desde el enlace (?destino=Pucón).
	try {
		var dest = new URLSearchParams(window.location.search).get('destino');
		if (form && dest) {
			var input = form.querySelector('[name="sb_destino"]');
			if (input) {
				input.value = dest;
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}
	} catch (e) {}

	// 2. "Enviar solicitud": en la demo no hay servidor, se muestra un aviso.
	if (form) {
		form.addEventListener('submit', function (e) {
			if (e.defaultPrevented) { return; } // faltan datos: ya lo marcó el validador
			e.preventDefault();
			var main = form.querySelector('.ticket-form__main');
			var old = form.querySelector('.notice');
			if (old) { old.remove(); }
			var p = document.createElement('p');
			p.className = 'notice notice--ok';
			p.setAttribute('role', 'status');
			p.textContent = '¡Gracias! Esta es una demostración: en la página real, la solicitud llega al correo de ventas y queda guardada en el panel de cotizaciones.';
			var fields = form.querySelector('.fields');
			if (main && fields) { main.insertBefore(p, fields); } else { form.prepend(p); }
			p.scrollIntoView({ behavior: 'smooth', block: 'center' });
		});
	}

	// 3. Etiqueta discreta de demo.
	var closed = false;
	try { closed = sessionStorage.getItem('demo-badge') === 'off'; } catch (e) {}
	if (MOSTRAR_ETIQUETA && !closed) {
		var b = document.createElement('div');
		b.className = 'demo-badge';
		b.innerHTML = '<span class="demo-badge__dot"></span><span>Demo · Altiro Rutas</span><button type="button" aria-label="Ocultar">×</button>';
		b.querySelector('button').addEventListener('click', function () {
			b.remove();
			try { sessionStorage.setItem('demo-badge', 'off'); } catch (e) {}
		});
		document.body.appendChild(b);
	}
})();
