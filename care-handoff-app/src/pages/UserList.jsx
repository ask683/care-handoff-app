import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useData } from "../DataContext";
import { units } from "../data/mockData";

export default function UserList() {
  const { users } = useData();
  const [keyword, setKeyword] = useState("");
  const [unitFilter, setUnitFilter] = useState("全員");

  const filtered = useMemo(() => {
    let list = users;
    if (unitFilter !== "全員") list = list.filter((u) => u.unit === unitFilter);
    if (keyword.trim()) {
      const k = keyword.trim();
      list = list.filter(
        (u) => u.name.includes(k) || u.kana.includes(k) || u.room.includes(k)
      );
    }
    return list;
  }, [keyword, unitFilter, users]);

  return (
    <>
      <Header title="利用者一覧" />
      <main className="app-main">
        <div className="tabs">
          {["全員", ...units].map((u) => (
            <button
              key={u}
              className={`tab-btn ${unitFilter === u ? "active" : ""}`}
              onClick={() => setUnitFilter(u)}
            >
              {u}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="search-box"
          placeholder="名前・部屋番号で検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {filtered.map((u) => (
          <Link key={u.id} to={`/users/${u.id}`} className="user-card">
            <Avatar user={u} />
            <div className="user-card-info">
              <p className="user-card-name">{u.name}</p>
              <p className="user-card-room">{u.unit} ／ 居室 {u.room}</p>
              {u.alert && <span className="user-card-alert">⚠ {u.alert}</span>}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <p style={{ textAlign: "center", color: "#888" }}>該当する利用者が見つかりません。</p>}
      </main>
      <BottomNav />
    </>
  );
}
