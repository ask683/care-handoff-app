import { useState } from "react";
import Header from "../components/Header";
import { useChat } from "../ChatContext";

const TABS = ["Q&A一覧", "マニュアル一覧", "よくある質問ログ", "新規Q&A登録"];

export default function ManualAdmin() {
  const { qaEntries, updateQaEntry, deleteQaEntry, addQaEntry, manuals, questionLog } = useChat();
  const [tab, setTab] = useState("Q&A一覧");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [form, setForm] = useState({ category: "業務マニュアル", question: "", keywords: "", answer: "" });

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditText(entry.answer);
  }

  function saveEdit(id) {
    updateQaEntry(id, { answer: editText });
    setEditingId(null);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    addQaEntry({
      category: form.category,
      question: form.question,
      keywords: form.keywords.split(/[,、\s]+/).filter(Boolean),
      answer: form.answer,
    });
    setForm({ category: "業務マニュアル", question: "", keywords: "", answer: "" });
    setTab("Q&A一覧");
  }

  return (
    <>
      <Header title="マニュアル・Q&A管理" showBack />
      <main className="app-main">
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Q&A一覧" && (
          <>
            {qaEntries.map((qa) => (
              <div key={qa.id} className="info-card">
                <p className="section-title">{qa.question} <span className="note">({qa.category})</span></p>
                {editingId === qa.id ? (
                  <>
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} style={{ width: "100%", minHeight: "100px", borderRadius: 10, border: "2px solid var(--border)", padding: "0.6rem" }} />
                    <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.6rem" }}>
                      <button className="big-btn small" onClick={() => saveEdit(qa.id)}>保存</button>
                      <button className="big-btn small secondary" onClick={() => setEditingId(null)}>キャンセル</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ whiteSpace: "pre-wrap" }}>{qa.answer}</p>
                    <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.6rem" }}>
                      <button className="big-btn small secondary" onClick={() => startEdit(qa)}>回答を編集</button>
                      <button className="big-btn small" style={{ background: "#c94b4b" }} onClick={() => deleteQaEntry(qa.id)}>削除</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}

        {tab === "マニュアル一覧" && (
          <>
            {manuals.map((m) => (
              <div key={m.id} className="info-card">
                <p className="section-title">{m.title} <span className="note">({m.category})</span></p>
                <p>{m.content}</p>
              </div>
            ))}
            <p className="note">※ サンプル版のため概要のみ表示しています。本番ではPDF等のファイルをアップロードして保存する形にできます。</p>
          </>
        )}

        {tab === "よくある質問ログ" && (
          <>
            {questionLog.length === 0 && <p className="note">まだ質問はありません。</p>}
            {questionLog.map((l) => (
              <div key={l.id} className="handoff-card" style={{ borderLeftColor: l.matched ? "var(--primary)" : "#e88a4c" }}>
                <div className="handoff-meta">{l.timestamp.slice(0, 16).replace("T", " ")} ／ {l.staffName || "不明"}</div>
                <div className="handoff-field">{l.text}</div>
                <div className="note" style={{ marginTop: "0.3rem" }}>
                  {l.matched ? `回答あり(${l.category})` : "⚠ 回答できず(未登録の質問)"}
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "新規Q&A登録" && (
          <form onSubmit={handleAdd}>
            <div className="form-field">
              <label>カテゴリ</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {["業務マニュアル", "新人研修資料", "支援手順書", "服薬対応ルール", "緊急時対応マニュアル", "虐待防止マニュアル", "感染症対応", "事故対応手順", "夜勤業務手順", "記録作成ルール"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>質問(FAQボタンや検索の見出しになります)</label>
              <input type="text" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} required />
            </div>
            <div className="form-field">
              <label>キーワード(スペース区切りで複数可)</label>
              <input type="text" value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} placeholder="例: 嘔吐 気分不良" />
            </div>
            <div className="form-field">
              <label>回答内容</label>
              <textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} required />
            </div>
            <button type="submit" className="big-btn">登録する</button>
          </form>
        )}
      </main>
    </>
  );
}
