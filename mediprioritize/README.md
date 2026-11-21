# MediPrioritize

Clinical decision-support tool that analyzes medical imaging and datasets so healthcare teams can prioritize critical cases for faster assessment.

Originally built on Base44: https://hidden-scan-sort-save.base44.app

> Decision support only. Not a medical device. Placeholder scoring in `src/lib/triage.js` must not be used clinically.

The upload flow is a front-end demo: it does not transmit or analyze files. It adds a pending-review placeholder to the in-memory queue for the current browser session only.

The multimodal fusion view uses synthetic sample values and an illustrative score adjustment to demonstrate how labs and prior-scan comparisons could affect queue ordering. This is not validated clinical logic and must not be used to prioritize real patients.

## Getting started

```bash
npm install
cp .env.example .env   # add your Base44 app id
npm run dev
```

## Structure

```
src/
  api/         Base44 client + data access (sample data until wired up)
  components/  CaseTable, UrgencyBadge
  data/        Sample cases
  lib/         Triage scoring helpers
  pages/       Dashboard, Upload, CaseDetail
```

## Next steps

- Replace `src/api/client.js` stubs with your Base44 entities.
- Port the real scoring/analysis logic into `src/lib/triage.js`.
