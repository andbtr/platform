import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

export async function getBlocks() {
  const { data, error } = await supabaseServer
    .from('blocks')
    .select('id, name, total_price, image_url')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching blocks:', error)
    throw error
  }
  return data ?? []
}

export async function getPhotos() {
  const { data, error } = await supabaseServer
    .from('photos')
    .select('image_url, title, description')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching photos:', error)
    return []
  }
  return data ?? []
}

export async function getNews() {
  const { data, error } = await supabaseServer
    .from('news')
    .select('id, title, content, image_url, link, priority, type, created_at')
    .eq('active', true)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }
  return data ?? []
}

export async function getNewsById(id: number) {
  const { data, error } = await supabaseServer
    .from('news')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching news with id ${id}:`, error)
    return null
  }
  return data
}

export async function getBranches() {
  const { data, error } = await supabaseServer
    .from('branches')
    .select('id, city, name, location, phone, social_url, is_active')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching branches:', error)
    return []
  }
  return data ?? []
}
