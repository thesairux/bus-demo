# Demo Altiro Rutas: página para empresas de buses y turismo

Plantilla de ejemplo para mostrar a clientes de **Altiro Rutas**. Es una empresa ficticia llamada
**Buses Demo**, sin nombres ni datos reales: teléfono `+56 9 0000 0000`, correo `ventas@busesdemo.cl`
y dirección `Calle Demo 123, Tu ciudad`.

Los botones de WhatsApp de la demo (y la cotización del formulario) llegan al WhatsApp de Altiro, +56 9 5936 1307,
para ver cuando alguien la prueba. En la página de cada cliente se cambia por su número (ver abajo).

Qué trae:

- **Portada** con tablero de salidas animado (42 destinos), boletos de servicios, recorrido de norte a sur,
  flota, pasos para viajar, clientes y formulario de cotización.
- **Turismo nacional** por zonas (Norte, Centro, Sur, Patagonia) con fotos de destinos.
- **Turismo internacional** y 3 **programas** con valores e itinerarios de ejemplo
  (Mendoza, Sur de Chile y Bariloche, Portillo en invierno).
- **Giras de estudio**, **Servicios**, **Flota** (4 buses de ejemplo), **Empresa**, **Clientes** y **Contacto**.
- **Cotización** en forma de boleto: se envía ordenada por WhatsApp. En la demo, «Enviar solicitud» muestra un aviso.

Es una página estática: no necesita servidor ni instalar nada. Funciona en Vercel y abriendo `index.html`
con doble clic (el mapa y WhatsApp necesitan internet).

Las fotos de los buses son **ilustraciones de ejemplo** con el nombre «Buses Demo». Los logos de clientes son
etiquetas genéricas (Minera, Club deportivo, Colegio, Empresa). Para cada cliente se reemplazan por sus fotos y logos.

## Archivos

```
index.html                 Portada
turismo-nacional.html      Destinos en Chile por zona
turismo-internacional.html Argentina y programas
programa-*.html            Una página por programa
giras-de-estudio.html, servicios.html, flota.html, empresa.html, clientes.html, contacto.html, 404.html
assets/css/main.css        Diseño
assets/css/demo.css        Solo para la demo (etiqueta y clientes de ejemplo)
assets/js/main.js          Tablero, menú, formulario y envío por WhatsApp
assets/js/demo.js          Solo para la demo (aviso al enviar y etiqueta «Demo · Altiro Rutas»)
assets/img/                Fotos de destinos e ilustraciones de buses
```

## Adaptarla a un cliente

1. Copia el repositorio (o descarga el ZIP y súbelo a un repositorio nuevo).
2. Con «Buscar y reemplazar en todos los archivos» (VS Code: `Ctrl+Shift+H`), cambia:

   | Buscar | Reemplazar por |
   | --- | --- |
   | `Buses Demo` / `Buses%20Demo` | Nombre del cliente (la segunda forma va en los enlaces de WhatsApp: espacios como `%20`) |
   | `+56 9 0000 0000` | Teléfono como se muestra |
   | `tel:+56900000000` | Teléfono para llamar |
   | `56959361307` | WhatsApp del cliente, sin `+` ni espacios (`569XXXXXXXX`). Está en los enlaces `https://wa.me/…` y en `"wa":"…"`, el número al que llega la cotización |
   | `ventas@busesdemo.cl` | Correo del cliente |
   | `Calle Demo 123, Tu ciudad` | Dirección |
   | `tu ciudad` / `Tu ciudad` | Ciudad desde donde salen |
   | `Lunes a sábado, 9:00 a 19:00` | Horario de atención |
   | `BD·0` y `BD<br>Correo` | Iniciales del cliente (patentes de la flota y estampillas de las postales) |

3. Revisa a mano los textos de **Empresa**, **Flota** (capacidad y equipamiento), los **programas**
   (duración, salida y valor) y los **clientes**.
4. Cambia las imágenes de `assets/img/` (los buses: `bus-dos-pisos-1.jpg`, `bus-dos-pisos-2.jpg`,
   `bus-ejecutivo.jpg`, `minibus.jpg`; se ven mejor en horizontal, 1600 × 1000).
5. El mapa del pie de página está centrado en Chile: cambia `q=Chile` por la dirección del cliente en el `iframe`
   y en el enlace «Abrir en Maps».
6. Para la versión final del cliente, borra las líneas de `assets/css/demo.css` y `assets/js/demo.js` en cada página,
   y quita `noindex` de `vercel.json` y de las páginas para que Google la encuentre.

## Publicar en Vercel

*Add New… → Project* → importa el repositorio → Framework: **Other**, sin comando de build → **Deploy**.
`vercel.json` ya pide a Google que no indexe la demo.

Para ocultar la etiqueta «Demo · Altiro Rutas», pon `MOSTRAR_ETIQUETA = false` en `assets/js/demo.js`.
