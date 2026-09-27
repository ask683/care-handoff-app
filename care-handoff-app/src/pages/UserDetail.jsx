import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";

function calcAge(birthday) {
  const b = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
}

const TABS = ["基本情報", "支援情報", "計画書", "申し送り履歴", "ヒヤリハット"];

const PLAN_DOC_LABELS = {
  individualSupportPlan: "個別支援計画書",
  serviceUsePlan: "サービス等利用計画書",
};

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const { users, handoffRecords, incidentRecords, planDocuments, uploadPlanDocument } = useData();
  const [tab, setTab] = useState("基本情報");
  const user = users.find((u) => u.id === userId);
  const docs = planDocuments[userId] || {};

  function handleUpload(docType, e) {
    const file = e.target.files?.[0];
    if (file) uploadPlanDocument(userId, docType, file);
    e.target.value = "";
  }

  const records = useMemo(
    () => handoffRecords.filter((r) => r.userId === userId).sort((a, b) => b.date.localeCompare(a.date)),
    [userId]
  );
  const incidents = useMemo(
    () => incidentRecords.filter((r) => r.userId === userId).sort((a, b) => b.date.localeCompare(a.date)),
    [userId]
  );

  if (!user) {
    return (
      <>
        <Header title="利用者詳細" showBack />
        <main className="app-main">
          <p>利用者が見つかりません。</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title={user.name} showBack />
      <main className="app-main">
        {user.alert && (
          <div className="alert-banner">
            <span>⚠</span>
            <span>{user.alert}</span>
          </div>
        )}

        <div className="detail-header">
          <Avatar user={user} size={72} />
          <div>
            <h2>{user.name}</h2>
            <p className="room">{user.unit} ／ 居室 {user.room} ／ {user.kana}</p>
          </div>
        </div>

        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "基本情報" && (
          <div className="info-card">
            <dl>
              <div className="info-row"><dt>生年月日</dt><dd>{user.birthday}(満{calcAge(user.birthday)}歳)</dd></div>
              <div className="info-row"><dt>性別</dt><dd>{user.gender}</dd></div>
              <div className="info-row"><dt>本人の電話番号</dt><dd>{user.phone}</dd></div>
              <div className="info-row"><dt>本人のメールアドレス</dt><dd>{user.email}</dd></div>
              <div className="info-row"><dt>障害区分</dt><dd>{user.disabilityCategory}</dd></div>
              <div className="info-row"><dt>支援区分</dt><dd>{user.supportLevel}</dd></div>
              <div className="info-row"><dt>入居日</dt><dd>{user.moveInDate}</dd></div>
              <div className="info-row"><dt>受給者証番号</dt><dd>{user.certificateNo}</dd></div>
              <div className="info-row"><dt>支給決定市区町村</dt><dd>{user.municipality}</dd></div>
              <div className="info-row"><dt>通院先</dt><dd>{user.hospitalName}</dd></div>
              <div className="info-row"><dt>日中活動先</dt><dd>{user.dayActivityName}</dd></div>
              <div className="info-row"><dt>日中活動先 連絡先</dt><dd>{user.dayActivityContact}</dd></div>
              <div className="info-row"><dt>通所曜日</dt><dd>{user.dayActivityDays}</dd></div>
              <div className="info-row"><dt>相談支援員</dt><dd>{user.careManager}</dd></div>
              <div className="info-row"><dt>相談支援員のメールアドレス</dt><dd>{user.careManagerEmail}</dd></div>
              <div className="info-row"><dt>訪問看護連絡先</dt><dd>{user.visitingNurseContact}</dd></div>
              <div className="info-row"><dt>緊急連絡先</dt><dd>{user.emergencyContact}</dd></div>
            </dl>
          </div>
        )}

        {tab === "支援情報" && (
          <div className="info-card">
            <dl>
              <div className="info-row"><dt>本人の特徴</dt><dd>{user.characteristics}</dd></div>
              <div className="info-row"><dt>コミュニケーション</dt><dd>{user.communication}</dd></div>
              <div className="info-row"><dt>苦手なこと</dt><dd>{user.dislikes}</dd></div>
              <div className="info-row"><dt>対応時の注意点</dt><dd>{user.careNotes}</dd></div>
              <div className="info-row"><dt>生活リズム</dt><dd>{user.dailyRhythm}</dd></div>
              <div className="info-row"><dt>服薬情報</dt><dd>{user.medication}</dd></div>
              <div className="info-row"><dt>通院情報</dt><dd>{user.hospitalVisit}</dd></div>
            </dl>
          </div>
        )}

        {tab === "計画書" && (
          <div className="info-card">
            {Object.entries(PLAN_DOC_LABELS).map(([docType, label]) => {
              const doc = docs[docType];
              return (
                <div key={docType} style={{ marginBottom: "1.4rem", paddingBottom: "1.2rem", borderBottom: "1px solid var(--border)" }}>
                  <p className="section-title">{label}</p>
                  {doc ? (
                    <>
                      <p style={{ marginBottom: "0.4rem" }}>📄 {doc.fileName}</p>
                      <p className="note" style={{ marginTop: 0, marginBottom: "0.6rem" }}>アップロード日: {doc.uploadedAt}</p>
                      <a href={doc.url} target="_blank" rel="noreferrer" className="big-btn small secondary" style={{ display: "inline-block", width: "auto", padding: "0.6rem 1.2rem" }}>
                        PDFを開く
                      </a>
                    </>
                  ) : (
                    <p className="note" style={{ marginTop: 0 }}>未アップロードです。</p>
                  )}
                  {canEdit && (
                    <label className="big-btn small secondary" style={{ display: "block", marginTop: "0.8rem", cursor: "pointer" }}>
                      {doc ? "差し替える" : "PDFをアップロード"}
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={(e) => handleUpload(docType, e)}
                      />
                    </label>
                  )}
                </div>
              );
            })}
            <p className="note">
              ※ サンプル版のため、アップロードしたPDFはこの端末・このセッション内でのみ表示されます(再読み込みで消えます)。本番ではSupabase Storageに保存し、全職員が閲覧できるようにします。
            </p>
          </div>
        )}

        {tab === "申し送り履歴" && (
          <>
            <button className="big-btn" style={{ marginBottom: "1rem" }} onClick={() => navigate(`/users/${userId}/handoff/new`)}>
              ＋ 今日の申し送りを書く
            </button>
            {records.length === 0 && <p style={{ color: "#888" }}>申し送り記録はまだありません。</p>}
            {records.map((r) => (
              <div key={r.id} className="handoff-card">
                <div className="handoff-date">{r.date} {r.shift}申し送り</div>
                <div className="handoff-meta">入力者: {r.author}</div>
                <div className="handoff-field"><b>夜間状況:</b> {r.nightCondition}</div>
                <div className="handoff-field"><b>睡眠:</b> {r.sleep}</div>
                <div className="handoff-field"><b>特記事項:</b> {r.notes}</div>
                <div className="handoff-field"><b>日勤への依頼:</b> {r.dayShiftRequest}</div>
              </div>
            ))}
          </>
        )}

        {tab === "ヒヤリハット" && (
          <>
            <button className="big-btn" style={{ marginBottom: "1rem" }} onClick={() => navigate(`/users/${userId}/incident/new`)}>
              ＋ ヒヤリハットを記録する
            </button>
            {incidents.length === 0 && <p style={{ color: "#888" }}>記録はありません。</p>}
            {incidents.map((r) => (
              <div key={r.id} className="handoff-card" style={{ borderLeftColor: "#e88a4c" }}>
                <div className="handoff-date">{r.date}</div>
                <div className="handoff-meta">報告者: {r.reporter}</div>
                <div className="handoff-field"><b>内容:</b> {r.detail}</div>
                <div className="handoff-field"><b>対応:</b> {r.action}</div>
              </div>
            ))}
          </>
        )}

        {!canEdit && (
          <p className="note" style={{ marginTop: "1rem", color: "#888", fontSize: "0.8rem" }}>
            ※ 申し送り・ヒヤリハットの記録は全職員が行えます。基本情報・計画書PDFの編集は管理者・サービス管理責任者のみです。
          </p>
        )}
      </main>
      <BottomNav />
    </>
  );
}
