import { createClient } from '@supabase/supabase-js';

/*
 * Public project URL + anon/publishable key — safe to embed in client code.
 * These identify the project and are governed by Row Level Security (RLS)
 * policies on each table, not by secrecy of the key itself.
 */
const SUPABASE_URL = 'https://gfkplctbkaufnaaccoit.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_O1eanuxpPoU_7MPAXnE6Cw_VGsGr3Xi';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
