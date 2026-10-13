/**
 * VetTech OS — UI Design Tokens & Primitive Types
 * Clinical Veterinary Design Language Specification
 */

export type ButtonVariant =
  | 'primary'      // Primary Medical Blue (#0D6EFD)
  | 'teal'         // Clinical Teal (#0D9488)
  | 'emergency'    // SOS Emergency Red (#DC2626)
  | 'outline'      // Subtle clinical slate border
  | 'ghost'        // Flat slate action
  | 'verified';    // Compliant Green (#059669)

export type ButtonSize = 'sm' | 'md' | 'lg';

export type BadgeVariant =
  | 'verified'     // Safe / Active Rabies / Horriot Synced (#059669)
  | 'emergency'    // SOS Critical Alert (#DC2626)
  | 'timer'        // ETA / Scheduled (#D97706)
  | 'medical'      // Clinical Blue (#0D6EFD)
  | 'teal'         // Clinical Teal (#0D9488)
  | 'neutral'      // Slate Surface
  | 'triage-red'
  | 'triage-orange'
  | 'triage-yellow'
  | 'triage-green'
  | 'triage-blue';

export type BadgeSize = 'sm' | 'md';

export type CardVariant =
  | 'default'
  | 'elevated'
  | 'emergency'
  | 'verified'
  | 'interactive';

export type SkeletonShape = 'text' | 'rectangular' | 'circular' | 'pill';
