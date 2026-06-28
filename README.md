# D'Elycattessen — Prototipo de Alta Fidelidad (Web)

Prototipo funcional de navegación (sin backend, sin persistencia real) construido para
la sección **1.1.5 — Prototipo de alta fidelidad** del Capstone. Implementa la
**Alternativa 2** de arquitectura definida en el documento (MVC: Django + **React.js** +
Flutter + PostgreSQL), cubriendo únicamente los módulos web.

## Alcance de este prototipo (frontend)

Incluye los módulos cuya interfaz está definida como **web/React.js** en el documento:

| Caso de uso del documento | Pantallas del prototipo |
|---|---|
| Procesar Venta en Punto de Servicio (RF-02, RF-04, RF-06) | `Identificación` → `Venta` → `Confirmación` |
| Administrar Catálogo e Inventario (RF-05) | `Catálogo e Inventario` (CRUD + Mermas) |
| Administrar Catálogo e Inventario (RF-05) | `Menú y Promociones` |
| Generar Analítica de Ventas (RF-07) | `Dashboard` |
| Trazabilidad de consumo docente (RF-06/RF-07) | `Consumo Docentes` |

**Fuera de alcance de este prototipo** (porque pertenecen al módulo móvil/Flutter según
la arquitectura seleccionada): Gestionar Billetera Digital y Configurar Controles
Parentales y Alérgenos desde la app del padre de familia. El prototipo web solo *consume*
esos datos (ya configurados) durante la venta — no permite configurarlos.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre la URL que indica la terminal (por defecto `http://localhost:5173`). En el login,
elige el perfil **Administrador** o **Personal Operativo** para entrar a cada módulo.

## Stack

- React 19 + Vite
- React Router (navegación entre pantallas)
- Tailwind CSS v4 (tema con la paleta de marca en `src/index.css`)
- Recharts (gráficos del dashboard)
- lucide-react (iconografía)

Todos los datos (`src/data/mockData.js`) son simulados. Las acciones de "Guardar",
"Publicar", "Exportar", etc. modifican únicamente el estado en memoria del navegador
(`useState`/Context) para demostrar el flujo: no hay API ni base de datos real.

## Estructura

```
src/
├── data/mockData.js          → productos, menús, promociones, ventas, usuarios POS
├── context/PosContext.jsx    → estado compartido de la sesión de venta (carrito, validaciones)
├── components/
│   ├── ui/                   → Button, Badge, Card, Modal, StatCard, Field
│   ├── admin/                → Sidebar, Topbar del backoffice
│   └── pos/                  → Topbar con indicador de pasos del POS
├── layouts/
│   ├── AdminLayout.jsx
│   └── PosLayout.jsx
└── pages/
    ├── Login.jsx
    ├── admin/
    │   ├── Dashboard.jsx        (RF-07)
    │   ├── Productos.jsx        (RF-05 — catálogo + mermas)
    │   ├── Menu.jsx             (RF-05 — menú semanal + promociones)
    │   └── ReporteDocentes.jsx  (RF-06/07)
    └── pos/
        ├── Identificacion.jsx   (RF-06)
        ├── Venta.jsx            (RF-02, RF-04)
        └── Confirmacion.jsx     (cobro / entrega de preorden)
```

## Reglas de negocio simuladas en el flujo de venta

- **Bloqueo por alérgenos (RF-02):** si un producto del carrito comparte un alérgeno
  con el perfil identificado, se marca visualmente y se bloquea el botón de cobro.
- **Control parental (RF-04):** si el total proyectado supera el límite diario
  configurado, se bloquea el cobro con una alerta.
- **Modalidad docente (RF-06):** los docentes no usan saldo/efectivo; el consumo se
  registra automáticamente como crédito a consolidar en `Consumo Docentes`.
- **Preorden (RF-01/RF-06):** si el usuario identificado tiene un pedido prepagado
  pendiente, el flujo ofrece una pantalla de entrega en vez de cobro.
