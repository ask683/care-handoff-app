import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../AuthContext";

export default function Settings({ fontScale, setFontScale }) {
  const { currentStaff, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <Header title="設定" />
      <main className="app-main">
        <div className="info-card">
          <p className="section-title">ログイン中の職員</p>
          <p>{currentStaff?.name}({currentStaff?.role})</p>
        </div>

        <div className="info-card">
          <p className="section-title">文字サイズ</p>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button className="big-btn small secondary" onClick={() => setFontScale(1)}>標準</button>
            <button className="big-btn small secondary" onClick={() => setFontScale(1.2)}>大きめ</button>
            <button className="big-btn small secondary" onClick={() => setFontScale(1.4)}>最大</button>
          </div>
        </div>

        <div className="info-card">
          <p className="section-title">データ</p>
          <p style={{ fontSize: "0.85rem", color: "#888" }}>
            バックアップ・LINE WORKS連携設定は準備中です。
          </p>
        </div>

        <button className="big-btn" style={{ background: "#c94b4b" }} onClick={handleLogout}>
          ログアウト
        </button>
      </main>
      <BottomNav />
    </>
  );
}
