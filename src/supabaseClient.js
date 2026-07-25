import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ykooktqnxunmoenucdoy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Wo14uG3EowORP_eHV7SMlw_o1HLqU0f";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);