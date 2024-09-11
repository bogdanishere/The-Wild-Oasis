import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  SUPABASE_URL: str(),
  SUPABASE_API_KEY: str(),
});

export default env;
