import { createContext, useContext, useState } from "react";
import { staffMembers } from "./data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentStaff, setCurrentStaff] = useState(() => {
    const saved = localStorage.getItem("currentStaffId");
    return staffMembers.find((s) => s.id === saved) || null;
  });

  function login(staffId) {
    const staff = staffMembers.find((s) => s.id === staffId);
    setCurrentStaff(staff);
    localStorage.setItem("currentStaffId", staffId);
  }

  function logout() {
    setCurrentStaff(null);
    localStorage.removeItem("currentStaffId");
  }

  // 管理者・サービス管理責任者は全利用者の閲覧・編集が可能。
  // 一般職員(夜勤/日勤)は今回のサンプルでは閲覧のみ(将来的に担当利用者の絞り込みをRLSで実装予定)
  const canEdit = currentStaff?.role === "管理者" || currentStaff?.role === "サービス管理責任者";

  return (
    <AuthContext.Provider value={{ currentStaff, login, logout, canEdit }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
