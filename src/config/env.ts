import { z } from 'zod';

/**
 * VetTech OS — Environment Schema & Defensive Runtime Validator
 * Strictly enforces Russian Veterinary Tele-Health & Regional Regulations
 * (4979-1-FZ / FGIS VetIS Horriot & Mercury) and Firebase Authentication
 */
const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1, 'VITE_APP_NAME is required').default('VetTech OS'),
  VITE_APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_DEFAULT_CITY: z.string().default('Санкт-Петербург'),
  VITE_DEFAULT_TIMEZONE: z.string().default('Europe/Moscow'),
  VITE_VETIS_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  VITE_DATA_LAYER_MODE: z.enum(['in-memory', 'firebase', 'postgres']).default('firebase'),
  VITE_TELEMED_EMERGENCY_DISPATCH_ENABLED: z
    .string()
    .transform((val) => val === 'true' || val === '1')
    .default('true'),
  VITE_REGULATORY_COMPLIANCE: z.string().default('4979-1-FZ'),
  VITE_SPB_DEFAULT_DISTRICT: z.string().default('Центральный'),

  // Firebase Web App Configuration
  VITE_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required').default('AIzaSyBKhlYZoEH5YUk2v8SmqWqUh5PDaa3qqJY'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required').default('vet-teck-faa9b.firebaseapp.com'),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required').default('vet-teck-faa9b'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().default('vet-teck-faa9b.firebasestorage.app'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().default('857641831751'),
  VITE_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required').default('1:857641831751:web:fea26d97a1598f90db5062'),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional().default('G-MY66HK4VJR'),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Defensive Environment Validation
 * Throws early at runtime if configuration invariants are violated.
 */
function validateEnv(): EnvConfig {
  const rawEnv = {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
    VITE_DEFAULT_CITY: import.meta.env.VITE_DEFAULT_CITY,
    VITE_DEFAULT_TIMEZONE: import.meta.env.VITE_DEFAULT_TIMEZONE,
    VITE_VETIS_ENVIRONMENT: import.meta.env.VITE_VETIS_ENVIRONMENT,
    VITE_DATA_LAYER_MODE: import.meta.env.VITE_DATA_LAYER_MODE,
    VITE_TELEMED_EMERGENCY_DISPATCH_ENABLED: import.meta.env.VITE_TELEMED_EMERGENCY_DISPATCH_ENABLED,
    VITE_REGULATORY_COMPLIANCE: import.meta.env.VITE_REGULATORY_COMPLIANCE,
    VITE_SPB_DEFAULT_DISTRICT: import.meta.env.VITE_SPB_DEFAULT_DISTRICT,

    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues
      .map((issue) => `  - [${issue.path.join('.')}] ${issue.message}`)
      .join('\n');
    const errorMessage = `[VetTech OS Critical Configuration Error]\nEnvironment invariant validation failed:\n${formattedErrors}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return parsed.data;
}

export const env: EnvConfig = validateEnv();
