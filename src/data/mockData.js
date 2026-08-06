// Mock (simulated) data for the high-fidelity prototype.
// No API calls or real persistence: the prototype only navigates
// between screens to validate the use case flows.

export const institutions = [
  { id: 'mc', name: 'Martim Cereré' },
  { id: 'es', name: 'El Sauce School' },
]

export const categories = ['Bar', 'Almuerzo', 'Snacks', 'Bebidas', 'Postres']

// Master ingredients catalog: unique, standardized name synced via API
// with the allergen validation system. Products should only reference
// ingredients from this list.
export const ingredientsCatalog = [
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

export const products = [
  {
    id: 'p1',
    name: 'Sandwich de Pollo',
    description: 'Sandwich en pan integral con pollo a la plancha, lechuga y tomate.',
    category: 'Bar',
    price: 2.5,
    stock: 18,
    ingredients: ['Pan integral', 'Pollo a la plancha', 'Lechuga', 'Tomate', 'Mayonesa'],
    allergens: ['Gluten', 'Huevo'],
    image: '🥪',
    status: 'Activo',
  },
  {
    id: 'p2',
    name: 'Ensalada César',
    description: 'Ensalada fresca con pollo, queso parmesano, crutones y aderezo César.',
    category: 'Almuerzo',
    price: 3.2,
    stock: 12,
    ingredients: ['Lechuga', 'Pollo', 'Queso parmesano', 'Crutones', 'Aderezo César'],
    allergens: ['Gluten', 'Lácteos'],
    image: '🥗',
    status: 'Activo',
  },
  {
    id: 'p3',
    name: 'Jugo Natural de Mora',
    description: 'Jugo natural de mora preparado en el momento, sin conservantes.',
    category: 'Bebidas',
    price: 1.0,
    stock: 30,
    ingredients: ['Mora', 'Agua', 'Azúcar'],
    allergens: [],
    image: '🥤',
    status: 'Activo',
  },
  {
    id: 'p4',
    name: 'Brownie de Chocolate',
    description: 'Brownie artesanal de chocolate con nueces.',
    category: 'Postres',
    price: 1.5,
    stock: 0,
    ingredients: ['Harina', 'Chocolate', 'Huevo', 'Mantequilla', 'Nueces'],
    allergens: ['Gluten', 'Huevo', 'Frutos secos', 'Lácteos'],
    image: '🍫',
    status: 'Agotado',
  },
  {
    id: 'p5',
    name: 'Granola con Yogurt',
    description: 'Yogurt natural con granola casera, miel y fruta picada.',
    category: 'Snacks',
    price: 1.8,
    stock: 22,
    ingredients: ['Avena', 'Yogurt natural', 'Miel', 'Fruta picada'],
    allergens: ['Lácteos'],
    image: '🥣',
    status: 'Activo',
  },
  {
    id: 'p6',
    name: 'Almuerzo Ejecutivo',
    description: 'Menú completo con arroz, carne asada, menestra, ensalada y patacón.',
    category: 'Almuerzo',
    price: 3.5,
    stock: 9,
    ingredients: ['Arroz', 'Carne asada', 'Menestra', 'Ensalada', 'Patacón'],
    allergens: [],
    image: '🍽️',
    status: 'Activo',
  },
  {
    id: 'p7',
    name: 'Agua Embotellada',
    description: 'Agua embotellada 500ml.',
    category: 'Bebidas',
    price: 0.6,
    stock: 45,
    ingredients: ['Agua'],
    allergens: [],
    image: '💧',
    status: 'Activo',
  },
  {
    id: 'p8',
    name: 'Galletas de Avena',
    description: 'Galletas caseras de avena con pasas.',
    category: 'Snacks',
    price: 0.9,
    stock: 4,
    ingredients: ['Avena', 'Harina', 'Mantequilla', 'Pasas'],
    allergens: ['Gluten', 'Lácteos'],
    image: '🍪',
    status: 'Activo',
  },
]

// Monthly Menu dishes: entity separate from the Products catalog
// (products). They're prepared on demand based on each day's preorder
// count, not from a fixed inventory, so they have no stock field.
// Ingredients are required in order to validate allergens.
export const menuDishes = [
  {
    id: 'pl1',
    name: 'Almuerzo Ejecutivo',
    description: 'Menú completo con arroz, carne asada, menestra, ensalada y patacón.',
    image: '🍽️',
    ingredients: ['Arroz', 'Carne asada', 'Menestra', 'Ensalada', 'Patacón'],
  },
  {
    id: 'pl2',
    name: 'Ensalada César',
    description: 'Ensalada fresca con pollo, queso parmesano, crutones y aderezo César.',
    image: '🥗',
    ingredients: ['Lechuga', 'Pollo', 'Queso parmesano', 'Crutones', 'Aderezo César'],
  },
  {
    id: 'pl3',
    name: 'Jugo Natural de Mora',
    description: 'Jugo natural de mora preparado en el momento, sin conservantes.',
    image: '🥤',
    ingredients: ['Mora', 'Agua', 'Azúcar'],
  },
  {
    id: 'pl4',
    name: 'Sandwich de Pollo',
    description: 'Sandwich en pan integral con pollo a la plancha, lechuga y tomate.',
    image: '🥪',
    ingredients: ['Pan integral', 'Pollo a la plancha', 'Lechuga', 'Tomate', 'Mayonesa'],
  },
  {
    id: 'pl5',
    name: 'Agua Embotellada',
    description: 'Agua embotellada 500ml.',
    image: '💧',
    ingredients: ['Agua'],
  },
]

// Monthly menu planning: each business day (Monday to Friday) of the
// month has its own independent menu. Identified by date (YYYY-MM-DD).
// "days" assigns dishes (menuDishes) to each date, and "preorders" tracks
// the preorder count received for each date (RF: since it's prepared on
// demand, this count defines how much is produced that day).
export const monthlyMenu = [
  {
    id: 'mm1',
    month: 'Junio 2026',
    year: 2026,
    monthIndex: 5,
    status: 'Publicado',
    publicationDate: '2026-05-28',
    days: {
      '2026-06-01': ['pl1', 'pl3'],
      '2026-06-02': ['pl2', 'pl5'],
      '2026-06-03': ['pl1', 'pl3'],
      '2026-06-04': ['pl4', 'pl5'],
      '2026-06-05': ['pl2', 'pl3'],
      '2026-06-08': ['pl1', 'pl3'],
      '2026-06-09': ['pl2', 'pl5'],
    },
    preorders: {
      '2026-06-01': 34,
      '2026-06-02': 28,
      '2026-06-03': 31,
      '2026-06-04': 22,
      '2026-06-05': 19,
      '2026-06-08': 26,
      '2026-06-09': 30,
    },
  },
  {
    id: 'mm2',
    month: 'Julio 2026',
    year: 2026,
    monthIndex: 6,
    status: 'Borrador',
    publicationDate: null,
    days: {
      '2026-07-01': ['pl4', 'pl3'],
    },
    preorders: {
      '2026-07-01': 17,
    },
  },
]

// Promotions (RF-08): a promotion can cover one or several products
// (even the whole catalog), but the same product cannot be in more
// than one active promotion at a time. The status (Activa/Vencida) is
// calculated automatically from the validity date, it isn't stored — once
// it expires, the original price is restored with no manual intervention and
// the product becomes available again for a new promotion.
export const promotions = [
  {
    id: 'pr1',
    products: ['p1', 'p3'],
    image: '🥪',
    discount: 15,
    startDate: '2026-07-01',
    endDate: '2026-07-15',
  },
  {
    id: 'pr2',
    products: ['p5'],
    image: '🥣',
    discount: 10,
    startDate: '2026-06-10',
    endDate: '2026-06-20',
  },
  {
    id: 'pr3',
    products: ['p4'],
    image: '🍫',
    discount: 20,
    startDate: '2026-05-01',
    endDate: '2026-05-15',
  },
]

export const wastage = [
  { id: 'm1', product: 'Almuerzo Ejecutivo', quantity: 3, reason: 'Vencimiento de porción', date: '2026-06-15' },
  { id: 'm2', product: 'Brownie de Chocolate', quantity: 5, reason: 'Rotura en transporte', date: '2026-06-14' },
  { id: 'm3', product: 'Galletas de Avena', quantity: 2, reason: 'Humedad', date: '2026-06-12' },
]

// Dashboard analytics sales (RF-07), broken down by institution/branch.
export const salesByInstitution = {
  mc: {
    kpis: { revenueToday: 130.0, revenueWeek: 520.0, transactionsToday: 114 },
    daily: [
      { day: 'Lun', date: '2026-06-29', digital: 59, cash: 26 },
      { day: 'Mar', date: '2026-06-30', digital: 69, cash: 32 },
      { day: 'Mié', date: '2026-07-01', digital: 61, cash: 32 },
      { day: 'Jue', date: '2026-07-02', digital: 78, cash: 36 },
      { day: 'Vie', date: '2026-07-03', digital: 89, cash: 38 },
    ],
    weekly: [
      { week: 'Sem 1', range: '1 – 7 jun', digital: 299, cash: 133 },
      { week: 'Sem 2', range: '8 – 14 jun', digital: 347, cash: 160 },
      { week: 'Sem 3', range: '15 – 21 jun', digital: 283, cash: 131 },
      { week: 'Sem 4', range: '22 – 28 jun', digital: 359, cash: 161 },
    ],
    monthly: [
      { month: 'Ene', year: 2026, digital: 1092, cash: 486 },
      { month: 'Feb', year: 2026, digital: 1167, cash: 519 },
      { month: 'Mar', year: 2026, digital: 1206, cash: 534 },
      { month: 'Abr', year: 2026, digital: 1128, cash: 507 },
      { month: 'May', year: 2026, digital: 1284, cash: 552 },
      { month: 'Jun', year: 2026, digital: 1288, cash: 585 },
    ],
    ranking: [
      { name: 'Sandwich de Pollo', units: 85 },
      { name: 'Jugo Natural de Mora', units: 77 },
      { name: 'Almuerzo Ejecutivo', units: 58 },
      { name: 'Granola con Yogurt', units: 49 },
      { name: 'Agua Embotellada', units: 46 },
    ],
  },
  es: {
    kpis: { revenueToday: 81.4, revenueWeek: 346.0, transactionsToday: 70 },
    daily: [
      { day: 'Lun', date: '2026-06-29', digital: 39, cash: 18 },
      { day: 'Mar', date: '2026-06-30', digital: 46, cash: 21 },
      { day: 'Mié', date: '2026-07-01', digital: 41, cash: 21 },
      { day: 'Jue', date: '2026-07-02', digital: 52, cash: 24 },
      { day: 'Vie', date: '2026-07-03', digital: 59, cash: 25 },
    ],
    weekly: [
      { week: 'Sem 1', range: '1 – 7 jun', digital: 199, cash: 89 },
      { week: 'Sem 2', range: '8 – 14 jun', digital: 232, cash: 106 },
      { week: 'Sem 3', range: '15 – 21 jun', digital: 188, cash: 88 },
      { week: 'Sem 4', range: '22 – 28 jun', digital: 239, cash: 107 },
    ],
    monthly: [
      { month: 'Ene', year: 2026, digital: 728, cash: 324 },
      { month: 'Feb', year: 2026, digital: 778, cash: 346 },
      { month: 'Mar', year: 2026, digital: 804, cash: 356 },
      { month: 'Abr', year: 2026, digital: 752, cash: 338 },
      { month: 'May', year: 2026, digital: 856, cash: 368 },
      { month: 'Jun', year: 2026, digital: 858, cash: 390 },
    ],
    ranking: [
      { name: 'Sandwich de Pollo', units: 57 },
      { name: 'Jugo Natural de Mora', units: 51 },
      { name: 'Almuerzo Ejecutivo', units: 39 },
      { name: 'Granola con Yogurt', units: 32 },
      { name: 'Agua Embotellada', units: 30 },
    ],
  },
}

// Users: parents, credit users, operations staff
export const parents = [
  { id: 'pa1', name: 'Roberto Salazar', email: 'rsalazar@gmail.com', phone: '0991234567', status: 'Activo', children: ['Mateo Salazar'] },
  { id: 'pa2', name: 'Carmen Rojas', email: 'crojas@gmail.com', phone: '0987654321', status: 'Activo', children: ['Valentina Rojas'] },
  { id: 'pa3', name: 'Luis Pérez', email: 'lperez@gmail.com', phone: '0976543210', status: 'Inactivo', children: ['Joaquín Pérez'] },
]

export const creditUsers = [
  { id: 'uc1', name: 'Lic. Andrea Maldonado', email: 'amaldonado@martimcerere.edu.ec', status: 'Activo', accumulatedAmount: 38.6, institution: 'Martim Cereré', password: 'Fh6nR2wZ' },
  { id: 'uc2', name: 'Ing. Pablo Cárdenas', email: 'pcardenas@elsauce.edu.ec', status: 'Activo', accumulatedAmount: 24.1, institution: 'El Sauce School', password: 'Qm9dX4tK' },
  { id: 'uc3', name: 'Lic. María Fernanda Ortiz', email: 'mfortiz@martimcerere.edu.ec', status: 'Activo', accumulatedAmount: 45.9, institution: 'Martim Cereré', password: 'Vc2gL7pY' },
  { id: 'uc4', name: 'Lic. Diego Sánchez', email: 'dsanchez@elsauce.edu.ec', status: 'Inactivo', accumulatedAmount: 16.4, institution: 'El Sauce School', password: 'Jr5wB8mN' },
]

export const operationsStaff = [
  { id: 'po1', name: 'Carlos Mendoza', email: 'cmendoza@delycattessen.com', branch: 'Martim Cereré', status: 'Activo', password: 'Kx7mQ2pR' },
  { id: 'po2', name: 'Sofía Vargas', email: 'svargas@delycattessen.com', branch: 'El Sauce School', status: 'Activo', password: 'Th4jY9nW' },
  { id: 'po3', name: 'Raúl Torres', email: 'rtorres@delycattessen.com', branch: 'Martim Cereré', status: 'Inactivo', password: 'Bp3sV8cL' },
]

// Teaching staff credit consumption (RF-06 / RF-07)
export const teacherConsumption = [
  { id: 'd1', name: 'Lic. Andrea Maldonado', institution: 'Martim Cereré', consumptions: 14, total: 38.6, period: 'Junio 2026' },
  { id: 'd2', name: 'Ing. Pablo Cárdenas', institution: 'El Sauce School', consumptions: 9, total: 24.1, period: 'Junio 2026' },
  { id: 'd3', name: 'Lic. María Fernanda Ortiz', institution: 'Martim Cereré', consumptions: 17, total: 45.9, period: 'Junio 2026' },
  { id: 'd4', name: 'Lic. Diego Sánchez', institution: 'El Sauce School', consumptions: 6, total: 16.4, period: 'Junio 2026' },
]
