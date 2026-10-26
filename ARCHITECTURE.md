# Arquitectura del frontend web — D'Elycattessen

Panel administrativo web de D'Elycattessen. Consume la API REST del backend Django (`delycattessen-backend`) y permite al administrador gestionar usuarios, catálogo, menú mensual, descuentos y promociones (combos) y ver reportes.

## 1. Stack

| Tema | Tecnología |
| --- | --- |
| UI | React 19 + JSX |
| Build / dev server | Vite |
| Estilos | Tailwind CSS 4 (colores propios: `ink`, `teal`, `brand`, `danger`, …) |
| Rutas | react-router-dom 7 |
| Iconos / gráficos | lucide-react / recharts |
| Calidad | ESLint (reglas de React Hooks y React Refresh) |
| API | REST + JWT (SimpleJWT) |

## 2. Cómo correrlo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run lint     # debe terminar con 0 problemas
npm run build    # compila a dist/ (también detecta imports rotos)
```

Variable de entorno (archivo `.env`, **no se sube al repo**):

```
VITE_API_URL=<URL base de la API, p. ej. http://127.0.0.1:8000/api>
```

## 3. Idea central: organización por feature

El código no se agrupa por tipo ("todos los componentes juntos, todos los servicios juntos"), sino **por tema del negocio**. Todo lo de "Usuarios" está en `features/users/`, todo lo de "Catálogo" en `features/catalog/`, etc. Así, para tocar una pantalla se trabaja casi siempre dentro de una sola carpeta.

```
src/
├─ main.jsx · App.jsx · index.css     Entrada, providers + rutas, estilos globales
│
├─ features/                           ★ Código de negocio, una carpeta por tema
│  ├─ auth/          Login, recuperar contraseña, ruta protegida
│  ├─ users/         Gestión de docentes y personal operativo
│  ├─ catalog/       Productos, ingredientes y alérgenos
│  ├─ menu/          Menú mensual, platillos, descuentos y promociones (combos)
│  ├─ dashboard/     Analítica de ventas
│  ├─ reports/       Consumo a crédito de docentes del mes y su exportación CSV para RR. HH.
│  └─ institutions/  Servicio de sedes (sin pantalla propia)
│
├─ components/ui/   Piezas visuales genéricas (Button, Modal, Card, Field, Badge…)
├─ layouts/         Marco de la app: AdminLayout, Sidebar, Topbar
├─ context/         Estado global (sesión, sede, avisos)
├─ hooks/           Hooks genéricos sin tema de negocio (useAsyncData)
├─ lib/             Lógica pura sin React (tokenStore, permissions, eventBus, helpers)
├─ services/        apiClient.js: el único cliente HTTP de toda la app
└─ data/            mockData.js: datos de prueba temporales
```

### Qué hay dentro de una feature

```
features/<tema>/
├─ <Tema>Page.jsx     La pantalla (ruta). Solo une hooks y componentes.
├─ services.js        Llamadas a la API de ese tema (único lugar con HTTP).
├─ hooks/useX.js      Carga de datos y acciones (guardar, eliminar) con sus avisos.
├─ components/        Tablas, modales y formularios de esa pantalla.
└─ xUtils.js / xRules.js   Funciones puras del tema (adaptadores, reglas), si hacen falta.
```

Ejemplo real, `features/users/`:

| Archivo | Responsabilidad |
| --- | --- |
| `UsersPage.jsx` | Pestañas, búsqueda y qué modal está abierto |
| `hooks/useStaff.js` | Carga el personal de la sede y expone crear / editar / activar / eliminar |
| `services.js` | `getStaff`, `createStaff`, `updateStaff`, `deleteStaff` |
| `components/StaffTable.jsx` | Tabla de usuarios |
| `components/CreateStaffModal.jsx`, `EditStaffModal.jsx` | Formularios |
| `staffForm.js`, `staffRules.js` | Nombre completo y reglas de qué cuentas se pueden editar, eliminar o cambiar de correo (espejo de `CanManageStaffAccount`; mantener sincronizado con el backend) |

`features/dashboard/` (analítica de ventas, datos reales de `/api/pos/analytics/`):

| Archivo | Responsabilidad |
| --- | --- |
| `DashboardPage.jsx` | Orquesta selector de periodo, KPIs, gráficos y detalle |
| `hooks/useSalesDashboard.js` | Periodo, granularidad y barra seleccionada; carga resumen, serie y top de productos y los refresca cada 30 s |
| `services.js` | `getSalesSummary`, `getSalesTimeseries`, `getTopProducts` |
| `components/` | `PeriodSelector`, `KpiGrid`, `SalesTrendChart`, `ChannelBreakdown`, `TopProductsList`, `BucketDetailPanel`, `LastUpdated`, `ChangeBadge` |
| `dashboardUtils.js`, `chartPalette.js` | Rangos de fechas, formatos y colores de canal (variables del tema) |

Reglas del dashboard: el refresco automático usa `useAsyncData({ refreshInterval })` (sin parpadeo; se pausa con la pestaña oculta). El detalle al hacer clic en una barra pide los mismos endpoints con el rango de esa barra. Canales: efectivo, saldo, crédito docente y pre-órdenes; las reglas de las métricas están en el `ARCHITECTURE.md` del backend (§5.7).

## 4. Capas y reglas de dependencia

Cada capa tiene un solo trabajo y solo puede apoyarse en las que están debajo:

```
Página (XPage.jsx)          orquesta y guarda estado de UI (pestaña, modal abierto, búsqueda)
      │
      ├─ Componentes        muestran datos y capturan entradas; no llaman a la API
      │
      └─ Hooks (useX)       cargan datos, ejecutan acciones, muestran avisos (toasts)
              │
          services.js       arma las peticiones de la feature
              │
          apiClient.js      cliente HTTP único: token, errores, renovación de sesión
```

Reglas:
- Un componente **nunca** llama a `fetch`; todo pasa por `services.js` → `apiClient`.
- `services.js` y `lib/` no importan React ni contextos.
- `components/ui` y `lib` no conocen ninguna feature.
- Una feature no importa la página de otra. Si necesita algo de otra (el menú usa el catálogo de ingredientes), importa su hook o componente, sin ciclos.
- Lo que usan dos o más features se sube a `lib/`, `hooks/` o `components/ui/`.

## 5. Flujo de datos (ejemplo: cargar productos)

1. `ProductsPage` llama a `useProducts()`.
2. `useProducts` usa `useAsyncData` con la sede seleccionada; si la sede cambia, recarga sola.
3. El hook llama a `getAdminProducts(sede)` de `catalog/services.js`.
4. `apiClient` agrega el token y hace la petición.
5. La respuesta vuelve al hook, que la guarda; la página pasa los datos a `ProductsTable`.
6. Al guardar o eliminar, el hook ejecuta la acción, muestra un aviso y recarga.

## 6. Rutas

| Ruta | Pantalla | Acceso |
| --- | --- | --- |
| `/` | Login (si ya hay sesión de admin, redirige al panel) | Pública |
| `/admin/dashboard` | Analítica de ventas | Admin |
| `/admin/users` | Gestión de usuarios | Admin |
| `/admin/products` | Catálogo e inventario | Admin |
| `/admin/menu` | Menú mensual, platillos, descuentos y promociones (combos) | Admin |
| `/admin/teachers` | Consumo de docentes | Admin |

Las rutas `/admin/*` están protegidas por `ProtectedRoute` con la regla `IsAdmin` (`lib/permissions.js`).

## 7. Estado global (`context/`)

| Contexto | Contiene |
| --- | --- |
| `AuthContext` | Sesión: usuario, rol, login, logout, aviso de sesión expirada |
| `InstitutionContext` | Lista de sedes y la sede seleccionada (`ALL_INSTITUTIONS` = vista consolidada) |
| `ToastContext` | Avisos de éxito / error / advertencia |

Cada contexto es un solo archivo con su Provider y su hook (`useAuth()`, `useInstitution()`, `useToast()`). Orden de anidado en `App.jsx`: Toast → Auth → Institution → Router. Los descuentos y los combos no son estado global: los cargan los hooks `features/menu/hooks/usePromotions.js` (descuentos; en la API se llaman `Promotion`) y `useCombos.js`, y el catálogo muestra el descuento vigente que ya viene en cada producto (`discount_percentage`, `final_price`).

## 8. Sesión y autenticación

- Login con correo y contraseña; el backend devuelve un token de acceso (1 h) y uno de renovación (15 días).
- La sesión se guarda en el navegador (`lib/tokenStore.js`), por lo que **el usuario sigue logueado aunque cierre la pestaña o la app**.
- Los componentes nunca manejan el token: `apiClient` lo agrega a cada petición.
- Si el token de acceso vence (401), `apiClient` lo renueva solo y **reenvía la petición una vez**. El 401 ocurre antes de que el backend ejecute la acción, así que reenviar no duplica pagos ni cambios. Si hay varias peticiones simultáneas, comparten una sola renovación. Los errores de red o 5xx **no** se reenvían.
- Si la renovación es rechazada, la app saca al usuario del panel y le pide iniciar sesión, **sin borrar** los datos guardados.
- Token y perfil guardados se borran **solo** cuando el usuario pulsa "Cerrar sesión".

## 9. Patrones de diseño usados

| Patrón | Dónde | Para qué |
| --- | --- | --- |
| Template Method | `services/apiClient.js` (`request` + `onError`) | Flujo fijo de petición; el manejo de errores/sesión se especializa en una subclase |
| Mixin | `lib/eventBus.js` (`EmitterMixin`) | Añadir publicación/suscripción de eventos sin herencia forzada |
| Permission Class | `lib/permissions.js` (`BasePermission`, `IsAdmin`) | Reglas de acceso a rutas; una regla nueva es una clase nueva |

## 10. Convenciones

- Código y comentarios técnicos en **inglés**; textos visibles al usuario en **español**.
- Componentes y páginas en `PascalCase.jsx` (las páginas terminan en `Page`); hooks `useCamelCase.js`; el resto `camelCase.js`.
- Carga de datos con `useAsyncData` (el `fetcher` debe tener identidad estable).
- Modales y formularios se renderizan solo mientras están abiertos, para arrancar limpios.
- Sin secretos ni URLs en el código; todo en `.env` con prefijo `VITE_`.
- Git: ramas `main` y `develop`; Conventional Commits (`feat:`, `fix:`, `refactor:`…).

## 11. Cómo agregar una pantalla nueva (ejemplo: "Pedidos")

1. Crear `src/features/orders/`.
2. `services.js` con las llamadas a la API (usando `apiClient`).
3. `hooks/useOrders.js` con `useAsyncData` y las acciones.
4. `components/` con tablas y modales.
5. `OrdersPage.jsx` que une hook y componentes, con `<Topbar />` como cabecera.
6. Registrar la ruta en `App.jsx` y el enlace en `layouts/Sidebar.jsx`.
7. Si es restringida, usar o crear una regla en `lib/permissions.js`.
8. Verificar con `npm run lint` y `npm run build`.

## 12. Estado actual y pendientes

- **Mocks temporales** (`src/data/mockData.js`): ninguna pantalla los usa ya (Dashboard y Consumo de docentes están conectados a la API). Si una pantalla nueva necesita uno mientras no exista su endpoint, márcalo con `// TODO` y bórralo al conectarlo.
- `features/users/staffRules.js` espeja las reglas del backend sobre qué cuentas de personal se pueden editar y aún no está conectado a la pantalla.
