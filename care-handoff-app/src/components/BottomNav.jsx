import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/users" className={({ isActive }) => (isActive ? "active" : "")}>
        <span className="icon">🏠</span>
        利用者一覧
      </NavLink>
      <NavLink to="/chat" className={({ isActive }) => (isActive ? "active" : "")}>
        <span className="icon">💬</span>
        AIチャット
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>
        <span className="icon">📖</span>
        履歴検索
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
        <span className="icon">⚙️</span>
        設定
      </NavLink>
    </nav>
  );
}
