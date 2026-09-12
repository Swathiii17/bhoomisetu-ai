const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory API Store (Seeded with initial government projects)
let projects = [
  {
    id: 'PRJ-2026-TN-001',
    name: 'Chennai–Bangalore Highway Expansion (NH-48)',
    type: 'Highway',
    ministry: 'Ministry of Road Transport and Highways',
    agency: 'National Highways Authority of India (NHAI)',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    proposedLandArea: 500,
    acquiredLandArea: 365,
    estimatedCost: 500.0,
    compensationAssessed: 50.0,
    compensationPaid: 38.0,
    status: 'Acquisition in Progress',
    currentStage: 'Compensation Disbursement',
    healthScore: 78,
    aiRiskScore: 78,
    aiRiskLevel: 'HIGH'
  }
];

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'BhoomiSetu AI REST Backend', timestamp: new Date() });
});

// GET /api/projects
app.get('/api/projects', (req, res) => {
  res.json({ success: true, count: projects.length, data: projects });
});

// GET /api/projects/:id
app.get('/api/projects/:id', (req, res) => {
  const prj = projects.find(p => p.id === req.params.id);
  if (!prj) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: prj });
});

// POST /api/projects
app.post('/api/projects', (req, res) => {
  const newPrj = {
    id: `PRJ-2026-API-${Date.now().toString().slice(-4)}`,
    ...req.body,
    status: 'Submitted',
    currentStage: 'District Verification',
    createdDate: new Date().toISOString()
  };
  projects.push(newPrj);
  res.status(201).json({ success: true, data: newPrj });
});

// AI Delay Prediction Endpoint
app.post('/api/ai/predict-delay', (req, res) => {
  const { approvalDelayDays, legalDisputes, compensationPending, compensationAssessed, rrCompletedPercentage } = req.body;
  
  let riskScore = 20;
  if (Number(legalDisputes) >= 5) riskScore += 30;
  if (Number(approvalDelayDays) > 14) riskScore += 25;
  if (Number(rrCompletedPercentage) < 60) riskScore += 20;

  riskScore = Math.min(98, Math.max(10, riskScore));
  const riskCategory = riskScore >= 61 ? 'HIGH' : riskScore >= 31 ? 'MEDIUM' : 'LOW';

  res.json({
    success: true,
    riskScore,
    riskCategory,
    riskFactors: [
      `${legalDisputes || 8} ongoing legal disputes`,
      `Pending compensation of ₹${compensationPending || 12} Cr`
    ],
    recommendedActions: [
      'Prioritize Lok Adalat settlement for legal land disputes',
      'Expedite compensation fund transfers via DBT gateway'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`BhoomiSetu AI REST Backend running on http://localhost:${PORT}`);
});
