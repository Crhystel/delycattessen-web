// Datos simulados (mock) para el prototipo de alta fidelidad.
// No hay llamadas a API ni persistencia real: el prototipo solo navega
// entre pantallas para validar los flujos de los casos de uso.

export const instituciones = [
  { id: 'mc', nombre: 'Martim Cereré' },
  { id: 'es', nombre: 'El Sauce School' },
]

export const categorias = ['Bar', 'Almuerzo', 'Snacks', 'Bebidas', 'Postres']

export const productos = [
  {
    id: 'p1',
    nombre: 'Sandwich de Pollo',
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
    categoria: 'Snacks',
    precio: 0.9,
    stock: 4,
    ingredientes: ['Avena', 'Harina', 'Mantequilla', 'Pasas'],
    alergenos: ['Gluten', 'Lácteos'],
    imagen: '🍪',
    estado: 'Activo',
  },
]

export const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

export const menuSemanal = {
  Lunes: ['p6', 'p3'],
  Martes: ['p2', 'p7'],
  Miércoles: ['p6', 'p3'],
  Jueves: ['p1', 'p7'],
  Viernes: ['p2', 'p3'],
}

export const promociones = [
  {
    id: 'pr1',
    titulo: 'Combo Bar 15% off',
    descripcion: 'Sandwich + Jugo Natural con descuento durante la primera semana del mes.',
    descuento: 15,
    vigenciaInicio: '2026-06-01',
    vigenciaFin: '2026-06-30',
    estado: 'Activa',
  },
  {
    id: 'pr2',
    titulo: 'Snack Saludable',
    descripcion: 'Granola con Yogurt a precio especial para fomentar consumo balanceado.',
    descuento: 10,
    vigenciaInicio: '2026-06-10',
    vigenciaFin: '2026-06-20',
    estado: 'Activa',
  },
  {
    id: 'pr3',
    titulo: 'Bienvenida Postres',
    descripcion: 'Brownie de chocolate con descuento de lanzamiento.',
    descuento: 20,
    vigenciaInicio: '2026-05-01',
    vigenciaFin: '2026-05-15',
    estado: 'Vencida',
  },
]

export const mermas = [
  { id: 'm1', producto: 'Almuerzo Ejecutivo', cantidad: 3, motivo: 'Vencimiento de porción', fecha: '2026-06-15' },
  { id: 'm2', producto: 'Brownie de Chocolate', cantidad: 5, motivo: 'Rotura en transporte', fecha: '2026-06-14' },
  { id: 'm3', producto: 'Galletas de Avena', cantidad: 2, motivo: 'Humedad', fecha: '2026-06-12' },
]

// Usuarios simulados para la pantalla de identificacion del POS
export const usuariosPOS = [
  {
    id: 'u1',
    tipo: 'Estudiante',
    nombre: 'Mateo Salazar',
    institucion: 'Martim Cereré',
    foto: '🧒',
    saldo: 8.4,
    alergenos: ['Lácteos'],
    controlParental: { limiteDiario: 3.0, diasHabilitados: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] },
    gastoHoy: 1.5,
    preorden: null,
  },
  {
    id: 'u2',
    tipo: 'Estudiante',
    nombre: 'Valentina Rojas',
    institucion: 'El Sauce School',
    foto: '👧',
    saldo: 2.1,
    alergenos: ['Gluten', 'Huevo'],
    controlParental: { limiteDiario: 2.5, diasHabilitados: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] },
    gastoHoy: 0,
    preorden: { producto: 'Almuerzo Ejecutivo', estado: 'Pendiente de entrega' },
  },
  {
    id: 'u3',
    tipo: 'Estudiante',
    nombre: 'Joaquín Pérez',
    institucion: 'Martim Cereré',
    foto: '🧒',
    saldo: 0.8,
    alergenos: [],
    controlParental: { limiteDiario: 1.5, diasHabilitados: ['Lunes', 'Miércoles', 'Viernes'] },
    gastoHoy: 1.5,
    preorden: null,
  },
  {
    id: 'u4',
    tipo: 'Docente',
    nombre: 'Lic. Andrea Maldonado',
    institucion: 'Martim Cereré',
    foto: '👩‍🏫',
    saldo: null,
    alergenos: ['Frutos secos'],
    controlParental: null,
    gastoHoy: 3.2,
    preorden: null,
    modalidad: 'Crédito',
  },
]

// Resumen para el dashboard de analitica (RF-07)
export const ventasDiarias = [
  { dia: 'Lun', ingresos: 142 },
  { dia: 'Mar', ingresos: 168 },
  { dia: 'Mié', ingresos: 155 },
  { dia: 'Jue', ingresos: 190 },
  { dia: 'Vie', ingresos: 211 },
]

export const ventasSemanales = [
  { semana: 'Sem 1', ingresos: 720 },
  { semana: 'Sem 2', ingresos: 845 },
  { semana: 'Sem 3', ingresos: 690 },
  { semana: 'Sem 4', ingresos: 866 },
]

export const rankingProductos = [
  { nombre: 'Sandwich de Pollo', unidades: 142 },
  { nombre: 'Jugo Natural de Mora', unidades: 128 },
  { nombre: 'Almuerzo Ejecutivo', unidades: 97 },
  { nombre: 'Granola con Yogurt', unidades: 81 },
  { nombre: 'Agua Embotellada', unidades: 76 },
]

export const kpisDashboard = {
  ingresosHoy: 211.4,
  ingresosSemana: 866.0,
  transaccionesHoy: 184,
  productoTop: 'Sandwich de Pollo',
  ticketPromedio: 1.49,
}

// Consumo a credito del personal docente (RF-06 / RF-07)
export const consumoDocentes = [
  { id: 'd1', nombre: 'Lic. Andrea Maldonado', institucion: 'Martim Cereré', consumos: 14, total: 38.6, periodo: 'Junio 2026' },
  { id: 'd2', nombre: 'Ing. Pablo Cárdenas', institucion: 'El Sauce School', consumos: 9, total: 24.1, periodo: 'Junio 2026' },
  { id: 'd3', nombre: 'Lic. María Fernanda Ortiz', institucion: 'Martim Cereré', consumos: 17, total: 45.9, periodo: 'Junio 2026' },
  { id: 'd4', nombre: 'Lic. Diego Sánchez', institucion: 'El Sauce School', consumos: 6, total: 16.4, periodo: 'Junio 2026' },
]
