/**
 * K1BO — Script para crear usuarios y datos de demostración
 *
 * Uso:
 *   node scripts/create-demo-users.js           # crea todo
 *   node scripts/create-demo-users.js --clean   # borra demo existente y recrea
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

// Cargar .env.local sin depender de dotenv
const fs = require('fs')
const path = require('path')
const envFile = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

const { createClient } = require('@supabase/supabase-js')

// ─── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('\n❌  Faltan variables de entorno:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY\n')
  console.error('   Agrégalas a .env.local y vuelve a ejecutar.\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Constantes ────────────────────────────────────────────────────────────────
const PASSWORD = 'Demo1234!'

const WORKING_HOURS = {
  lunes:     { open: true,  from: '08:00', to: '17:00' },
  martes:    { open: true,  from: '08:00', to: '17:00' },
  miercoles: { open: true,  from: '08:00', to: '17:00' },
  jueves:    { open: true,  from: '08:00', to: '17:00' },
  viernes:   { open: true,  from: '08:00', to: '17:00' },
  sabado:    { open: true,  from: '08:00', to: '12:00' },
  domingo:   { open: false },
}

// ─── Clientes demo ─────────────────────────────────────────────────────────────
const DEMO_CLIENTS = [
  { email: 'cliente1@k1bo-demo.com', full_name: 'Ana María Portillo',      phone: '7100-1001' },
  { email: 'cliente2@k1bo-demo.com', full_name: 'Sandra Beatriz González', phone: '7100-1002' },
  { email: 'cliente3@k1bo-demo.com', full_name: 'Mario José Moreno',       phone: '7100-1003' },
]

// ─── Profesionales demo ────────────────────────────────────────────────────────
const DEMO_PROFESSIONALS = [
  {
    email: 'pro01@k1bo-demo.com', full_name: 'Carlos Hernández Ayala', phone: '7123-4567',
    whatsapp: '7123-4567', featured: true, covers_entire_country: true, total_projects: 25,
    short_description: 'Especialista en cielos falsos y divisiones de tabla roca con más de 10 años de experiencia.',
    bio: 'Carlos Hernández lleva más de 10 años instalando cielos falsos y divisiones de tabla roca en San Salvador. Ha trabajado en proyectos residenciales y comerciales logrando acabados impecables y entregas puntuales. Su experiencia incluye diseños arquitectónicos, instalaciones en áreas húmedas y divisiones de oficinas.',
    categories: [
      { slug: 'cielo-falso-divisiones', projects: 25 },
      { slug: 'cielo-falso-tabla-roca', projects: 15 },
      { slug: 'divisiones-tabla-roca',  projects: 10 },
    ],
    services: ['Cielo falso tabla roca', 'Cielo falso PVC', 'Divisiones de tabla roca', 'Fascias y cornisas'],
    main_category: 'cielo-falso-divisiones',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Necesito instalar cielo falso de tabla roca en mi sala y comedor.', required_date: '2024-02-10', rating: 5, comment: 'Excelente trabajo en el cielo falso de mi sala. Quedó perfecto, limpio y terminado a tiempo. Lo recomiendo sin dudarlo.', review_date: '2024-02-20' },
      { client: 'cliente2@k1bo-demo.com', description: 'Quiero instalar divisiones de tabla roca para separar mi oficina.', required_date: '2024-03-05', rating: 5, comment: 'Instaló divisiones de tabla roca en mi oficina con acabados muy profesionales. Puntual y ordenado.', review_date: '2024-03-15' },
      { client: 'cliente3@k1bo-demo.com', description: 'Instalar cielo falso en habitación principal.', required_date: '2024-04-01', rating: 4, comment: 'Buen trabajo y precio justo. El cielo falso de mi habitación quedó muy bien, recomendado.', review_date: '2024-04-10' },
    ],
  },
  {
    email: 'pro02@k1bo-demo.com', full_name: 'Roberto Martínez Cruz', phone: '7234-5678',
    whatsapp: '7234-5678', featured: false, covers_entire_country: false, total_projects: 18,
    short_description: 'Instalación de cielos falsos PVC y tabla roca para hogares y negocios en San Salvador.',
    bio: 'Roberto Martínez tiene 8 años de experiencia en la instalación de sistemas de cielo falso en PVC y tabla roca. Trabaja principalmente en el área metropolitana de San Salvador ofreciendo precios competitivos y garantía en su trabajo. Especializado en divisiones de oficinas y acabados decorativos.',
    categories: [
      { slug: 'cielo-falso-divisiones', projects: 18 },
      { slug: 'cielo-falso-pvc-sub',    projects: 12 },
    ],
    services: ['Cielo falso PVC', 'Cielo falso tabla roca', 'Acabados decorativos'],
    main_category: 'cielo-falso-divisiones',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Cielo falso PVC para baño y cocina.', required_date: '2024-02-15', rating: 5, comment: 'Instaló cielo falso PVC en baño y cocina. Resistente a la humedad y quedó perfecto.', review_date: '2024-02-25' },
      { client: 'cliente2@k1bo-demo.com', description: 'Reparación de cielo falso dañado por humedad.', required_date: '2024-03-10', rating: 4, comment: 'Muy amable y trabajador. Reparó el cielo dañado de manera eficiente y con garantía.', review_date: '2024-03-20' },
      { client: 'cliente3@k1bo-demo.com', description: 'Cielo falso para sala de reuniones.', required_date: '2024-04-05', rating: 4, comment: 'Precio justo y buena calidad. Mi sala de reuniones quedó con un aspecto muy profesional.', review_date: '2024-04-15' },
    ],
  },
  {
    email: 'pro03@k1bo-demo.com', full_name: 'Miguel Ángel Torres Mendoza', phone: '7345-6789',
    whatsapp: '7345-6789', featured: true, covers_entire_country: true, total_projects: 22,
    short_description: 'Instalación de paneles WPC y PVC para interiores y exteriores de alta calidad.',
    bio: 'Miguel Ángel Torres se especializa en el revestimiento de paredes con paneles WPC y PVC, materiales modernos que combinan estética y durabilidad. Con 7 años en el rubro ha completado más de 120 proyectos en el área de San Salvador. Ofrece asesoría gratuita y muestra de materiales antes de iniciar.',
    categories: [{ slug: 'paneles-wpc-pvc', projects: 22 }],
    services: ['Paneles WPC', 'Paneles PVC', 'Revestimiento de paredes', 'Instalación interior'],
    main_category: 'paneles-wpc-pvc',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Revestir paredes de sala con paneles WPC decorativos.', required_date: '2024-02-20', rating: 5, comment: 'Transformó mis paredes con paneles WPC. El resultado es increíble y muy moderno.', review_date: '2024-03-01' },
      { client: 'cliente2@k1bo-demo.com', description: 'Paneles WPC para local comercial.', required_date: '2024-03-15', rating: 5, comment: 'Trabajo limpio, rápido y profesional. Los paneles quedaron perfectos en mi negocio.', review_date: '2024-03-25' },
      { client: 'cliente3@k1bo-demo.com', description: 'Revestimiento de pared exterior con paneles PVC.', required_date: '2024-04-10', rating: 4, comment: 'Materiales de calidad y buena instalación. Mi pared exterior quedó muy bien.', review_date: '2024-04-20' },
    ],
  },
  {
    email: 'pro04@k1bo-demo.com', full_name: 'José Luis Ramos Díaz', phone: '7456-7890',
    whatsapp: '7456-7890', featured: false, covers_entire_country: false, total_projects: 15,
    short_description: 'Revestimientos decorativos en paneles WPC y PVC para paredes interiores.',
    bio: 'José Luis Ramos ofrece soluciones de revestimiento modernas con paneles WPC y PVC. Con 6 años de trayectoria se ha enfocado en proyectos residenciales en San Salvador y alrededores. Sus trabajos destacan por la precisión en los cortes y el acabado limpio de las instalaciones.',
    categories: [{ slug: 'paneles-wpc-pvc', projects: 15 }],
    services: ['Paneles WPC', 'Paneles PVC', 'Revestimiento decorativo'],
    main_category: 'paneles-wpc-pvc',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Paneles decorativos para recepción de oficina.', required_date: '2024-03-01', rating: 5, comment: 'Instaló paneles en mi recepción y quedó elegantísima. Muy recomendado.', review_date: '2024-03-10' },
      { client: 'cliente2@k1bo-demo.com', description: 'Revestimiento WPC para dormitorio principal.', required_date: '2024-03-20', rating: 4, comment: 'Buen profesional, trabajo ordenado y acabado de primera calidad.', review_date: '2024-03-30' },
      { client: 'cliente3@k1bo-demo.com', description: 'Paneles PVC para área de cocina.', required_date: '2024-04-15', rating: 4, comment: 'Precio competitivo y excelente resultado. Definitivamente lo volvería a contratar.', review_date: '2024-04-25' },
    ],
  },
  {
    email: 'pro05@k1bo-demo.com', full_name: 'Eduardo Flores Gutiérrez', phone: '7567-8901',
    whatsapp: '7567-8901', featured: true, covers_entire_country: true, total_projects: 20,
    short_description: 'Fabricación e instalación de ventanas PVC con herrajes de primera calidad.',
    bio: 'Eduardo Flores es técnico especializado en ventanas de PVC desde hace 9 años. Sus instalaciones garantizan ahorro energético, aislamiento acústico y seguridad para el hogar. Atiende proyectos residenciales y comerciales en el departamento de San Salvador con garantía incluida.',
    categories: [{ slug: 'ventanas-pvc', projects: 20 }],
    services: ['Ventanas PVC', 'Puertas PVC', 'Aislamiento acústico', 'Fabricación a medida'],
    main_category: 'ventanas-pvc',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Cambiar 6 ventanas de aluminio por PVC en mi casa.', required_date: '2024-03-05', rating: 5, comment: 'Mis ventanas nuevas de PVC son perfectas. Reducen mucho el calor y el ruido de la calle.', review_date: '2024-03-15' },
      { client: 'cliente2@k1bo-demo.com', description: 'Ventanas PVC para segundo piso de residencia.', required_date: '2024-03-25', rating: 5, comment: 'Instalación rápida y limpia. Los marcos quedaron bien sellados, sin filtraciones.', review_date: '2024-04-05' },
      { client: 'cliente3@k1bo-demo.com', description: 'Puerta de PVC para entrada principal.', required_date: '2024-04-20', rating: 4, comment: 'Excelente inversión. La diferencia en temperatura dentro de mi casa es muy notable.', review_date: '2024-05-01' },
    ],
  },
  {
    email: 'pro06@k1bo-demo.com', full_name: 'Óscar Pereira Aguilar', phone: '7678-9012',
    whatsapp: '7678-9012', featured: false, covers_entire_country: false, total_projects: 14,
    short_description: 'Ventanas y puertas de PVC a medida, instalación profesional garantizada.',
    bio: 'Óscar Pereira ofrece fabricación y montaje de ventanas PVC a medida. Con más de 7 años en el mercado trabaja con importadores directos lo que le permite ofrecer precios competitivos. Su trabajo incluye garantía de un año en mano de obra e instalación.',
    categories: [{ slug: 'ventanas-pvc', projects: 14 }],
    services: ['Ventanas PVC', 'Marcos PVC', 'Instalación de ventanas'],
    main_category: 'ventanas-pvc',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Ventanas PVC a medida para local comercial.', required_date: '2024-03-10', rating: 5, comment: 'Ventanas a medida, bien instaladas y con garantía incluida. Muy satisfecho.', review_date: '2024-03-20' },
      { client: 'cliente2@k1bo-demo.com', description: 'Reparación de ventana PVC dañada.', required_date: '2024-03-30', rating: 4, comment: 'Profesional y puntual. Mi casa quedó mucho más fresca y silenciosa.', review_date: '2024-04-10' },
      { client: 'cliente3@k1bo-demo.com', description: 'Instalar ventana PVC en habitación nueva.', required_date: '2024-04-25', rating: 4, comment: 'Atendió todas mis dudas y el resultado fue exactamente el esperado.', review_date: '2024-05-05' },
    ],
  },
  {
    email: 'pro07@k1bo-demo.com', full_name: 'Juan Carlos López Rivas', phone: '7789-0123',
    whatsapp: '7789-0123', featured: true, covers_entire_country: true, total_projects: 30,
    short_description: 'Maestro de obra con 15 años de experiencia en construcción, repellos y enchapes.',
    bio: 'Juan Carlos López es maestro de obra con 15 años de experiencia en construcción residencial y comercial. Se especializa en repellos, enchapes, levantado de paredes y reparaciones estructurales. Su trabajo es reconocido por la calidad y limpieza de los acabados finales.',
    categories: [{ slug: 'albanileria', projects: 30 }],
    services: ['Repello', 'Enchape', 'Levantado de paredes', 'Fundiciones'],
    main_category: 'albanileria',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Repello de fachada exterior completa.', required_date: '2024-03-15', rating: 5, comment: 'Repelló toda mi casa con acabados increíblemente lisos. Trabajo de maestro, muy profesional.', review_date: '2024-03-25' },
      { client: 'cliente2@k1bo-demo.com', description: 'Enchape de cerámica en cocina y dos baños.', required_date: '2024-04-05', rating: 5, comment: 'Enchapó cocina y dos baños con cerámica. Trabajo muy limpio y bien medido. Excelente.', review_date: '2024-04-15' },
      { client: 'cliente3@k1bo-demo.com', description: 'Levantar pared divisoria en patio.', required_date: '2024-05-01', rating: 4, comment: 'Levantó la pared divisoria en tiempo récord. Sólida y bien terminada, recomendado.', review_date: '2024-05-10' },
    ],
  },
  {
    email: 'pro08@k1bo-demo.com', full_name: 'Ernesto Vásquez Portillo', phone: '7890-1234',
    whatsapp: '7890-1234', featured: false, covers_entire_country: false, total_projects: 24,
    short_description: 'Trabajos de albañilería: pisos, paredes, escaleras y reparaciones en general.',
    bio: 'Ernesto Vásquez cuenta con 12 años de experiencia en trabajos de albañilería general. Ha trabajado en colonias residenciales y proyectos comerciales del área de San Salvador. Ofrece presupuesto sin costo y garantiza su trabajo por 6 meses.',
    categories: [{ slug: 'albanileria', projects: 24 }],
    services: ['Repello', 'Enchape de cerámica', 'Reparaciones generales'],
    main_category: 'albanileria',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Reparar grietas en paredes interiores.', required_date: '2024-03-20', rating: 5, comment: 'Excelente albañil, conoce muy bien el oficio. Mi patio quedó como nuevo.', review_date: '2024-03-30' },
      { client: 'cliente2@k1bo-demo.com', description: 'Enchape de patio con cerámica antideslizante.', required_date: '2024-04-10', rating: 4, comment: 'Trabajó con mucho cuidado y limpieza. Recomendado 100%, volveré a contratarlo.', review_date: '2024-04-20' },
      { client: 'cliente3@k1bo-demo.com', description: 'Fundir losa de cochera.', required_date: '2024-05-05', rating: 4, comment: 'Buen precio, cumplió el plazo acordado y dejó todo muy limpio al terminar.', review_date: '2024-05-15' },
    ],
  },
  {
    email: 'pro09@k1bo-demo.com', full_name: 'Antonio Mejía Salinas', phone: '7901-2345',
    whatsapp: '7901-2345', featured: true, covers_entire_country: true, total_projects: 28,
    short_description: 'Pintura interior y exterior, acabados decorativos y stencil para su hogar.',
    bio: 'Antonio Mejía tiene 11 años pintando interiores y exteriores en el área metropolitana de San Salvador. Trabaja con pinturas de primera calidad y ofrece asesoría en selección de colores sin costo adicional. Sus trabajos incluyen pintura de casas, apartamentos, oficinas y bodegas.',
    categories: [{ slug: 'pintura', projects: 28 }],
    services: ['Pintura interior', 'Pintura exterior', 'Acabados decorativos', 'Stencil'],
    main_category: 'pintura',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Pintar interior completo de casa de 3 habitaciones.', required_date: '2024-04-01', rating: 5, comment: 'Pintó toda mi casa interior en 3 días. Colores exactos, acabado muy limpio y profesional.', review_date: '2024-04-10' },
      { client: 'cliente2@k1bo-demo.com', description: 'Pintura exterior de fachada y barda.', required_date: '2024-04-20', rating: 5, comment: 'Excelente preparación de superficies antes de pintar. El acabado dura más que antes.', review_date: '2024-05-01' },
      { client: 'cliente3@k1bo-demo.com', description: 'Pintar local comercial interior.', required_date: '2024-05-10', rating: 4, comment: 'Mi negocio quedó como nuevo después de la pintura. Muy profesional y puntual.', review_date: '2024-05-20' },
    ],
  },
  {
    email: 'pro10@k1bo-demo.com', full_name: 'Francisco Portillo Chávez', phone: '7012-3456',
    whatsapp: '7012-3456', featured: false, covers_entire_country: false, total_projects: 19,
    short_description: 'Pintor profesional para interiores, exteriores y acabados especiales.',
    bio: 'Francisco Portillo es pintor especializado con más de 9 años en el oficio. Se distingue por su cuidado en la preparación de superficies antes de pintar garantizando mayor durabilidad del acabado. Trabaja en proyectos de todos los tamaños en San Salvador.',
    categories: [{ slug: 'pintura', projects: 19 }],
    services: ['Pintura residencial', 'Pintura comercial', 'Preparación de superficies'],
    main_category: 'pintura',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Pintura de apartamento recién construido.', required_date: '2024-04-05', rating: 5, comment: 'Puntual, ordenado y trabajó con mucho cuidado. Totalmente recomendado.', review_date: '2024-04-15' },
      { client: 'cliente2@k1bo-demo.com', description: 'Repintar habitaciones con acabado mate.', required_date: '2024-04-25', rating: 4, comment: 'Los colores quedaron uniformes y sin manchas. Muy satisfecho con el resultado.', review_date: '2024-05-05' },
      { client: 'cliente3@k1bo-demo.com', description: 'Pintura de oficina corporativa.', required_date: '2024-05-15', rating: 4, comment: 'Precio justo y resultado excelente en pintura interior y exterior.', review_date: '2024-05-25' },
    ],
  },
  {
    email: 'pro11@k1bo-demo.com', full_name: 'Luis Alberto Morales Pineda', phone: '7123-5678',
    whatsapp: '7123-5678', featured: true, covers_entire_country: true, total_projects: 21,
    short_description: 'Diseño y mantenimiento de jardines, podas y paisajismo en El Salvador.',
    bio: 'Luis Alberto Morales es paisajista con 8 años diseñando y manteniendo jardines en San Salvador. Se especializa en jardines tropicales, sistemas de riego y contratos de mantenimiento mensual. Ha trabajado en residencias, condominios y espacios corporativos.',
    categories: [{ slug: 'jardineria', projects: 21 }],
    services: ['Diseño de jardines', 'Mantenimiento mensual', 'Podas', 'Sistemas de riego'],
    main_category: 'jardineria',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Diseñar jardín trasero desde cero.', required_date: '2024-04-10', rating: 5, comment: 'Diseñó y sembró mi jardín de cero. Quedó hermoso y muy bien organizado.', review_date: '2024-04-20' },
      { client: 'cliente2@k1bo-demo.com', description: 'Mantenimiento mensual de jardín grande.', required_date: '2024-04-30', rating: 5, comment: 'Mantiene mi jardín mensualmente con mucha dedicación. Siempre puntual y responsable.', review_date: '2024-05-10' },
      { client: 'cliente3@k1bo-demo.com', description: 'Poda de 5 árboles grandes.', required_date: '2024-05-20', rating: 4, comment: 'Podó todos mis árboles sin dañar las plantas del alrededor. Trabajo muy experto.', review_date: '2024-06-01' },
    ],
  },
  {
    email: 'pro12@k1bo-demo.com', full_name: 'Rodrigo Sánchez Henríquez', phone: '7234-6789',
    whatsapp: '7234-6789', featured: false, covers_entire_country: false, total_projects: 16,
    short_description: 'Poda de árboles, limpieza de jardines y mantenimiento de áreas verdes.',
    bio: 'Rodrigo Sánchez ofrece servicios de mantenimiento de jardines, podas de altura y limpieza de áreas verdes. Con 6 años de experiencia brinda contratos de mantenimiento mensual y atención de emergencias. Trabaja con equipo propio y personal capacitado.',
    categories: [{ slug: 'jardineria', projects: 16 }],
    services: ['Podas de árboles', 'Limpieza de jardines', 'Mantenimiento de áreas verdes'],
    main_category: 'jardineria',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Limpieza y mantenimiento de jardín descuidado.', required_date: '2024-04-15', rating: 5, comment: 'Limpió mi jardín abandonado y lo dejó como nuevo. Muy buen trabajo y precio justo.', review_date: '2024-04-25' },
      { client: 'cliente2@k1bo-demo.com', description: 'Contrato de mantenimiento quincenal.', required_date: '2024-05-05', rating: 4, comment: 'Atendió mi jardín con mucho esmero. Lo recomendaría a cualquier persona.', review_date: '2024-05-15' },
      { client: 'cliente3@k1bo-demo.com', description: 'Podas y limpieza general de área verde.', required_date: '2024-05-25', rating: 4, comment: 'Buen servicio de mantenimiento. Mi jardín nunca había estado tan bien cuidado.', review_date: '2024-06-05' },
    ],
  },
  {
    email: 'pro13@k1bo-demo.com', full_name: 'Héctor Molina Escalón', phone: '7345-7890',
    whatsapp: '7345-7890', featured: true, covers_entire_country: true, total_projects: 27,
    short_description: 'Fontanero certificado, reparación de tuberías, instalación sanitaria y más.',
    bio: 'Héctor Molina es fontanero con 13 años de experiencia en instalaciones sanitarias residenciales y comerciales. Atiende emergencias de plomería los 7 días de la semana. Su especialidad incluye detección de fugas, reparación de tuberías y remodelaciones de baños.',
    categories: [{ slug: 'fontaneria', projects: 27 }],
    services: ['Instalación sanitaria', 'Reparación de tuberías', 'Detección de fugas', 'Remodelación de baños'],
    main_category: 'fontaneria',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Reparar fuga de agua bajo el lavadero.', required_date: '2024-04-20', rating: 5, comment: 'Resolvió una fuga que tenía meses en minutos. Rápido, limpio y garantizó su trabajo.', review_date: '2024-05-01' },
      { client: 'cliente2@k1bo-demo.com', description: 'Instalación completa de baño nuevo.', required_date: '2024-05-10', rating: 5, comment: 'Instaló nueva tubería en mi baño completamente. Trabajo de primera calidad y limpio.', review_date: '2024-05-20' },
      { client: 'cliente3@k1bo-demo.com', description: 'Cambio de tubería de agua fría completa.', required_date: '2024-06-01', rating: 4, comment: 'Atendió emergencia de plomería un sábado por la tarde. Muy agradecido con su servicio.', review_date: '2024-06-10' },
    ],
  },
  {
    email: 'pro14@k1bo-demo.com', full_name: 'Óscar Fuentes Barrera', phone: '7456-8901',
    whatsapp: '7456-8901', featured: false, covers_entire_country: false, total_projects: 23,
    short_description: 'Instalación y reparación de tuberías, sanitarios y llaves para su hogar.',
    bio: 'Óscar Fuentes lleva 10 años resolviendo problemas de fontanería en hogares y negocios del área de San Salvador. Trabaja con materiales certificados y ofrece garantía en materiales y mano de obra. Disponible para emergencias con respuesta en menos de 2 horas.',
    categories: [{ slug: 'fontaneria', projects: 23 }],
    services: ['Plomería general', 'Instalación de llaves', 'Emergencias plomería'],
    main_category: 'fontaneria',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Instalar nueva llave de cocina.', required_date: '2024-04-25', rating: 5, comment: 'Cambió la llave de cocina con rapidez y limpieza. Muy profesional en su trabajo.', review_date: '2024-05-05' },
      { client: 'cliente2@k1bo-demo.com', description: 'Detección de fuga en pared.', required_date: '2024-05-15', rating: 4, comment: 'Detectó y reparó una fuga oculta en la pared. Excelente trabajo diagnóstico.', review_date: '2024-05-25' },
      { client: 'cliente3@k1bo-demo.com', description: 'Reemplazar tuberías de baño principal.', required_date: '2024-06-05', rating: 4, comment: 'Buena atención, trabajo limpio y precio razonable. Lo recomiendo ampliamente.', review_date: '2024-06-15' },
    ],
  },
  {
    email: 'pro15@k1bo-demo.com', full_name: 'Rafael Zelaya Montes', phone: '7567-9012',
    whatsapp: '7567-9012', featured: true, covers_entire_country: true, total_projects: 29,
    short_description: 'Electricista certificado para instalaciones residenciales y comerciales.',
    bio: 'Rafael Zelaya es electricista certificado con 14 años de experiencia. Realiza instalaciones eléctricas desde cero, ampliaciones de panel, instalación de aires acondicionados y soluciones de domótica básica. Su trabajo cumple con las normas eléctricas de El Salvador.',
    categories: [{ slug: 'electricidad', projects: 29 }],
    services: ['Instalaciones eléctricas', 'Cableado estructurado', 'Paneles eléctricos', 'Luminarias LED'],
    main_category: 'electricidad',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Instalación eléctrica completa de casa nueva.', required_date: '2024-05-01', rating: 5, comment: 'Instaló el cableado completo de mi casa nueva cumpliendo todas las normas eléctricas.', review_date: '2024-05-10' },
      { client: 'cliente2@k1bo-demo.com', description: 'Revisión y corrección de instalación defectuosa.', required_date: '2024-05-20', rating: 5, comment: 'Revisó y corrigió mi instalación eléctrica defectuosa. Trabajo muy seguro y profesional.', review_date: '2024-06-01' },
      { client: 'cliente3@k1bo-demo.com', description: 'Instalar luminarias LED en oficina.', required_date: '2024-06-10', rating: 4, comment: 'Instaló luminarias LED en toda mi oficina. El ahorro en electricidad es muy notable.', review_date: '2024-06-20' },
    ],
  },
  {
    email: 'pro16@k1bo-demo.com', full_name: 'Jesús Ramírez Bonilla', phone: '7678-0123',
    whatsapp: '7678-0123', featured: false, covers_entire_country: false, total_projects: 20,
    short_description: 'Instalaciones eléctricas, cableado estructurado y reparaciones urgentes.',
    bio: 'Jesús Ramírez atiende todo tipo de trabajos eléctricos residenciales y comerciales con 11 años en el oficio. Se especializa en cableado estructurado, instalación de luminarias LED y corrección de instalaciones defectuosas. Disponible para emergencias eléctricas.',
    categories: [{ slug: 'electricidad', projects: 20 }],
    services: ['Electricidad residencial', 'Reparaciones eléctricas', 'Iluminación comercial'],
    main_category: 'electricidad',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Agregar tomas y apagadores en sala.', required_date: '2024-05-05', rating: 5, comment: 'Resolvió un problema eléctrico urgente con rapidez y profesionalismo. Excelente.', review_date: '2024-05-15' },
      { client: 'cliente2@k1bo-demo.com', description: 'Reparar corto circuito en cocina.', required_date: '2024-05-25', rating: 4, comment: 'Instalación de sockets y apagadores muy ordenada y limpia. Muy recomendado.', review_date: '2024-06-05' },
      { client: 'cliente3@k1bo-demo.com', description: 'Cableado estructurado para red de datos.', required_date: '2024-06-15', rating: 4, comment: 'Muy confiable y conoce bien el oficio. Mi negocio quedó con instalación segura.', review_date: '2024-06-25' },
    ],
  },
  {
    email: 'pro17@k1bo-demo.com', full_name: 'Víctor Argueta Mejía', phone: '7789-1234',
    whatsapp: '7789-1234', featured: true, covers_entire_country: true, total_projects: 18,
    short_description: 'Fabricación e instalación de estructuras metálicas, techos y portones.',
    bio: 'Víctor Argueta es herrero especializado con 12 años fabricando e instalando estructuras metálicas. Sus servicios incluyen techos a dos aguas, mezanines, portones automáticos y rejas de seguridad. Trabaja con acero galvanizado y tratamiento anticorrosivo para mayor durabilidad.',
    categories: [{ slug: 'estructura-metalica', projects: 18 }],
    services: ['Techos metálicos', 'Portones', 'Rejas de seguridad', 'Soldadura'],
    main_category: 'estructura-metalica',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Techo metálico a dos aguas para bodega.', required_date: '2024-05-10', rating: 5, comment: 'Fabricó e instaló el techo de mi bodega. Estructura sólida, bien soldada y duradera.', review_date: '2024-05-20' },
      { client: 'cliente2@k1bo-demo.com', description: 'Portón eléctrico corredizo para residencia.', required_date: '2024-05-30', rating: 5, comment: 'Instaló portón eléctrico en mi casa. Muy duradero, seguro y con garantía incluida.', review_date: '2024-06-10' },
      { client: 'cliente3@k1bo-demo.com', description: 'Rejas de seguridad para ventanas.', required_date: '2024-06-20', rating: 4, comment: 'Rejas de seguridad para mis ventanas. Trabajo fino, limpio y bien terminado.', review_date: '2024-07-01' },
    ],
  },
  {
    email: 'pro18@k1bo-demo.com', full_name: 'Marco Antonio Guzmán Peña', phone: '7890-2345',
    whatsapp: '7890-2345', featured: false, covers_entire_country: false, total_projects: 13,
    short_description: 'Estructuras metálicas para techos, pérgolas y protecciones residenciales.',
    bio: 'Marco Antonio Guzmán es soldador y estructurista con 9 años de experiencia. Se especializa en techados metálicos, pérgolas, canceles y rejas de seguridad. Sus trabajos incluyen diseño personalizado y tratamiento anticorrosivo para larga vida útil.',
    categories: [{ slug: 'estructura-metalica', projects: 13 }],
    services: ['Pérgolas', 'Canceles metálicos', 'Soldadura industrial'],
    main_category: 'estructura-metalica',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Pérgola metálica para terraza.', required_date: '2024-05-15', rating: 5, comment: 'Construyó una pérgola preciosa en mi terraza. Muy sólida y con excelente acabado.', review_date: '2024-05-25' },
      { client: 'cliente2@k1bo-demo.com', description: 'Canceles metálicos para cochera doble.', required_date: '2024-06-05', rating: 4, comment: 'Rejas y canceles en toda mi casa. Trabajo preciso y de buena calidad estructural.', review_date: '2024-06-15' },
      { client: 'cliente3@k1bo-demo.com', description: 'Techo metálico para cochera.', required_date: '2024-06-25', rating: 4, comment: 'Muy profesional con la soldadura. Mi cochera quedó con techo metálico excelente.', review_date: '2024-07-05' },
    ],
  },
  {
    email: 'pro19@k1bo-demo.com', full_name: 'Alejandro Reyes Castellanos', phone: '7901-3456',
    whatsapp: '7901-3456', featured: true, covers_entire_country: true, total_projects: 26,
    short_description: 'Instalación de pisos cerámicos, porcelanato y vínico para toda ocasión.',
    bio: 'Alejandro Reyes tiene 10 años instalando pisos de todo tipo en San Salvador. Se especializa en cerámica, porcelanato y pisos vínicos para ambientes residenciales y comerciales. Su trabajo incluye nivelación de bases, junteo y acabados impecables.',
    categories: [
      { slug: 'pisos',                     projects: 26 },
      { slug: 'pisos-ceramica-porcelanato', projects: 16 },
      { slug: 'pisos-vinico',               projects: 10 },
    ],
    services: ['Cerámica y porcelanato', 'Piso vínico', 'Nivelación de base', 'Instalación de pisos'],
    main_category: 'pisos',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Instalar porcelanato en sala, comedor y pasillos.', required_date: '2024-05-20', rating: 5, comment: 'Instaló porcelanato en toda la planta baja de mi casa. Acabado perfecto, sin una fisura.', review_date: '2024-06-01' },
      { client: 'cliente2@k1bo-demo.com', description: 'Piso vínico para oficina de 80m².', required_date: '2024-06-10', rating: 5, comment: 'Colocó piso vínico en mi oficina en un día. Quedó muy moderno y muy profesional.', review_date: '2024-06-20' },
      { client: 'cliente3@k1bo-demo.com', description: 'Levantar piso viejo y poner cerámica nueva.', required_date: '2024-07-01', rating: 4, comment: 'Levantó el piso viejo y puso cerámica nueva en cocina y baños. Excelente resultado.', review_date: '2024-07-10' },
    ],
  },
  {
    email: 'pro20@k1bo-demo.com', full_name: 'Diego Chávez Hernández', phone: '7012-4567',
    whatsapp: '7012-4567', featured: false, covers_entire_country: false, total_projects: 17,
    short_description: 'Pisos vínicos, cerámica y porcelanato: instalación rápida y garantizada.',
    bio: 'Diego Chávez es instalador de pisos con 7 años de trayectoria. Trabaja con materiales importados y nacionales adaptándose al presupuesto del cliente. Ofrece servicio de levantado de piso viejo, preparación de base y colocación de nuevo piso.',
    categories: [
      { slug: 'pisos',                     projects: 17 },
      { slug: 'pisos-ceramica-porcelanato', projects: 12 },
    ],
    services: ['Porcelanato', 'Cerámica', 'Levantado de piso viejo', 'Pisos comerciales'],
    main_category: 'pisos',
    reviews: [
      { client: 'cliente1@k1bo-demo.com', description: 'Instalar cerámica en 3 habitaciones.', required_date: '2024-05-25', rating: 5, comment: 'Instaló cerámica en mis 3 habitaciones. Trabajo rápido, limpio y de mucha calidad.', review_date: '2024-06-05' },
      { client: 'cliente2@k1bo-demo.com', description: 'Porcelanato en planta baja completa.', required_date: '2024-06-15', rating: 4, comment: 'Muy bien medido y cortado, sin desperdicios. El porcelanato quedó perfecto.', review_date: '2024-06-25' },
      { client: 'cliente3@k1bo-demo.com', description: 'Piso para local comercial 120m².', required_date: '2024-07-05', rating: 4, comment: 'Buena experiencia, precio justo y resultado hermoso en el piso de mi local.', review_date: '2024-07-15' },
    ],
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────
function log(msg)  { process.stdout.write(msg + '\n') }
function ok(msg)   { log('  ✓ ' + msg) }
function skip(msg) { log('  ↩ ' + msg) }
function fail(msg) { log('  ✗ ' + msg) }

async function createOrGetUser(email, full_name) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name },
  })

  if (!error) {
    ok(`${email}  →  ${data.user.id}`)
    return data.user
  }

  log(`  ⚠ Error al crear ${email}:`)
  log('    ' + JSON.stringify(error, null, 2).split('\n').join('\n    '))

  // Si ya existe, buscar por email
  if (error.message.toLowerCase().includes('already') || error.status === 422) {
    const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const existing = list?.users?.find(u => u.email === email)
    if (existing) {
      skip(`${email}  →  ${existing.id}  (ya existía)`)
      return existing
    }
  }

  fail(`${email}: ${error.message}`)
  return null
}

async function cleanDemo() {
  log('\n🧹  Limpiando datos demo anteriores...')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .in('id', (await supabase.auth.admin.listUsers({ perPage: 1000 }))
      .data?.users?.filter(u => u.email?.endsWith('@k1bo-demo.com'))
      .map(u => u.id) ?? [])

  const demoIds = profiles?.map(p => p.id) ?? []

  if (demoIds.length === 0) { log('  (nada que limpiar)'); return }

  await supabase.from('reviews').delete().in('client_id', demoIds)
  await supabase.from('reviews').delete().in('professional_id', demoIds)
  await supabase.from('quote_requests').delete().in('client_id', demoIds)
  await supabase.from('quote_requests').delete().in('professional_id', demoIds)
  await supabase.from('professional_services').delete().in('professional_id', demoIds)
  await supabase.from('professional_coverage').delete().in('professional_id', demoIds)
  await supabase.from('professional_categories').delete().in('professional_id', demoIds)
  await supabase.from('professionals').delete().in('id', demoIds)
  await supabase.from('profiles').delete().in('id', demoIds)

  for (const id of demoIds) {
    await supabase.auth.admin.deleteUser(id)
  }
  ok(`${demoIds.length} usuarios y sus datos eliminados`)
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const isClean = process.argv.includes('--clean')

  log('\n══════════════════════════════════════════════')
  log('  K1BO — Creación de datos de demostración')
  log('══════════════════════════════════════════════')

  if (isClean) await cleanDemo()

  // ── 0. Verificar conectividad y Auth Admin ────────────────────────────────
  log('\n🔌  Verificando conexión con Supabase Admin...')
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
  if (listError) {
    log('❌  No se puede conectar al Admin API:')
    log('    ' + JSON.stringify(listError, null, 2).split('\n').join('\n    '))
    log('\n   Verifica que SUPABASE_SERVICE_ROLE_KEY sea correcto y que el proyecto esté activo.')
    process.exit(1)
  }
  ok(`Admin API OK — ${listData.users.length} usuario(s) en página 1`)

  // Probar crear un usuario temporal para diagnosticar el error específico
  log('  🔍 Probando creación de usuario de prueba...')
  const testEmail = `test-diag-${Date.now()}@k1bo-demo.com`
  const { data: testUser, error: testError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: 'Test1234!',
    email_confirm: true,
  })
  if (testError) {
    log('❌  Error al crear usuario de prueba:')
    log('    status: ' + testError.status)
    log('    message: ' + testError.message)
    log('    code: ' + testError.code)
    log('    ' + JSON.stringify(testError, null, 2).split('\n').join('\n    '))
    log('\n   ⚠️  Esto indica un problema en la configuración de Auth de Supabase.')
    log('   → Ve a: Authentication → Providers → Email y asegúrate de que esté habilitado.')
    log('   → Si tienes SMTP personalizado, verifica la configuración en Authentication → SMTP Settings.')
    process.exit(1)
  } else {
    ok(`Usuario de prueba creado: ${testUser.user.id}`)
    await supabase.auth.admin.deleteUser(testUser.user.id)
    ok('Usuario de prueba eliminado. Auth Admin funciona correctamente.')
  }

  // ── 1. IDs de referencia ──────────────────────────────────────────────────
  log('\n📋  Cargando IDs de referencia...')

  const { data: countryRow } = await supabase
    .from('countries').select('id').eq('code', 'SV').single()
  if (!countryRow) { log('❌  No se encontró El Salvador en countries. ¿Ejecutaste seed.sql?'); process.exit(1) }
  const countryId = countryRow.id

  const { data: deptRow } = await supabase
    .from('departments').select('id').eq('name', 'San Salvador').single()
  if (!deptRow) { log('❌  No se encontró departamento San Salvador.'); process.exit(1) }
  const departmentId = deptRow.id

  // Cargar todas las categorías de una vez
  const allSlugs = [...new Set(DEMO_PROFESSIONALS.flatMap(p => [
    p.main_category, ...p.categories.map(c => c.slug)
  ]))]
  const { data: catRows } = await supabase
    .from('categories').select('id, slug').in('slug', allSlugs)
  const catMap = Object.fromEntries(catRows?.map(c => [c.slug, c.id]) ?? [])

  const missingCats = allSlugs.filter(s => !catMap[s])
  if (missingCats.length > 0) {
    log(`⚠️  Categorías no encontradas: ${missingCats.join(', ')}`)
    log('   Ejecuta primero el SQL de categorías en el dashboard de Supabase.')
  }

  ok(`country_id, department_id y ${Object.keys(catMap).length} categorías cargadas`)

  // ── 2. Crear usuarios ─────────────────────────────────────────────────────
  log('\n👤  Creando clientes demo...')
  const idMap = {}
  for (const c of DEMO_CLIENTS) {
    const user = await createOrGetUser(c.email, c.full_name)
    if (user) idMap[c.email] = user.id
  }

  log('\n👷  Creando profesionales demo...')
  for (const p of DEMO_PROFESSIONALS) {
    const user = await createOrGetUser(p.email, p.full_name)
    if (user) idMap[p.email] = user.id
  }

  // ── 3. Perfiles ───────────────────────────────────────────────────────────
  log('\n📝  Insertando perfiles...')

  const clientProfiles = DEMO_CLIENTS
    .filter(c => idMap[c.email])
    .map(c => ({
      id: idMap[c.email], country_id: countryId, department_id: departmentId,
      role: 'client', full_name: c.full_name, phone: c.phone,
      address: 'San Salvador, El Salvador', verified: false, active: true,
    }))

  const proProfiles = DEMO_PROFESSIONALS
    .filter(p => idMap[p.email])
    .map(p => ({
      id: idMap[p.email], country_id: countryId, department_id: departmentId,
      role: 'professional', full_name: p.full_name, phone: p.phone,
      address: 'San Salvador, El Salvador', verified: true, active: true,
    }))

  const { error: profErr } = await supabase
    .from('profiles')
    .upsert([...clientProfiles, ...proProfiles], { onConflict: 'id' })
  if (profErr) fail(`Perfiles: ${profErr.message}`)
  else ok(`${clientProfiles.length + proProfiles.length} perfiles insertados`)

  // ── 4. Datos de profesionales ─────────────────────────────────────────────
  log('\n🔧  Insertando datos de profesionales...')

  const prosData = DEMO_PROFESSIONALS
    .filter(p => idMap[p.email])
    .map(p => ({
      id: idMap[p.email],
      short_description: p.short_description,
      bio: p.bio,
      working_hours: WORKING_HOURS,
      whatsapp: p.whatsapp,
      covers_entire_country: p.covers_entire_country,
      featured: p.featured,
      total_projects: p.total_projects,
    }))

  const { error: prosErr } = await supabase
    .from('professionals')
    .upsert(prosData, { onConflict: 'id' })
  if (prosErr) fail(`Profesionales: ${prosErr.message}`)
  else ok(`${prosData.length} profesionales insertados`)

  // ── 5. Categorías de profesionales ───────────────────────────────────────
  log('\n🏷️   Insertando categorías de profesionales...')

  const proCategories = DEMO_PROFESSIONALS
    .filter(p => idMap[p.email])
    .flatMap(p => p.categories
      .filter(c => catMap[c.slug])
      .map(c => ({
        professional_id: idMap[p.email],
        category_id: catMap[c.slug],
        projects_count: c.projects,
      }))
    )

  await supabase.from('professional_categories').delete()
    .in('professional_id', proCategories.map(r => r.professional_id))

  const { error: catErr } = await supabase.from('professional_categories').insert(proCategories)
  if (catErr) fail(`Categorías: ${catErr.message}`)
  else ok(`${proCategories.length} categorías asignadas`)

  // ── 6. Cobertura geográfica ───────────────────────────────────────────────
  log('\n📍  Insertando cobertura geográfica...')

  const proIds = DEMO_PROFESSIONALS.filter(p => idMap[p.email]).map(p => idMap[p.email])
  await supabase.from('professional_coverage').delete().in('professional_id', proIds)

  const coverage = proIds.map(id => ({ professional_id: id, department_id: departmentId }))
  const { error: covErr } = await supabase.from('professional_coverage').insert(coverage)
  if (covErr) fail(`Cobertura: ${covErr.message}`)
  else ok(`${coverage.length} registros de cobertura insertados`)

  // ── 7. Servicios / tags ───────────────────────────────────────────────────
  log('\n🔖  Insertando tags de servicios...')

  await supabase.from('professional_services').delete().in('professional_id', proIds)

  const services = DEMO_PROFESSIONALS
    .filter(p => idMap[p.email])
    .flatMap(p => p.services.map(tag => ({
      professional_id: idMap[p.email],
      service_tag: tag,
    })))

  const { error: svcErr } = await supabase.from('professional_services').insert(services)
  if (svcErr) fail(`Servicios: ${svcErr.message}`)
  else ok(`${services.length} tags insertados`)

  // ── 8 & 9. Cotizaciones y reseñas ─────────────────────────────────────────
  log('\n⭐  Insertando cotizaciones y reseñas...')

  let qrCount = 0, revCount = 0, revErrors = 0

  for (const pro of DEMO_PROFESSIONALS) {
    const proId = idMap[pro.email]
    if (!proId) continue
    const mainCatId = catMap[pro.main_category]
    if (!mainCatId) continue

    // Limpiar cotizaciones y reseñas previas de este profesional
    await supabase.from('reviews').delete().eq('professional_id', proId)
    const { data: oldQrs } = await supabase.from('quote_requests')
      .select('id').eq('professional_id', proId)
    if (oldQrs?.length) {
      await supabase.from('quote_requests').delete()
        .in('id', oldQrs.map(q => q.id))
    }

    for (const rev of pro.reviews) {
      const clientId = idMap[rev.client]
      if (!clientId) continue

      // Insertar cotización
      const { data: qr, error: qrErr } = await supabase
        .from('quote_requests')
        .insert({
          country_id:      countryId,
          client_id:       clientId,
          professional_id: proId,
          category_id:     mainCatId,
          description:     rev.description,
          required_date:   rev.required_date,
          status:          'accepted',
        })
        .select('id')
        .single()

      if (qrErr) { fail(`QR ${pro.email}: ${qrErr.message}`); revErrors++; continue }
      qrCount++

      // Insertar reseña
      const { error: revErr } = await supabase
        .from('reviews')
        .insert({
          professional_id:  proId,
          client_id:        clientId,
          quote_request_id: qr.id,
          category_id:      mainCatId,
          country_id:       countryId,
          rating:           rev.rating,
          comment:          rev.comment,
          created_at:       rev.review_date + 'T14:00:00+00:00',
        })

      if (revErr) { fail(`Reseña ${pro.email}: ${revErr.message}`); revErrors++ }
      else revCount++
    }
  }

  ok(`${qrCount} cotizaciones y ${revCount} reseñas insertadas${revErrors ? ` (${revErrors} errores)` : ''}`)

  // ── Resumen final ─────────────────────────────────────────────────────────
  log('\n══════════════════════════════════════════════')
  log('  ✅  Demo data creada exitosamente')
  log('══════════════════════════════════════════════')
  log(`  Usuarios:       ${Object.keys(idMap).length} (${DEMO_CLIENTS.length} clientes + ${DEMO_PROFESSIONALS.length} pros)`)
  log(`  Contraseña:     ${PASSWORD}`)
  log('')
  log('  UUIDs generados:')
  for (const [email, id] of Object.entries(idMap)) {
    log(`    ${email.padEnd(35)} ${id}`)
  }
  log('')
}

main().catch(err => {
  console.error('\n❌  Error inesperado:', err.message)
  process.exit(1)
})
