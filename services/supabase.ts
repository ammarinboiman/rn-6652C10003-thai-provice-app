// สำหรับการตั้งค่าติดต่อกับ Supabase
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://iezpmdgptubwptqjzhnr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllenBtZGdwdHVid3B0cWp6aG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDY3MDQsImV4cCI6MjA4ODg4MjcwNH0.ddgvAoYBPoc_ExE1sH4QR9KiGzGu8tTYuFR9Nr24cpA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
