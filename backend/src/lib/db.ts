import { neon, NeonQueryFunction } from '@neondatabase/serverless';

export interface Env {
  DATABASE_URL: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  LLM_API_KEY: string;
  EMAIL_API_KEY: string;
  ADMIN_PASSWORD: string;
  EXTENSION_ORIGIN: string;
  CHECKOUT_ORIGIN: string;
}

export function getDb(env: Env): NeonQueryFunction<false, false> {
  return neon(env.DATABASE_URL);
}
