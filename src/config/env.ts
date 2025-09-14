import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
  VITE_DATA_BACKEND: z.enum(['mock', 'supabase']).default('mock'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_DEBUG: z.string().transform(val => val === 'true').default('false'),
});

export const env = envSchema.parse(import.meta.env);

export type Env = z.infer<typeof envSchema>;

export const BACKEND = env.VITE_DATA_BACKEND;
