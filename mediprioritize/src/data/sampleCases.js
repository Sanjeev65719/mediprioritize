export const sampleCases = [
  { id: "c1", patient: "Case 1042", modality: "Chest X-ray", finding: "Possible pneumothorax", score: 0.91, received: "2026-11-17T08:10:00Z" },
  { id: "c2", patient: "Case 1043", modality: "CT head", finding: "No acute change", score: 0.22, received: "2026-11-17T08:25:00Z" },
  {
    id: "c3",
    patient: "Case 1044",
    modality: "Chest X-ray",
    finding: "Opacity, right lower lobe",
    score: 0.63,
    received: "2026-11-17T08:40:00Z",
    multimodal: {
      imageOnlyScore: 0.43,
      contextAdjustment: 0.20,
      labs: [{ name: "Inflammatory markers", value: "Elevated" }],
      vitals: [{ name: "Vitals", value: "Not provided" }],
      history: "Not provided in this demo",
      priorScan: {
        date: "2026-10-20",
        finding: "No focal opacity reported"
      },
      currentScan: "Right lower-lobe opacity",
      change: "New opacity compared with the previous report"
    }
  },
  { id: "c4", patient: "Case 1045", modality: "Chest X-ray", finding: "Mild interstitial prominence", score: 0.55, received: "2026-11-17T08:55:00Z" }
];
