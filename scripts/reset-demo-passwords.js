/**
 * Artifex7 — Resetear contraseñas de usuarios demo
 *
 * Uso:
 *   node scripts/reset-demo-passwords.js
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('\n❌  Faltan variables de entorno:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const PASSWORD = 'Demo1234!'

async function main() {
  console.log('\n══════════════════════════════════════════════')
  console.log('  Artifex7 — Reset contraseñas demo')
  console.log('══════════════════════════════════════════════\n')

  // Obtener todos los usuarios (paginando si hay más de 1000)
  let allUsers = []
  let page = 1
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) {
      console.error('❌  Error al listar usuarios:', error.message)
      process.exit(1)
    }
    allUsers = allUsers.concat(data.users)
    if (data.users.length < 1000) break
    page++
  }

  const demoUsers = allUsers.filter(u => u.email?.includes('artifex7-demo'))

  if (demoUsers.length === 0) {
    console.log('  (no se encontraron usuarios demo)\n')
    process.exit(0)
  }

  console.log(`  Encontrados ${demoUsers.length} usuarios demo. Actualizando contraseñas...\n`)

  let ok = 0
  let fail = 0

  for (const user of demoUsers) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: PASSWORD,
    })
    if (error) {
      console.error(`  ✗ ${user.email}: ${error.message}`)
      fail++
    } else {
      console.log(`  ✓ ${user.email}`)
      ok++
    }
  }

  console.log(`\n══════════════════════════════════════════════`)
  console.log(`  Listo: ${ok} actualizados, ${fail} errores`)
  console.log(`  Contraseña: ${PASSWORD}`)
  console.log(`══════════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('\n❌  Error inesperado:', err.message)
  process.exit(1)
})
