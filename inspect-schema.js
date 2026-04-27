// inspect-schema.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectSchema() {
  console.log('--- Inspecting Payments Table ---');
  const { data: paymentsInfo, error: paymentsError } = await supabase
    .from('payments')
    .select('*')
    .limit(1);

  if (paymentsError) {
    console.error('Error fetching payments:', paymentsError);
  } else {
    console.log('Payments columns:', Object.keys(paymentsInfo[0] || {}));
  }

  console.log('\n--- Inspecting Members Table ---');
  const { data: membersInfo, error: membersError } = await supabase
    .from('members')
    .select('*')
    .limit(1);

  if (membersError) {
    console.error('Error fetching members:', membersError);
  } else {
    console.log('Members columns:', Object.keys(membersInfo[0] || {}));
  }

  console.log('\n--- Testing Join Query ---');
  const { data: joinData, error: joinError } = await supabase
    .from('payments')
    .select('*, members(dni)')
    .limit(1);

  if (joinError) {
    console.error('Join Error:', joinError.message);
  } else {
    console.log('Join Success!');
  }
}

inspectSchema();
