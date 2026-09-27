import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useData } from "../DataContext";
import { useAuth } from "../AuthContext";

const today = () => new Date().toISOString().slice(0, 10);

export default function IncidentForm() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, addIncident } = useData();
  const { currentStaff } = useAuth();
  const user = users.find((u) => u.id === userId);

  const [form, setForm] = useState({ date: today(), detail: "", action: "" });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addIncident({ ...form, userId, reporter: currentStaff?.name || "不明" });
    navigate(`/users/${userId}`);
  }

  if (!user) return null;

  return (
    <>
      <Header title={`ヒヤリハット記録(${user.name})`} showBack />
      <main className="app-main">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>発生日</label>
            <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required />
          </div>
          <div className="form-field">
            <label>内容</label>
            <textarea value={form.detail} onChange={(e) => update("detail", e.target.value)} placeholder="何が起きたか具体的に記載してください" required />
          </div>
          <div className="form-field">
            <label>対応・再発防止策</label>
            <textarea value={form.action} onChange={(e) => update("action", e.target.value)} />
          </div>
          <button type="submit" className="big-btn">登録する</button>
        </form>
      </main>
    </>
  );
}
