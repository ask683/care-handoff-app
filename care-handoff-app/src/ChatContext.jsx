import { createContext, useContext, useState } from "react";
import { qaEntries as initialQaEntries, manuals as initialManuals } from "./data/knowledgeBase";

const ChatContext = createContext(null);

const FALLBACK_ANSWER =
  "登録されているマニュアル・Q&Aの中からは判断できませんでした。恐れ入りますが、管理者へ確認するか、事業所のルールをご確認ください。\n\n(このチャットは事業所独自のマニュアルに基づいて回答しており、医療的な判断や、登録されていない内容についての推測はいたしません。)";

function matchAnswer(qaEntries, text) {
  const normalized = text.trim();
  if (!normalized) return null;

  let best = null;
  let bestScore = 0;
  for (const entry of qaEntries) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (normalized.includes(kw)) score += kw.length; // 長いキーワード一致ほど高スコア
    }
    if (normalized.includes(entry.question)) score += entry.question.length;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return bestScore > 0 ? best : null;
}

export function ChatProvider({ children }) {
  const [qaEntries, setQaEntries] = useState(initialQaEntries);
  const [manuals, setManuals] = useState(initialManuals);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "ai",
      text: "こんにちは。業務についての疑問があれば、下のボタンを押すか、自由に質問を入力してください。",
      timestamp: new Date().toISOString(),
    },
  ]);
  // 職員からの質問ログ(管理者が「よくある質問」を確認するためのもの)
  const [questionLog, setQuestionLog] = useState([]);

  function askQuestion(text, staffName) {
    const userMsg = { id: `u${Date.now()}`, role: "user", text, timestamp: new Date().toISOString() };
    const matched = matchAnswer(qaEntries, text);
    const aiMsg = {
      id: `a${Date.now()}`,
      role: "ai",
      text: matched ? matched.answer : FALLBACK_ANSWER,
      matchedCategory: matched?.category,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setQuestionLog((prev) => [
      { id: `l${Date.now()}`, text, staffName, matched: Boolean(matched), category: matched?.category, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }

  function addQaEntry(entry) {
    setQaEntries((prev) => [...prev, { ...entry, id: `Q${Date.now()}` }]);
  }

  function updateQaEntry(id, updates) {
    setQaEntries((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  }

  function deleteQaEntry(id) {
    setQaEntries((prev) => prev.filter((q) => q.id !== id));
  }

  function addManual(manual) {
    setManuals((prev) => [...prev, { ...manual, id: `M${Date.now()}` }]);
  }

  function resetChat() {
    setMessages([
      {
        id: "welcome",
        role: "ai",
        text: "こんにちは。業務についての疑問があれば、下のボタンを押すか、自由に質問を入力してください。",
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        askQuestion,
        resetChat,
        qaEntries,
        addQaEntry,
        updateQaEntry,
        deleteQaEntry,
        manuals,
        addManual,
        questionLog,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
