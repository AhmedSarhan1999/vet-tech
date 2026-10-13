# VetTech OS & VetTech PRO

> **Pure Veterinary Mobile Clinician Ecosystem (Saint Petersburg)**  
> Comprehensive digital platform connecting pet owners, field veterinary clinicians, and emergency situational dispatch.

---

## Regulatory Compliance & Standards
- **Federal Law No. 4979-1 «О ветеринарии»** — Regulatory framework for veterinary services and mobile clinical examinations.
- **FGIS VetIS («Хорриот» & «Меркурий»)** — Integrated digital pet passport, traceability, and biological sample registration.
- **Federal Law No. 152-ФЗ «О персональных данных»** — Strict patient and owner privacy with MTS Exolve telephony proxying.
- **Federal Law No. 54-ФЗ & 422-ФЗ** — Self-employed (НПД) fiscalization, YooKassa escrow, and SBP instant payouts.
- **ГОСТ Р 34.12 & Enhanced UKEP** — Cryptographically signed telemedical consultations and electronic prescriptions.

---

## Core Ecosystem Modules

1. **VetTech Parent (Pet Owner Shell):**
   - Interactive urgent & scheduled home visit booking across Saint Petersburg districts.
   - Digital Pet Passport with vaccination tracking, allergy history, and chip verification.
   - Real-time clinician dispatch radar with live arrival handshake PIN verification.
   - YooKassa escrow billing and SBP instant payment settlement.

2. **VetTech PRO (Doctor Mobile Clinician Shell):**
   - Dynamic duty radar with polygon coverage, logistics barrier control, and shift tariffs.
   - Bedside examination workflow with arrival handshake PIN and in-exam dead-man monitor.
   - Mobile kit inventory management, bedside medication dispensing, and procedure consent requests.
   - Clinical SOAP protocol authoring, smart e-prescriptions, and Horriot/Mercury attestation.
   - Tele-curatorship 24/7 channels and encrypted WebRTC video consultations.

3. **VetTech COMMAND (Situational Dispatch & Admin Center):**
   - Real-time active call queue and emergency triage radar.
   - Clinician safety monitor, SOS alarm response, and dead-man timer intervention.
   - Escrow dispute arbitration and financial transaction control.
   - Doctor accreditation verification and FGIS VetIS attestation audit.

---

## Tech Stack
- **Frontend Framework:** React 18 with TypeScript 5.7
- **Styling:** Tailwind CSS with pure clinical light theme
- **Icons:** Lucide React SVG icons
- **Build System:** Vite 6
- **Data & Realtime Layer:** Firebase Firestore & WebRTC
- **Verification:** Strict TypeScript (`noUnusedLocals`, `noUnusedParameters`, strict null checks)

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
git clone https://github.com/AhmedSarhan1999/vet-tech.git
cd vet-tech
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build & Type Check
```bash
npm run build
```
