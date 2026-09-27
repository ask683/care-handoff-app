import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useData } from "../DataContext";

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function History() {
  const { users, handoffRecords } = useData();
  const [keyword, setKeyword] = useState("");

  const results = useMemo(() => {
    const sorted = [...handoffRecords].sort((a, b) => b.date.localeCompare(a.date));
    if (!keyword.trim()) return sorted;
    const k = keyword.trim();
    return sorted.filter((r) => {
      const user = users.find((u) => u.id === r.userId);
      const haystack = [user?.name, r.notes, r.dayShiftRequest, r.physicalCondition, r.author].join(" ");
      return haystack.includes(k);
    });
  }, [keyword, handoffRecords, users]);

  function exportCsv() {
    const header = ["日付", "シフト", "利用者", "入力者", "夜間状況", "睡眠", "体調", "服薬", "排泄", "食事", "特記事項", "日勤への依頼"];
    const rows = [header];
    for (const r of results) {
      const user = users.find((u) => u.id === r.userId);
      rows.push([
        r.date, r.shift, user?.name ?? r.userId, r.author,
        r.nightCondition, r.sleep, r.physicalCondition, r.medicationStatus,
        r.excretion, r.meal, r.notes, r.dayShiftRequest,
      ]);
    }
    const csv = "﻿" + rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "申し送り履歴.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Header title="履歴検索" />
      <main className="app-main">
        <input
          type="search"
          className="search-box"
          placeholder="利用者名・キーワードで検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="big-btn secondary small" style={{ marginBottom: "1rem" }} onClick={exportCsv}>
          📄 検索結果をCSV出力
        </button>
        {results.length === 0 && <p style={{ color: "#888" }}>該当する記録が見つかりません。</p>}
        {results.map((r) => {
          const user = users.find((u) => u.id === r.userId);
          return (
            <Link key={r.id} to={`/users/${r.userId}`} className="handoff-card" style={{ display: "block" }}>
              <div className="handoff-date">{r.date} {r.shift}申し送り ／ {user?.name}</div>
              <div className="handoff-meta">入力者: {r.author}</div>
              <div className="handoff-field">{r.notes || "(特記事項なし)"}</div>
            </Link>
          );
        })}
      </main>
      <BottomNav />
    </>
  );
}
