import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { DataProvider } from "./DataContext";
import { ChatProvider } from "./ChatContext";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import UserDetail from "./pages/UserDetail";
import HandoffForm from "./pages/HandoffForm";
import DailyHandoff from "./pages/DailyHandoff";
import IncidentForm from "./pages/IncidentForm";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import ManualAdmin from "./pages/ManualAdmin";

function RequireAuth({ children }) {
  const { currentStaff } = useAuth();
  if (!currentStaff) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes({ fontScale, setFontScale }) {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<RequireAuth><UserList /></RequireAuth>} />
      <Route path="/users/:userId" element={<RequireAuth><UserDetail /></RequireAuth>} />
      <Route path="/users/:userId/handoff/new" element={<RequireAuth><HandoffForm /></RequireAuth>} />
      <Route path="/handoff/daily" element={<RequireAuth><DailyHandoff /></RequireAuth>} />
      <Route path="/users/:userId/incident/new" element={<RequireAuth><IncidentForm /></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
      <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
      <Route path="/admin/manuals" element={<RequireAuth><ManualAdmin /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><Settings fontScale={fontScale} setFontScale={setFontScale} /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
}

export default function App() {
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", fontScale);
  }, [fontScale]);

  return (
    <AuthProvider>
      <DataProvider>
        <ChatProvider>
          <AppRoutes fontScale={fontScale} setFontScale={setFontScale} />
        </ChatProvider>
      </DataProvider>
    </AuthProvider>
  );
}
