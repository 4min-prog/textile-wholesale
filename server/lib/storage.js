const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : null

const BUCKET = 'products'

async function ensureBucket() {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
  if (error && !String(error.message).toLowerCase().includes('already exists')) {
    throw error
  }
}

async function uploadBuffer(buffer, filePath, contentType) {
  if (!supabase) throw new Error('Supabase Storage not configured')
  await ensureBucket()
  const { error } = await supabase.storage.from(BUCKET).upload(filePath, buffer, {
    contentType,
    upsert: true,
  })
  if (error) throw error
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`
}

module.exports = { uploadBuffer }
