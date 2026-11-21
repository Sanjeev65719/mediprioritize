# MediPrioritize

A React and Vite prototype for reviewing an imaging case queue, exploring illustrative multimodal context, and comparing a current finding with a prior scan.

> **Prototype only:** Scores and fusion adjustments are synthetic placeholders, not validated clinical logic. The app does not analyze or upload files and must not be used to prioritize real patients or guide care.

## Run locally

From the repository root:

```bash
npm install
npm run dev
```

The app also supports `npm run build` and `npm run preview`.

## Demo features

- Search, filter, and sort the sample review queue.
- Inspect synthetic lab, vital, history, and prior-scan context on case details.
- Compare illustrative image-only and context-adjusted scores.
- Add a file name as a pending-review placeholder. File contents stay on your device and are not processed.

## Configuration

The optional Base44 app ID can be set in `mediprioritize/.env.local` using `VITE_BASE44_APP_ID`. Never commit real environment files or credentials.
