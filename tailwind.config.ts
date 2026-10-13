import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Clinical Veterinary Design Language Tokens
        vet: {
          // Primary Medical Blue
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#0D6EFD', // Primary Medical Blue
            600: '#0B5ED7', // Primary Hover / Action
            700: '#094db2',
            800: '#073c8c',
            900: '#052b66',
          },
          // Clinical Teal (Diagnostic / Sanitary / Telemed)
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14B8A6',
            600: '#0D9488', // Clinical Teal
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
          // Dark Slate for Typography & Medical Records
          slate: {
            50: '#F8FAFC',  // Surface Neutral Lightest
            100: '#F1F5F9', // Surface Neutral Soft
            200: '#E2E8F0', // Border & Divider Neutral
            300: '#CBD5E1',
            400: '#94A3B8', // Muted Text
            500: '#64748B', // Secondary Text
            600: '#475569',
            700: '#334155',
            800: '#1E293B', // Medical Heading Slate
            900: '#0F172A', // Primary Typography Slate
          },
          // Urgency Accents (Strict Veterinary Triage & House-Call SOS)
          emergency: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            500: '#ef4444',
            600: '#DC2626', // SOS / Acute Critical Triage Red
            700: '#b91c1c',
          },
          // Safety & Verification Accents (VetIS / Certified Veterinary Surgeon / Rabies Clearance)
          verified: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            500: '#10b981',
            600: '#059669', // Certified / Normal / Compliant Green
            700: '#047857',
          },
          // Timers & House-Call ETA Accents
          timer: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            500: '#f59e0b',
            600: '#D97706', // House-Call ETA / Active Timer Amber
            700: '#b45309',
          },
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      maxWidth: {
        mobile: '440px',
        tablet: '768px',
      },
      boxShadow: {
        clinical: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'clinical-md': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
        'clinical-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
        'emergency-glow': '0 0 15px -2px rgba(220, 38, 38, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
