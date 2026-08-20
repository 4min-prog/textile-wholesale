require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  const { data: admins, error: fetchErr } = await supabase.from('Admin').select('*')
  if (fetchErr) {
    console.error('Fetch error:', fetchErr)
    process.exit(1)
  }
  console.log('Found admins:', admins.map(a => ({ id: a.id, email: a.email })))

  const hash = bcrypt.hashSync('admin123', 10)

  for (const a of admins) {
    const { error } = await supabase
      .from('Admin')
      .update({ email: 'admin@alacateksitil.com', password: hash })
      .eq('id', a.id)
    if (error) {
      console.error('Update error for id', a.id, ':', error)
    } else {
      console.log(`Updated: ${a.email} -> admin@alacateksitil.com`)
    }
  }

  console.log('Done!')
}

main().catch(e => { console.error(e); process.exit(1) })
