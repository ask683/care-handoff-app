import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useData } from "../DataContext";
import { useAuth } from "../AuthContext";
import { units } from "../data/mockData";

const today = () => new Date().toISOString().slice(0, 10);

const emptyEntry = () => ({ nightCondition: "", sleep: "良好", notes: "", dayShiftRequest: "" });

export default function DailyHandoff() {
  const navigate = useNavigate();
  const { users, addHandoffBatch } = useData();
  const { currentStaff } = useAuth();

  const [date, setDate] = useState(today());
  const [shift, setShift] = useState("夜勤");
  const [unitFilter, setUnitFilter] = useState("全員");
  const [entries, setEntries] = useState({});

  const filteredUsers = unitFilter === "全員" ? users : users.filter((u) => u.unit === unitFilter);

  function getEntry(userId) {
    return entries[userId] || emptyEntry();
  }

  function updateEntry(userId, field, value) {
    setEntries((prev) => ({
      ...prev,
      [userId]: { ...getEntry(userId), [field]: value },
    }));
  }

  function isFilled(entry) {
    return Boolean(entry.nightCondition.trim() || entry.notes.trim() || entry.dayShiftRequest.trim());
  }

  const filledCount = users.filter((u) => isFilled(getEntry(u.id))).length;

  function handleSubmit(e) {
    e.preventDefault();
    const records = users
      .filter((u) => isFilled(getEntry(u.id)))
      .map((u) => ({
        userId: u.id,
        date,
        shift,
        author: currentStaff?.role || "不明",
        ...getEntry(u.id),
      }));

    if (records.length === 0) {
      alert("少なくとも1人分は入力してください。");
      return;
    }

    addHandoffBatch(records);
    navigate("/users");
  }

  return (
    <>
      <Header title="今日の申し送り(全員分)" showBack />
      <main className="app-main" style={{ paddingBottom: "6rem" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>日付</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="form-field">
            <label>シフト</label>
            <select value={shift} onChange={(e) => setShift(e.target.value)}>
              <option>夜勤</option>
              <option>日勤</option>
            </select>
          </div>
          <div className="form-field">
            <label>入力者</label>
            <input type="text" value={currentStaff?.role || ""} disabled />
          </div>

          <div className="tabs">
            {["全員", ...units].map((u) => (
              <button
                key={u}
                type="button"
                className={`tab-btn ${unitFilter === u ? "active" : ""}`}
                onClick={() => setUnitFilter(u)}
              >
                {u}
              </button>
            ))}
          </div>

          <p className="note" style={{ marginBottom: "1rem" }}>
            入力した利用者だけが登録されます(現在 {filledCount}人分入力済み)。
          </p>

          {filteredUsers.map((u) => {
            const entry = getEntry(u.id);
            return (
              <div key={u.id} className="info-card" style={{ marginBottom: "1rem" }}>
                <p className="section-title">{u.name}(居室 {u.room})</p>
                <div className="form-field">
                  <label>夜間状況</label>
                  <textarea
                    value={entry.nightCondition}
                    onChange={(e) => updateEntry(u.id, "nightCondition", e.target.value)}
                    placeholder="例: 22時就寝、夜間の様子など"
                  />
                </div>
                <div className="form-field">
                  <label>睡眠状況</label>
                  <select value={entry.sleep} onChange={(e) => updateEntry(u.id, "sleep", e.target.value)}>
                    <option>良好</option>
                    <option>やや浅い</option>
                    <option>不良</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>特記事項</label>
                  <textarea value={entry.notes} onChange={(e) => updateEntry(u.id, "notes", e.target.value)} />
                </div>
                <div className="form-field">
                  <label>日勤への依頼事項</label>
                  <textarea
                    value={entry.dayShiftRequest}
                    onChange={(e) => updateEntry(u.id, "dayShiftRequest", e.target.value)}
                  />
                </div>
              </div>
            );
          })}

          <button type="submit" className="big-btn">
            入力済みの{filledCount}人分をまとめて登録する
          </button>
        </form>
      </main>
    </>
  );
}
