async function test() {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
      process.exit(1);
    }

    const res = await fetch(`${url}/rest/v1/payments`, {
      method: 'OPTIONS',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    console.log("Headers:", [...res.headers.entries()]);
    console.log("Body:", await res.text());
  } catch (e) {
    console.error(e);
  }
}

test();
