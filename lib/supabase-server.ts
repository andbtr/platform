import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

export async function getBlocks() {
  const { data, error } = await supabaseServer
    .from('blocks')
    .select('id, name, total_price')

  if (error) throw error
  return data ?? []
}
