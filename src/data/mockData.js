// Datos simulados (mock) para el prototipo de alta fidelidad.
// No hay llamadas a API ni persistencia real: el prototipo solo navega
// entre pantallas para validar los flujos de los casos de uso.

export const instituciones = [
  { id: 'mc', nombre: 'Martim Cereré' },
  { id: 'es', nombre: 'El Sauce School' },
]

export const categorias = ['Bar', 'Almuerzo', 'Snacks', 'Bebidas', 'Postres']

// Catálogo maestro de ingredientes: nombre único y estandarizado que se
// sincroniza por API con el sistema de validación de alérgenos. Los
// productos solo deben referenciar ingredientes de esta lista.
export const catalogoIngredientes = [
  'Aderezo César',
  'Agua',
  'Arroz',
  'Avena',
  'Azúcar',
  'Carne asada',
  'Chocolate',
  'Crutones',
  'Ensalada',
  'Fruta picada',
  'Harina',
  'Huevo',
  'Lechuga',
  'Mantequilla',
  'Mayonesa',
  'Menestra',
  'Miel',
  'Mora',
  'Nueces',
  'Pan integral',
  'Pasas',
  'Patacón',
  'Pollo',
  'Pollo a la plancha',
  'Queso parmesano',
  'Tomate',
  'Yogurt natural',
]

export const productos = [
  {
    id: 'p1',
    nombre: 'Sandwich de Pollo',
    descripcion: 'Sandwich en pan integral con pollo a la plancha, lechuga y tomate.',
    categoria: 'Bar',
    precio: 2.5,
    stock: 18,
    ingredientes: ['Pan integral', 'Pollo a la plancha', 'Lechuga', 'Tomate', 'Mayonesa'],
    alergenos: ['Gluten', 'Huevo'],
    imagen: '🥪',
    estado: 'Activo',
  },
  {
    id: 'p2',
    nombre: 'Ensalada César',
    descripcion: 'Ensalada fresca con pollo, queso parmesano, crutones y aderezo César.',
    categoria: 'Almuerzo',
    precio: 3.2,
    stock: 12,
    ingredientes: ['Lechuga', 'Pollo', 'Queso parmesano', 'Crutones', 'Aderezo César'],
    alergenos: ['Gluten', 'Lácteos'],
    imagen: '🥗',
    estado: 'Activo',
  },
  {
    id: 'p3',
    nombre: 'Jugo Natural de Mora',
    descripcion: 'Jugo natural de mora preparado en el momento, sin conservantes.',
    categoria: 'Bebidas',
    precio: 1.0,
    stock: 30,
    ingredientes: ['Mora', 'Agua', 'Azúcar'],
    alergenos: [],
    imagen: '🥤',
    estado: 'Activo',
  },
  {
    id: 'p4',
    nombre: 'Brownie de Chocolate',
    descripcion: 'Brownie artesanal de chocolate con nueces.',
    categoria: 'Postres',
    precio: 1.5,
    stock: 0,
    ingredientes: ['Harina', 'Chocolate', 'Huevo', 'Mantequilla', 'Nueces'],
    alergenos: ['Gluten', 'Huevo', 'Frutos secos', 'Lácteos'],
    imagen: '🍫',
    estado: 'Agotado',
  },
  {
    id: 'p5',
    nombre: 'Granola con Yogurt',
    descripcion: 'Yogurt natural con granola casera, miel y fruta picada.',
    categoria: 'Snacks',
    precio: 1.8,
    stock: 22,
    ingredientes: ['Avena', 'Yogurt natural', 'Miel', 'Fruta picada'],
    alergenos: ['Lácteos'],
    imagen: '🥣',
    estado: 'Activo',
  },
  {
    id: 'p6',
    nombre: 'Almuerzo Ejecutivo',
    descripcion: 'Menú completo con arroz, carne asada, menestra, ensalada y patacón.',
    categoria: 'Almuerzo',
    precio: 3.5,
    stock: 9,
    ingredientes: ['Arroz', 'Carne asada', 'Menestra', 'Ensalada', 'Patacón'],
    alergenos: [],
    imagen: '🍽️',
    estado: 'Activo',
  },
  {
    id: 'p7',
    nombre: 'Agua Embotellada',
    descripcion: 'Agua embotellada 500ml.',
    categoria: 'Bebidas',
    precio: 0.6,
    stock: 45,
    ingredientes: ['Agua'],
    alergenos: [],
    imagen: '💧',
    estado: 'Activo',
  },
  {
    id: 'p8',
    nombre: 'Galletas de Avena',
    descripcion: 'Galletas caseras de avena con pasas.',
    categoria: 'Snacks',
    precio: 0.9,
    stock: 4,
    ingredientes: ['Avena', 'Harina', 'Mantequilla', 'Pasas'],
    alergenos: ['Gluten', 'Lácteos'],
    imagen: '🍪',
    estado: 'Activo',
  },
]

// Planificacion de menus mensuales: cada dia habil (lunes a viernes) del mes
// tiene su propio menu independiente. Se identifica por fecha (YYYY-MM-DD).
export const menuMensual = [
  {
    id: 'mm1',
    mes: 'Junio 2026',
    anio: 2026,
    mesIndex: 5,
    estado: 'Publicado',
    fechaPublicacion: '2026-05-28',
    dias: {
      '2026-06-01': ['p6', 'p3'],
      '2026-06-02': ['p2', 'p7'],
      '2026-06-03': ['p6', 'p3'],
      '2026-06-04': ['p1', 'p7'],
      '2026-06-05': ['p2', 'p3'],
      '2026-06-08': ['p6', 'p3'],
      '2026-06-09': ['p2', 'p7'],
    },
  },
  {
    id: 'mm2',
    mes: 'Julio 2026',
    anio: 2026,
    mesIndex: 6,
    estado: 'Borrador',
    fechaPublicacion: null,
    dias: {
      '2026-07-01': ['p1', 'p3'],
    },
  },
]

// Promociones (RF-08): una promoción puede cubrir uno o varios productos
// (incluso todo el catálogo), pero un mismo producto no puede estar en más
// de una promoción activa a la vez. El estado (Activa/Vencida) se calcula
// automáticamente a partir de la fecha de vigencia, no se almacena — al
// vencer, el precio original se restaura sin intervención manual y el
// producto vuelve a quedar disponible para una nueva promoción.
export const promociones = [
  {
    id: 'pr1',
    productos: ['p1', 'p3'],
    imagen: '🥪',
    descuento: 15,
    vigenciaInicio: '2026-07-01',
    vigenciaFin: '2026-07-15',
  },
  {
    id: 'pr2',
    productos: ['p5'],
    imagen: '🥣',
    descuento: 10,
    vigenciaInicio: '2026-06-10',
    vigenciaFin: '2026-06-20',
  },
  {
    id: 'pr3',
    productos: ['p4'],
    imagen: '🍫',
    descuento: 20,
    vigenciaInicio: '2026-05-01',
    vigenciaFin: '2026-05-15',
  },
]

export const mermas = [
  { id: 'm1', producto: 'Almuerzo Ejecutivo', cantidad: 3, motivo: 'Vencimiento de porción', fecha: '2026-06-15' },
  { id: 'm2', producto: 'Brownie de Chocolate', cantidad: 5, motivo: 'Rotura en transporte', fecha: '2026-06-14' },
  { id: 'm3', producto: 'Galletas de Avena', cantidad: 2, motivo: 'Humedad', fecha: '2026-06-12' },
]

// Ventas del dashboard de analítica (RF-07), desglosadas por institución/sede.
export const ventasPorInstitucion = {
  mc: {
    kpis: { ingresosHoy: 130.0, ingresosSemana: 520.0, transaccionesHoy: 114 },
    diario: [
      { dia: 'Lun', fecha: '2026-06-29', digital: 59, efectivo: 26 },
      { dia: 'Mar', fecha: '2026-06-30', digital: 69, efectivo: 32 },
      { dia: 'Mié', fecha: '2026-07-01', digital: 61, efectivo: 32 },
      { dia: 'Jue', fecha: '2026-07-02', digital: 78, efectivo: 36 },
      { dia: 'Vie', fecha: '2026-07-03', digital: 89, efectivo: 38 },
    ],
    semanal: [
      { semana: 'Sem 1', rango: '1 – 7 jun', digital: 299, efectivo: 133 },
      { semana: 'Sem 2', rango: '8 – 14 jun', digital: 347, efectivo: 160 },
      { semana: 'Sem 3', rango: '15 – 21 jun', digital: 283, efectivo: 131 },
      { semana: 'Sem 4', rango: '22 – 28 jun', digital: 359, efectivo: 161 },
    ],
    mensual: [
      { mes: 'Ene', anio: 2026, digital: 1092, efectivo: 486 },
      { mes: 'Feb', anio: 2026, digital: 1167, efectivo: 519 },
      { mes: 'Mar', anio: 2026, digital: 1206, efectivo: 534 },
      { mes: 'Abr', anio: 2026, digital: 1128, efectivo: 507 },
      { mes: 'May', anio: 2026, digital: 1284, efectivo: 552 },
      { mes: 'Jun', anio: 2026, digital: 1288, efectivo: 585 },
    ],
    ranking: [
      { nombre: 'Sandwich de Pollo', unidades: 85 },
      { nombre: 'Jugo Natural de Mora', unidades: 77 },
      { nombre: 'Almuerzo Ejecutivo', unidades: 58 },
      { nombre: 'Granola con Yogurt', unidades: 49 },
      { nombre: 'Agua Embotellada', unidades: 46 },
    ],
  },
  es: {
    kpis: { ingresosHoy: 81.4, ingresosSemana: 346.0, transaccionesHoy: 70 },
    diario: [
      { dia: 'Lun', fecha: '2026-06-29', digital: 39, efectivo: 18 },
      { dia: 'Mar', fecha: '2026-06-30', digital: 46, efectivo: 21 },
      { dia: 'Mié', fecha: '2026-07-01', digital: 41, efectivo: 21 },
      { dia: 'Jue', fecha: '2026-07-02', digital: 52, efectivo: 24 },
      { dia: 'Vie', fecha: '2026-07-03', digital: 59, efectivo: 25 },
    ],
    semanal: [
      { semana: 'Sem 1', rango: '1 – 7 jun', digital: 199, efectivo: 89 },
      { semana: 'Sem 2', rango: '8 – 14 jun', digital: 232, efectivo: 106 },
      { semana: 'Sem 3', rango: '15 – 21 jun', digital: 188, efectivo: 88 },
      { semana: 'Sem 4', rango: '22 – 28 jun', digital: 239, efectivo: 107 },
    ],
    mensual: [
      { mes: 'Ene', anio: 2026, digital: 728, efectivo: 324 },
      { mes: 'Feb', anio: 2026, digital: 778, efectivo: 346 },
      { mes: 'Mar', anio: 2026, digital: 804, efectivo: 356 },
      { mes: 'Abr', anio: 2026, digital: 752, efectivo: 338 },
      { mes: 'May', anio: 2026, digital: 856, efectivo: 368 },
      { mes: 'Jun', anio: 2026, digital: 858, efectivo: 390 },
    ],
    ranking: [
      { nombre: 'Sandwich de Pollo', unidades: 57 },
      { nombre: 'Jugo Natural de Mora', unidades: 51 },
      { nombre: 'Almuerzo Ejecutivo', unidades: 39 },
      { nombre: 'Granola con Yogurt', unidades: 32 },
      { nombre: 'Agua Embotellada', unidades: 30 },
    ],
  },
}

// Usuarios: padres, usuarios de credito, personal operativo
export const padres = [
  { id: 'pa1', nombre: 'Roberto Salazar', correo: 'rsalazar@gmail.com', telefono: '0991234567', estado: 'Activo', hijos: ['Mateo Salazar'] },
  { id: 'pa2', nombre: 'Carmen Rojas', correo: 'crojas@gmail.com', telefono: '0987654321', estado: 'Activo', hijos: ['Valentina Rojas'] },
  { id: 'pa3', nombre: 'Luis Pérez', correo: 'lperez@gmail.com', telefono: '0976543210', estado: 'Inactivo', hijos: ['Joaquín Pérez'] },
]

export const usuariosCredito = [
  { id: 'uc1', nombre: 'Lic. Andrea Maldonado', correo: 'amaldonado@martimcerere.edu.ec', estado: 'Activo', montoAcumulado: 38.6, institucion: 'Martim Cereré', contrasena: 'Fh6nR2wZ' },
  { id: 'uc2', nombre: 'Ing. Pablo Cárdenas', correo: 'pcardenas@elsauce.edu.ec', estado: 'Activo', montoAcumulado: 24.1, institucion: 'El Sauce School', contrasena: 'Qm9dX4tK' },
  { id: 'uc3', nombre: 'Lic. María Fernanda Ortiz', correo: 'mfortiz@martimcerere.edu.ec', estado: 'Activo', montoAcumulado: 45.9, institucion: 'Martim Cereré', contrasena: 'Vc2gL7pY' },
  { id: 'uc4', nombre: 'Lic. Diego Sánchez', correo: 'dsanchez@elsauce.edu.ec', estado: 'Inactivo', montoAcumulado: 16.4, institucion: 'El Sauce School', contrasena: 'Jr5wB8mN' },
]

export const personalOperativo = [
  { id: 'po1', nombre: 'Carlos Mendoza', correo: 'cmendoza@delycattessen.com', sede: 'Martim Cereré', estado: 'Activo', contrasena: 'Kx7mQ2pR' },
  { id: 'po2', nombre: 'Sofía Vargas', correo: 'svargas@delycattessen.com', sede: 'El Sauce School', estado: 'Activo', contrasena: 'Th4jY9nW' },
  { id: 'po3', nombre: 'Raúl Torres', correo: 'rtorres@delycattessen.com', sede: 'Martim Cereré', estado: 'Inactivo', contrasena: 'Bp3sV8cL' },
]

// Consumo a credito del personal docente (RF-06 / RF-07)
export const consumoDocentes = [
  { id: 'd1', nombre: 'Lic. Andrea Maldonado', institucion: 'Martim Cereré', consumos: 14, total: 38.6, periodo: 'Junio 2026' },
  { id: 'd2', nombre: 'Ing. Pablo Cárdenas', institucion: 'El Sauce School', consumos: 9, total: 24.1, periodo: 'Junio 2026' },
  { id: 'd3', nombre: 'Lic. María Fernanda Ortiz', institucion: 'Martim Cereré', consumos: 17, total: 45.9, periodo: 'Junio 2026' },
  { id: 'd4', nombre: 'Lic. Diego Sánchez', institucion: 'El Sauce School', consumos: 6, total: 16.4, periodo: 'Junio 2026' },
]
