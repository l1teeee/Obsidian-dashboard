# Prompt maestro por fases para mejorar Vielinks

Actua como un equipo senior de producto, UX/UI, marca, frontend, accesibilidad y performance.
Debes mejorar el proyecto Vielinks por fases, priorizando claridad, confianza, conversion, calidad visual, accesibilidad y mantenibilidad tecnica.

Antes de implementar cualquier fase:

- Lee el proyecto completo en modo cuidadoso.
- Identifica stack, rutas, paginas principales, componentes compartidos, estilos globales, assets y sistema de UI.
- No hagas refactors grandes si una mejora puntual resuelve el problema.
- Mantente alineado con el estilo existente, pero corrige inconsistencias claras.
- No elimines funcionalidad existente sin justificarlo.
- Despues de cada fase, valida con `npm run lint` y, si aplica, `npm run build`.

## Contexto del proyecto

El proyecto es una app React + Vite + TypeScript + Tailwind v4.
Incluye landing publica, pricing, FAQ, auth, checkout, dashboard, calendario, analytics, posts, composer, settings, brand, AI settings y admin.

Diagnostico actual:

- La base visual es moderna, pero depende demasiado de purpura, glow, blur, cards grandes y radios muy redondeados.
- La propuesta de valor no esta suficientemente enfocada.
- Algunos CTAs prometen acciones que no ocurren, especialmente `Book a Demo`, que lleva a login.
- Hay prueba social poco verificable: numeros grandes, logos genericos y avatares de `randomuser.me`.
- El onboarding tiene demasiados pasos antes del primer valor.
- Existen problemas de accesibilidad en modales, botones iconicos, controles con `tabIndex={-1}` y tablas.
- `Suspense` usa `fallback={null}`, lo que puede provocar pantalla en blanco.
- El lint falla con errores que deben limpiarse gradualmente.

## Objetivo general

Hacer que Vielinks parezca una marca SaaS mas profesional, confiable y enfocada, sin perder su personalidad visual.

La direccion recomendada de marca:

Headline:
`Planifica, publica y mide desde un solo workspace.`

Subheadline:
`Gestiona Instagram, LinkedIn y Facebook en un solo lugar, con calendario, reportes y asistencia de IA para publicar con mas control y menos friccion.`

Propuesta de valor:
`Vielinks ayuda a equipos de marketing a planificar, publicar y medir Instagram, LinkedIn y Facebook desde un solo workspace.`

Tono de voz:

- Claro.
- Operativo.
- Confiable.
- Especifico.
- Menos hype.
- Mas prueba concreta.

Evitar:

- Claims genericos como `every platform` si solo se soportan algunas plataformas.
- Frases demasiado aspiracionales como `serious results`, `growing faster`, `exact right time` sin evidencia.
- Prueba social inventada o no verificable.
- CTAs que prometen demo y llevan a login.

---

# Fase 1: cambios rapidos de alto impacto

Objetivo:
Corregir los problemas que mas afectan confianza, conversion y accesibilidad basica sin redisenar todo.

## Cambios a implementar

1. Corregir CTAs inconsistentes
   - Buscar todos los botones con texto `Book a Demo`.
   - Si no existe una ruta real para demo/contact sales, cambiar el texto por una accion honesta:
     - `View product`
     - `See pricing`
     - `Contact sales`
     - `Sign in`, solo si realmente lleva a login.
   - No dejes `Book a Demo` apuntando a `/login`.

2. Corregir claims de cobertura
   - Reemplazar mensajes tipo `every platform` por mensajes especificos:
     - `Instagram, LinkedIn and Facebook`
     - `The platforms your team uses today`
     - `More integrations coming soon`
   - Asegurar que hero, SEO, FAQ y product pages no prometan mas cobertura de la que existe.

3. Limpiar prueba social no verificable
   - Revisar claims como `12,000+ teams`, `4.8/5`, `2,400+ reviews`, `98% satisfaction`, `99.9% uptime`.
   - Si no hay fuente real, reemplazarlos por trust signals verificables:
     - `Official OAuth connections`
     - `No credit card required`
     - `14-day trial`
     - `7-day refund policy`
     - `TLS 1.3`
     - `Encrypted data`
   - Sustituir o retirar avatares de `randomuser.me` y marcas genericas si no son clientes reales.

4. Arreglar footer
   - Reemplazar enlaces `href="#"` por rutas reales.
   - Si una pagina no existe, quitar temporalmente el link o apuntarlo a una seccion existente.
   - Asegurar que legal, producto y redes no parezcan placeholders.

5. Agregar fallback visual para rutas lazy
   - Reemplazar `Suspense fallback={null}` por un loader/skeleton global.
   - Debe ser sobrio, rapido y alineado con la marca.
   - Evitar pantalla blanca en cambios de ruta.

6. Mejorar accesibilidad rapida
   - Quitar `tabIndex={-1}` de toggles de visibilidad de password.
   - Agregar `aria-label` a botones icon-only.
   - Agregar `aria-expanded` y `aria-controls` donde haya menus o sidebars.
   - Revisar botones de close en modales.

7. Actualizar README
   - Reemplazar el README de template Vite por un README real del proyecto.
   - Incluir comandos: `npm run dev`, `npm run lint`, `npm run build`, `npm run preview`.

## Criterios de aceptacion

- No quedan CTAs de demo que lleven a login.
- No hay claims evidentes de sobrerpromesa.
- Footer no tiene links muertos visibles.
- Existe loader/skeleton en rutas lazy.
- Controles basicos de auth son navegables con teclado.
- README ya no parece template.

---

# Fase 2: mejoras visuales y UX

Objetivo:
Elevar el nivel visual y hacer que el sistema se sienta mas consistente, maduro y escaneable.

## Cambios a implementar

1. Crear un sistema visual mas consistente
   - Definir tokens claros para:
     - Colores primarios.
     - Colores secundarios.
     - Superficies.
     - Bordes.
     - Texto principal.
     - Texto secundario.
     - Estados: success, warning, error, info.
   - Reservar el purpura para:
     - CTA principal.
     - Estado activo.
     - Enfasis puntual.
   - Reducir glow/decoracion cuando compita con contenido.

2. Normalizar radios y superficies
   - Definir 2 o 3 radios principales:
     - pequeno para inputs/botones compactos.
     - medio para cards.
     - grande solo para modales o contenedores principales.
   - Evitar que todo sea `rounded-3xl` o `rounded-[2rem]`.

3. Mejorar tipografia
   - Mantener Manrope si encaja con la marca.
   - Reducir uso de `text-[10px]`, `0.65rem`, `0.6875rem`.
   - Usar 12px minimo para labels funcionales.
   - Usar 14-16px para body y controles principales.
   - Mantener microcopy muy pequeno solo en badges/decoracion no critica.

4. Simplificar hero
   - Reducir capas de blur, shapes, grid, glow y motion.
   - Elevar claridad del headline/subheadline.
   - Hacer que el producto o mockup sea mas legible.
   - Evitar que el cursor custom interfiera con usabilidad.
   - Mostrar una pista de la siguiente seccion sin que el hero sea excesivamente alto.

5. Mejorar dashboard
   - Diferenciar visualmente:
     - resumen/KPIs.
     - listas.
     - tablas.
     - acciones principales.
   - Evitar que todo use la misma `glass-card`.
   - Hacer que `New Post` sea la accion primaria evidente.
   - Si el buscador no funciona, quitarlo o conectarlo a una busqueda real.

6. Mejorar Settings y layouts densos
   - Aprovechar mejor el ancho desktop.
   - Evitar rail lateral demasiado dominante.
   - Convertir secciones clave a layouts de dos columnas si mejora escaneo.

7. Revisar responsive
   - Pricing cards.
   - Comparison table.
   - Dashboard.
   - Analytics tables.
   - Hero mockups.
   - Formularios de auth y checkout.

## Criterios de aceptacion

- El sistema visual se siente consistente.
- El purpura ya no compite con todo.
- Labels y textos pequenos son legibles.
- Hero comunica antes de decorar.
- Dashboard tiene jerarquia clara.
- No hay overflow escondido que tape bugs responsive.

---

# Fase 3: mejoras de marca y conversion

Objetivo:
Hacer que la landing y pricing vendan mejor, con mensajes mas especificos, confiables y memorables.

## Cambios a implementar

1. Reescribir hero
   - Usar headline recomendado o una variante mejor:
     - `Planifica, publica y mide desde un solo workspace.`
   - Subheadline:
     - `Gestiona Instagram, LinkedIn y Facebook en un solo lugar, con calendario, reportes y asistencia de IA para publicar con mas control y menos friccion.`
   - CTA principal:
     - `Start free`
     - `Create your workspace`
     - `Try Vielinks free`
   - CTA secundario:
     - `See pricing`
     - `View product`
     - `Contact sales`, solo si hay flujo real.

2. Crear trust stack arriba del fold
   - Usar senales reales:
     - `No credit card required`
     - `Official OAuth`
     - `14-day trial`
     - `7-day refund`
     - `Encrypted connections`
   - No usar numeros grandes si no tienen fuente.

3. Reescribir beneficios
   - Enfocarlos en outcomes concretos:
     - Menos tabs.
     - Calendario unificado.
     - Reportes por plataforma.
     - Publicacion programada.
     - IA como asistencia, no como magia.

4. Rehacer diferenciacion
   - Evitar frases de categoria como:
     - `simpler, not stripped down`
     - `serious results`
     - `not just another tool`
   - Definir un mecanismo propio:
     - workspace unico.
     - calendario + composer + reportes conectados.
     - contexto de marca usado por IA.
     - flujo de aprobacion/operacion para equipos.

5. Alinear pricing con ICP
   - Decidir audiencia primaria:
     - creadores independientes.
     - equipos de marketing.
     - agencias.
   - Si la landing habla a equipos, pricing debe reforzar equipos.
   - Si hay plan Free/Starter para individuos, presentarlo como entrada, no como centro narrativo.

6. Mejorar testimonios/casos
   - Si existen clientes reales, usar sus logos/casos.
   - Si no existen, reemplazar por:
     - capturas de producto.
     - casos anonimizados honestos.
     - beneficios operativos sin nombres falsos.

## Criterios de aceptacion

- La home explica en 5 segundos que hace Vielinks, para quien y por que importa.
- Los CTAs son honestos.
- La prueba social se siente real o se retira.
- Pricing no mezcla audiencias de forma confusa.
- La marca suena mas profesional, menos generica.

---

# Fase 4: refactor tecnico y accesibilidad profunda

Objetivo:
Resolver deuda tecnica que afecta UX, accesibilidad, performance y mantenimiento.

## Cambios a implementar

1. Arreglar lint
   - Ejecutar `npm run lint`.
   - Corregir errores sin desactivar reglas globalmente.
   - Priorizar:
     - `react-hooks/set-state-in-effect`
     - `react-hooks/refs`
     - `react-refresh/only-export-components`
     - `no-empty`
     - `no-explicit-any`
     - `@ts-nocheck`

2. Mejorar modales
   - Migrar modales custom a Radix Dialog cuando sea posible.
   - Asegurar:
     - focus trap.
     - restore focus.
     - Escape para cerrar.
     - click fuera si aplica.
     - `aria-labelledby`.
     - `aria-describedby`.

3. Mejorar navegacion por teclado
   - Revisar auth, sidebar, topbar, composer, tables, dropdowns.
   - Todos los controles interactivos deben ser botones/links reales.
   - Evitar `span role="button"` salvo casos justificados.
   - Agregar `aria-pressed`, `aria-selected`, `aria-expanded` segun corresponda.

4. Mejorar tablas y mobile
   - Tablas clickables deben usar `Link` o `button`.
   - Agregar estados focus visibles.
   - En mobile usar:
     - scroll horizontal controlado.
     - vista tipo card.
     - columnas reducidas.

5. Optimizar runtime
   - Revisar `Lenis` global.
   - Revisar cursor custom con `requestAnimationFrame`.
   - Respetar `prefers-reduced-motion` tambien en JS.
   - Evitar `auth/ping` redundante en cada cambio de ruta si hay alternativa.
   - Centralizar perfil/rol para evitar llamadas duplicadas en admin/sidebar.

6. Revisar assets y SEO
   - Crear `og-image.png` real si se referencia.
   - Revisar sitemap `lastmod`.
   - Revisar favicon/brand assets.
   - Asegurar que metadata coincide con claims reales.

## Criterios de aceptacion

- `npm run lint` pasa o queda con deuda documentada y minima.
- Modales son accesibles.
- Auth y dashboard funcionan con teclado.
- No hay pantalla blanca en cargas lazy.
- Runtime de landing es mas liviano.
- SEO no referencia assets inexistentes.

---

# Orden recomendado de trabajo

1. Fase 1 primero, porque impacta confianza y conversion rapidamente.
2. Fase 2 despues, porque consolida el salto visual.
3. Fase 3 cuando la base UX ya no tenga contradicciones.
4. Fase 4 en paralelo o al final, segun riesgo tecnico.

No implementar todas las fases de golpe.
Al terminar cada fase, entregar:

- Resumen de cambios.
- Archivos modificados.
- Riesgos o decisiones tomadas.
- Resultado de `npm run lint`.
- Resultado de `npm run build`, si aplica.

