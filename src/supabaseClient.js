import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ykooktqnxunmoenucdoy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb29rdHFueHVubW9lbnVjZG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0Mjk5MjksImV4cCI6MjA5OTAwNTkyOX0.1pr6igr-m2MlcCDDb4876ZPUpFhvzX31QXfngFk7ZMI";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);