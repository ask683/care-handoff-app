import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useChat } from "../ChatContext";
import { useAuth } from "../AuthContext";
import { faqShortcuts } from "../data/knowledgeBase";

export default function Chat() {
  const { messages, askQuestion } = useChat();
  const { currentStaff, canEdit } = useAuth();
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text) {
    const t = text.trim();
    if (!t) return;
    askQuestion(t, currentStaff?.name);
    setInput("");
    // 送信後にキーボードを閉じる(開いたままだと、他の画面へ移動する際に
    // 1回目のタップがキーボードを閉じるだけになり、移動できないように見えるため)
    inputRef.current?.blur();
  }

  return (
    <>
      <Header title="AIチャット相談" showBack={true} />
      <main className="app-main" style={{ paddingBottom: "8.5rem" }}>
        {canEdit && (
          <Link to="/admin/manuals" className="big-btn small secondary" style={{ marginBottom: "1rem", display: "block", textAlign: "center" }}>
            ⚙ マニュアル・Q&A管理(管理者)
          </Link>
        )}

        <div className="chat-log">
          {messages.map((m) => (
            <div key={m.id} className={`chat-bubble-row ${m.role}`}>
              <div className={`chat-bubble ${m.role}`}>{m.text}</div>
            </div>
          ))}

          {messages.length <= 1 && (
            <div className="faq-grid">
              <p className="note" style={{ marginBottom: "0.6rem" }}>よくある質問:</p>
              {faqShortcuts.map((f) => (
                <button key={f} className="faq-btn" onClick={() => send(f)}>
                  {f}
                </button>
              ))}
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      <div className="chat-input-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="質問を入力してください"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send(input);
          }}
        />
        <button className="big-btn small" style={{ width: "auto", padding: "0.7rem 1.4rem" }} onClick={() => send(input)}>
          送信
        </button>
      </div>
      <BottomNav />
    </>
  );
}
