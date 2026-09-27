import { useNavigate } from "react-router-dom";

export default function Header({ title, showBack, onBack }) {
  const navigate = useNavigate();
  const handleBack = onBack ? () => onBack() : () => navigate(-1);
  return (
    <header className="app-header">
      {showBack && (
        <button className="back-btn" onClick={handleBack} aria-label="戻る">
          ←
        </button>
      )}
      <h1>{title}</h1>
    </header>
  );
}
