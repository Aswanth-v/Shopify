import { supabase } from '../lib/supabase'

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  let sid = sessionStorage.getItem('session_id')
  if (!sid) {
    sid = Math.random().toString(36).substring(2) + Date.now().toString(36)
    sessionStorage.setItem('session_id', sid)
  }
  return sid
}

export async function trackEvent(
  event: 'page_view' | 'product_click' | 'modal_open' | 'modal_close',
  product?: { id: number; title: string; category: string }
) {
  try {
    const { data, error } = await supabase.from('events').insert({
      event,
      product_id: product?.id ?? null,
      product_name: product?.title ?? null,
      product_category: product?.category ?? null,
      session_id: getSessionId(),
    })
    if (error) {
      console.error('❌ Supabase error:', error.message)
    } else {
      console.log('✅ Event saved:', event, product?.title ?? '')
    }
  } catch (err) {
    console.error('❌ Analytics error:', err)
  }
}