import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { staffMembers } from "../data/mockData";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [staffId, setStaffId] = useState(staffMembers[0].id);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login(staffId);
    navigate("/users");
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>🏠 グループホーム<br />申し送り・利用者管理</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="staff">職員を選択してログイン</label>
            <select id="staff" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
              {staffMembers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}({s.role})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="big-btn">ログイン</button>
        </form>
        <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "1.2rem", textAlign: "center" }}>
          ※ サンプル版のため、職員を選ぶだけでログインできます。本番ではパスワード等による認証を追加します。
        </p>
      </div>
    </div>
  );
}
