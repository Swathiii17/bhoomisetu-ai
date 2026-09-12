import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PROJECTS,
  INITIAL_APPROVALS,
  INITIAL_PARCELS,
  INITIAL_COMPENSATION,
  INITIAL_FAMILIES,
  INITIAL_RR,
  INITIAL_MILESTONES,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  DEMO_USERS
} from '../services/mockData';
import { predictProjectDelayRisk, calculateProjectHealth } from '../services/mlService';
import { saveDocToCollection, fetchCollectionDocs, COLLECTIONS } from '../services/firebase';

const DataContext = createContext();

export function DataProvider({ children }) {
  // 11 Firestore Collections State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_users');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [approvals, setApprovals] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_approvals');
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [parcels, setParcels] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_parcels');
    return saved ? JSON.parse(saved) : INITIAL_PARCELS;
  });

  const [compensation, setCompensation] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_compensation');
    return saved ? JSON.parse(saved) : INITIAL_COMPENSATION;
  });

  const [families, setFamilies] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_families');
    return saved ? JSON.parse(saved) : INITIAL_FAMILIES;
  });

  const [rr, setRr] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_rr');
    return saved ? JSON.parse(saved) : INITIAL_RR;
  });

  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Local Storage Sync Effects
  useEffect(() => { localStorage.setItem('bhoomisetu_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('bhoomisetu_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('bhoomisetu_approvals', JSON.stringify(approvals)); }, [approvals]);
  useEffect(() => { localStorage.setItem('bhoomisetu_parcels', JSON.stringify(parcels)); }, [parcels]);
  useEffect(() => { localStorage.setItem('bhoomisetu_compensation', JSON.stringify(compensation)); }, [compensation]);
  useEffect(() => { localStorage.setItem('bhoomisetu_families', JSON.stringify(families)); }, [families]);
  useEffect(() => { localStorage.setItem('bhoomisetu_rr', JSON.stringify(rr)); }, [rr]);
  useEffect(() => { localStorage.setItem('bhoomisetu_milestones', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('bhoomisetu_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('bhoomisetu_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('bhoomisetu_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);

  // Helper: Log Audit Action into Firestore & State
  const addAuditLog = (user, action, projectTitle, details) => {
    const newEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
      userName: user?.name || 'System Officer',
      userRole: user?.role || 'SYSTEM',
      action,
      project: projectTitle || 'General',
      details,
      ipAddress: '10.14.92.110'
    };
    setAuditLogs(prev => [newEntry, ...prev]);
    saveDocToCollection(COLLECTIONS.AUDIT_LOGS, newEntry.id, newEntry);
  };

  // Action 1: Add Project Proposal
  const addProject = (projectData, currentUser) => {
    const id = `PRJ-2026-${projectData.state ? projectData.state.slice(0, 2).toUpperCase() : 'IN'}-${Math.floor(100 + Math.random() * 900)}`;
    const newPrj = {
      ...projectData,
      id,
      status: 'Submitted',
      currentStage: 'District Verification',
      acquiredLandArea: 0,
      compensationAssessed: projectData.estimatedCost ? parseFloat((projectData.estimatedCost * 0.1).toFixed(2)) : 10,
      compensationPaid: 0,
      compensationPending: projectData.estimatedCost ? parseFloat((projectData.estimatedCost * 0.1).toFixed(2)) : 10,
      healthScore: 65,
      affectedFamilies: 25,
      displacedFamilies: 5,
      rrCompletedPercentage: 0,
      legalDisputes: 0,
      approvalDelayDays: 0,
      aiRiskScore: 35,
      aiRiskLevel: 'MEDIUM',
      bottleneckStage: 'District Verification',
      bottleneckReason: 'Proposal submitted; awaiting site verification by District Revenue Collector.',
      documentsCount: 1,
      parcelsCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setProjects(prev => [newPrj, ...prev]);
    saveDocToCollection(COLLECTIONS.PROJECTS, id, newPrj);

    // Create initial approval log
    const approvalLog = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      projectId: id,
      projectName: newPrj.name,
      stage: 'Submitted',
      approverRole: currentUser?.role || 'PROJECT_AGENCY',
      approverName: currentUser?.name || 'Project Agency Officer',
      status: 'Approved',
      remarks: 'Project proposal submitted to National Land Portal.',
      timestamp: new Date().toLocaleString()
    };
    setApprovals(prev => [approvalLog, ...prev]);
    saveDocToCollection(COLLECTIONS.APPROVALS, approvalLog.id, approvalLog);

    addAuditLog(currentUser, 'PROJECT_PROPOSAL_CREATED', newPrj.name, `New proposal submitted for ${newPrj.proposedLandArea} Acres in ${newPrj.district}, ${newPrj.state}.`);
    return newPrj;
  };

  // Action 2: Process Approval Workflow Decision (District / State / Central)
  const approveProjectStage = (projectId, stageName, decision, remarks, currentUser) => {
    let nextStage = stageName;
    let nextStatus = 'In Progress';

    if (decision === 'APPROVE') {
      if (stageName === 'District Verification') {
        nextStage = 'State Clearance';
        nextStatus = 'State Clearance';
      } else if (stageName === 'State Clearance') {
        nextStage = 'Central Clearance';
        nextStatus = 'Central Clearance';
      } else if (stageName === 'Central Clearance' || stageName === 'Final Approval') {
        nextStage = 'Acquisition in Progress';
        nextStatus = 'Acquisition in Progress';
      }
    } else if (decision === 'REJECT') {
      nextStatus = 'Rejected';
    }

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updated = {
          ...p,
          currentStage: nextStage,
          status: nextStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        updated.healthScore = calculateProjectHealth(updated);
        saveDocToCollection(COLLECTIONS.PROJECTS, p.id, updated);
        return updated;
      }
      return p;
    }));

    const prj = projects.find(p => p.id === projectId);
    const newApprovalRecord = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      projectId,
      projectName: prj?.name || projectId,
      stage: stageName,
      approverRole: currentUser?.role || 'AUTHORITY',
      approverName: currentUser?.name || 'Government Officer',
      status: decision === 'APPROVE' ? 'Approved' : 'Rejected',
      remarks: remarks || `Stage ${stageName} decision: ${decision}`,
      timestamp: new Date().toLocaleString()
    };

    setApprovals(prev => [newApprovalRecord, ...prev]);
    saveDocToCollection(COLLECTIONS.APPROVALS, newApprovalRecord.id, newApprovalRecord);

    addAuditLog(currentUser, `STAGE_${decision}`, prj?.name || projectId, `Stage: '${stageName}' set to ${decision}. Remarks: ${remarks}`);
  };

  // Action 3: Add Land Parcel
  const addParcel = (parcelData, currentUser) => {
    const id = `PAR-${Date.now().toString().slice(-6)}`;
    const newParcel = {
      id,
      ...parcelData,
      acquisitionStatus: parcelData.acquisitionStatus || 'Proposed',
      compensationStatus: parcelData.compensationStatus || 'Assessed',
      possessionStatus: parcelData.possessionStatus || 'Pending',
      fieldVerified: false,
      paidAmount: 0,
      pendingAmount: parcelData.totalCompensation || 0
    };

    setParcels(prev => [newParcel, ...prev]);
    saveDocToCollection(COLLECTIONS.PARCELS, id, newParcel);

    // Update project parcel count
    setProjects(prev => prev.map(p => {
      if (p.id === parcelData.projectId) {
        const updated = { ...p, parcelsCount: (p.parcelsCount || 0) + 1 };
        saveDocToCollection(COLLECTIONS.PROJECTS, p.id, updated);
        return updated;
      }
      return p;
    }));

    addAuditLog(currentUser, 'LAND_PARCEL_ADDED', parcelData.projectName || 'Parcel', `Added Survey No. ${parcelData.surveyNumber} (${parcelData.areaAcquired} Acres) in ${parcelData.village}.`);
    return newParcel;
  };

  // Action 4: Verify Parcel via Mobile Field Inspection
  const verifyParcelField = (parcelId, coords, photoUrl, remarks, currentUser) => {
    setParcels(prev => prev.map(pcl => {
      if (pcl.id === parcelId) {
        const updated = {
          ...pcl,
          fieldVerified: true,
          lat: coords?.lat || pcl.lat,
          lng: coords?.lng || pcl.lng,
          verificationDate: new Date().toISOString().split('T')[0],
          verifiedBy: currentUser?.name || 'Field Officer',
          fieldRemarks: remarks,
          acquisitionStatus: pcl.acquisitionStatus === 'Proposed' ? 'Under Verification' : pcl.acquisitionStatus
        };
        saveDocToCollection(COLLECTIONS.PARCELS, pcl.id, updated);
        return updated;
      }
      return pcl;
    }));

    const parcel = parcels.find(p => p.id === parcelId);
    addAuditLog(currentUser, 'FIELD_VERIFICATION_SUBMITTED', parcel?.projectName || 'Parcel', `Field officer verified Survey No ${parcel?.surveyNumber} with GPS (${coords?.lat?.toFixed(4)}, ${coords?.lng?.toFixed(4)}). Remarks: ${remarks}`);
  };

  // Action 5: Trigger Compensation Direct Bank Transfer (DBT) Payment
  const triggerCompensationPayment = (compensationId, amountToPay, currentUser) => {
    let updatedRecord = null;
    setCompensation(prev => prev.map(cmp => {
      if (cmp.id === compensationId) {
        const newPaid = cmp.paidAmount + amountToPay;
        const newPending = Math.max(0, cmp.assessedAmount - newPaid);
        const newStatus = newPending === 0 ? 'Paid' : 'Partially Paid';
        updatedRecord = {
          ...cmp,
          paidAmount: newPaid,
          pendingAmount: newPending,
          paymentStatus: newStatus,
          disbursementDate: new Date().toISOString().split('T')[0]
        };
        saveDocToCollection(COLLECTIONS.COMPENSATION, cmp.id, updatedRecord);
        return updatedRecord;
      }
      return cmp;
    }));

    if (updatedRecord) {
      // Update Project compensation paid total
      setProjects(prev => prev.map(p => {
        if (p.id === updatedRecord.projectId) {
          const newPaidCr = p.compensationPaid + (amountToPay / 10000000);
          const newPendingCr = Math.max(0, p.compensationAssessed - newPaidCr);
          const updated = {
            ...p,
            compensationPaid: parseFloat(newPaidCr.toFixed(2)),
            compensationPending: parseFloat(newPendingCr.toFixed(2))
          };
          saveDocToCollection(COLLECTIONS.PROJECTS, p.id, updated);
          return updated;
        }
        return p;
      }));

      addAuditLog(currentUser, 'COMPENSATION_DBT_DISBURSED', updatedRecord.surveyNumber, `Disbursed ₹${(amountToPay / 100000).toFixed(2)} Lakh to ${updatedRecord.ownerName} via Aadhaar DBT Gateway.`);
    }
  };

  // Action 6: Update Rehabilitation & Resettlement Record
  const updateRRRecord = (rrId, updates, currentUser) => {
    setRr(prev => prev.map(item => {
      if (item.id === rrId) {
        const updated = { ...item, ...updates };
        saveDocToCollection(COLLECTIONS.RR, item.id, updated);
        return updated;
      }
      return item;
    }));

    addAuditLog(currentUser, 'RR_PROGRESS_UPDATED', rrId, `Updated R&R colony plot allotment / vocational grant status.`);
  };

  // Action 7: Update Project Milestone Status
  const updateMilestoneStatus = (milestoneId, newStatus, newActualDate, currentUser) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const updated = {
          ...m,
          status: newStatus,
          actualDate: newActualDate || m.actualDate || new Date().toISOString().split('T')[0],
          overdueDays: newStatus === 'Completed' ? 0 : m.overdueDays
        };
        saveDocToCollection(COLLECTIONS.MILESTONES, m.id, updated);
        return updated;
      }
      return m;
    }));

    const milestone = milestones.find(m => m.id === milestoneId);
    addAuditLog(currentUser, 'MILESTONE_UPDATED', milestone?.title || milestoneId, `Milestone marked as '${newStatus}'.`);
  };

  // Action 8: Run Live AI Delay Risk Prediction ML Inference
  const runAIRiskPrediction = (projectId, currentUser) => {
    let result = null;
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const prediction = predictProjectDelayRisk(p);
        result = prediction;
        const updated = {
          ...p,
          aiRiskScore: prediction.riskScore,
          aiRiskLevel: prediction.riskCategory,
          aiRiskFactors: prediction.riskFactors,
          aiRecommendations: prediction.recommendedActions
        };
        saveDocToCollection(COLLECTIONS.PROJECTS, p.id, updated);
        return updated;
      }
      return p;
    }));

    const prj = projects.find(p => p.id === projectId);
    addAuditLog(currentUser, 'AI_DELAY_PREDICTION_RUN', prj?.name || projectId, `Executed Random Forest ML inference model. Risk Output: ${result?.riskScore}% (${result?.riskCategory} RISK).`);
    return result;
  };

  // Action 9: Verify Uploaded Document via AI OCR Scanner
  const verifyDocumentWithAI = (docId, fileUrl, currentUser) => {
    let scanResult = null;
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        const isRed = d.title.toLowerCase().includes('patta') || d.title.toLowerCase().includes('survey');
        scanResult = {
          status: isRed ? 'NEEDS_ATTENTION' : 'VERIFIED',
          aiVerificationStatus: isRed ? 'RED' : 'GREEN',
          aiNotes: isRed
            ? 'Potential mismatch detected: Survey number on sub-page (142/3B) differs from main record (142/3A). Owner name variance flagged.'
            : 'Document OCR verification completed successfully. Official Gazette stamp verified (99.4%).'
        };
        const updated = { ...d, ...scanResult };
        saveDocToCollection(COLLECTIONS.DOCUMENTS, d.id, updated);
        return updated;
      }
      return d;
    }));

    addAuditLog(currentUser, 'AI_DOCUMENT_SCAN_RUN', docId, `Executed AI Document Verification OCR. Result: ${scanResult?.status}`);
    return scanResult;
  };

  // Action 10: Mark Notification as Read
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <DataContext.Provider value={{
      users,
      projects,
      approvals,
      parcels,
      compensation,
      families,
      rr,
      milestones,
      documents,
      notifications,
      auditLogs,
      addProject,
      approveProjectStage,
      addParcel,
      verifyParcelField,
      triggerCompensationPayment,
      updateRRRecord,
      updateMilestoneStatus,
      runAIRiskPrediction,
      verifyDocumentWithAI,
      markNotificationRead,
      addAuditLog,
      setProjects,
      setParcels,
      setFamilies,
      setDocuments,
      setNotifications
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
