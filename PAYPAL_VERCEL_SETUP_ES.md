# Super Serpientes — configuración de PayPal en Vercel

Esta versión prepara un flujo de Checkout con creación y captura de órdenes en funciones de servidor. El servidor fija el precio en USD 3.00, solo permite las claves legendarias incluidas y firma el comprobante local de desbloqueo. Se quitó el código de prueba `FPGC0808`.

## Antes de publicar

1. En Vercel abre tu proyecto → **Settings → Environment Variables**.
2. Añade estas variables para **Production**:
   - `PAYPAL_CLIENT_ID` = Client ID de tu app **Live**.
   - `PAYPAL_CLIENT_SECRET` = Secret de esa misma app Live (no lo pongas en el HTML ni lo compartas por chat).
   - `ENTITLEMENT_SECRET` = una cadena aleatoria larga, al menos 32 caracteres. Genera una nueva solo para este juego y guárdala en un gestor de contraseñas.
   - `PAYPAL_ENV` = `live` (puedes omitirla, porque live es el valor predeterminado).
3. Guarda y haz **Redeploy** para que las variables estén disponibles.
4. Sube el contenido de este ZIP a la raíz del repositorio conectado a Vercel. La carpeta `index.html` debe quedar en la raíz y `api/` y `lib/` también en la raíz; no subas una carpeta extra envolviendo todo.
5. Prueba con una compra real de bajo riesgo y confirma en PayPal que el importe capturado sea USD 3.00 antes de anunciar que la tienda está activa.

## Importante

- El Client ID es público y está en `index.html`; el Client Secret solo existe en Vercel.
- No compartas el Client Secret ni lo subas a GitHub.
- El token de desbloqueo firmado se guarda en el navegador. Como no hay base de datos ni cuenta de jugador, las compras no se sincronizan automáticamente entre dispositivos/navegadores. Para recuperar compras o sincronizarlas, se necesita persistencia en servidor y un identificador de jugador.
- Este paquete no se ha desplegado en tu cuenta de Vercel ni se ha probado con un cobro real; configura las variables y verifica el flujo antes de producción.
- La lista de productos autorizados en las funciones actualmente es `dragon`, `fenix`, `unicornio`, `hidra`, `kraken`, `yeti`, `sirena`, `fantasma`, `golem` y `vampiro`. Si agregas nuevos animales legendarios a `index.html`, añádelos explícitamente a las listas permitidas de las tres funciones antes de publicar.
