import { createClient } from "@base44/sdk";
import { sampleCases } from "../data/sampleCases.js";

const appId = import.meta.env.VITE_BASE44_APP_ID;
export const base44 = appId ? createClient({ appId }) : null;

const addedCases = [];

// Swap these for real Base44 entity calls (e.g. base44.entities.Case.list()).
export async function listCases() {
  return [...sampleCases, ...addedCases];
}

export async function getCase(id) {
  return [...sampleCases, ...addedCases].find((c) => c.id === id) ?? null;
}

export async function createCase({ fileName }) {
  const caseNumber = 1042 + sampleCases.length + addedCases.length;
  const newCase = {
    id: crypto.randomUUID(),
    patient: `Case ${caseNumber}`,
    modality: "Uploaded study",
    finding: "Awaiting clinician review",
    score: null,
    fileName,
    received: new Date().toISOString()
  };
  addedCases.push(newCase);
  return newCase;
}
