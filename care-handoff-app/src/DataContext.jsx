import { createContext, useContext, useState } from "react";
import { users as initialUsers, handoffRecords as initialHandoffs, incidentRecords as initialIncidents } from "./data/mockData";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users] = useState(initialUsers);
  const [handoffRecords, setHandoffRecords] = useState(initialHandoffs);
  const [incidentRecords, setIncidentRecords] = useState(initialIncidents);
  // 利用者ごとの計画書(個別支援計画書・サービス等利用計画書)PDF
  // { [userId]: { individualSupportPlan: {fileName, url, uploadedAt}, serviceUsePlan: {...} } }
  const [planDocuments, setPlanDocuments] = useState({});

  function addHandoff(record) {
    setHandoffRecords((prev) => [{ ...record, id: `H${Date.now()}` }, ...prev]);
  }

  // 全利用者分をまとめて登録する(1件ずつ個別ページの履歴にも反映される)
  function addHandoffBatch(records) {
    const base = Date.now();
    const withIds = records.map((record, i) => ({ ...record, id: `H${base}_${i}` }));
    setHandoffRecords((prev) => [...withIds, ...prev]);
  }

  function addIncident(record) {
    setIncidentRecords((prev) => [{ ...record, id: `I${Date.now()}` }, ...prev]);
  }

  // docType: "individualSupportPlan" | "serviceUsePlan"
  function uploadPlanDocument(userId, docType, file) {
    const url = URL.createObjectURL(file);
    setPlanDocuments((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [docType]: {
          fileName: file.name,
          url,
          uploadedAt: new Date().toISOString().slice(0, 10),
        },
      },
    }));
  }

  return (
    <DataContext.Provider
      value={{ users, handoffRecords, incidentRecords, addHandoff, addHandoffBatch, addIncident, planDocuments, uploadPlanDocument }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
