# Choojai Cowork Quiz

Mobile-only static web quiz: selfie cam + MediaPipe pinch gesture, 5 questions recapping the Choojai Cowork training.

**Live:** https://nextrocket-labs.github.io/choojai-cowork-quiz/

## Run locally

```bash
pnpm install
pnpm dev --host
# open the LAN URL on your phone (HTTPS may be required for getUserMedia)
```

## Test

```bash
pnpm exec vitest run
```

## Deploy

Push to `main` → GitHub Actions builds and publishes to Pages. Configure repo settings: **Settings → Pages → Source: GitHub Actions**.

## Tech

Vite + TypeScript + Tailwind + MediaPipe Tasks Vision (Hand Landmarker). No backend.
