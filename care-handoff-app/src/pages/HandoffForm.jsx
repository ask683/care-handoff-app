import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useData } from "../DataContext";
import { useAuth } from "../AuthContext";

const today = () => new Date().toISOString().slice(0, 10);

export default function HandoffForm() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, addHandoff } = useData();
  const { currentStaff } = useAuth();
  const user = users.find((u) => u.id === userId);

  const [form, setForm] = useState({
    date: today(),
    shift: "夜勤",
    nightCondition: "",
    sleep: "良好",
    physicalCondition: "",
    medicationStatus: "",
    excretion: "",
    meal: "",
    notes: "",
    dayShiftRequest: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addHandoff({ ...form, userId, author: currentStaff?.role || "不明" });
    navigate(`/users/${userId}`);
  }

  if (!user) return null;

  return (
    <>
      <Header title={`申し送り入力(${user.name})`} showBack />
      <main className="app-main">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>日付</label>
            <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required />
          </div>
          <div className="form-field">
            <label>シフト</label>
            <select value={form.shift} onChange={(e) => update("shift", e.target.value)}>
              <option>夜勤</option>
              <option>日勤</option>
            </select>
          </div>
          <div className="form-field">
            <label>入力者</label>
            <input type="text" value={currentStaff?.role || ""} disabled />
          </div>
          <div className="form-field">
            <label>夜間状況</label>
            <textarea value={form.nightCondition} onChange={(e) => update("nightCondition", e.target.value)} placeholder="例: 22時就寝、夜間の様子など" />
          </div>
          <div className="form-field">
            <label>睡眠状況</label>
            <select value={form.sleep} onChange={(e) => update("sleep", e.target.value)}>
              <option>良好</option>
              <option>やや浅い</option>
              <option>不良</option>
            </select>
          </div>
          <div className="form-field">
            <label>体調</label>
            <textarea value={form.physicalCondition} onChange={(e) => update("physicalCondition", e.target.value)} placeholder="体温、顔色、その他気になる様子" />
          </div>
          <div className="form-field">
            <label>服薬状況</label>
            <input type="text" value={form.medicationStatus} onChange={(e) => update("medicationStatus", e.target.value)} placeholder="例: 服薬確認済み" />
          </div>
          <div className="form-field">
            <label>排泄状況</label>
            <input type="text" value={form.excretion} onChange={(e) => update("excretion", e.target.value)} placeholder="例: 普通便1回" />
          </div>
          <div className="form-field">
            <label>食事状況</label>
            <input type="text" value={form.meal} onChange={(e) => update("meal", e.target.value)} placeholder="例: 夕食完食" />
          </div>
          <div className="form-field">
            <label>特記事項</label>
            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </div>
          <div className="form-field">
            <label>日勤への依頼事項</label>
            <textarea value={form.dayShiftRequest} onChange={(e) => update("dayShiftRequest", e.target.value)} />
          </div>
          <button type="submit" className="big-btn">登録する</button>
        </form>
      </main>
    </>
  );
}
