export default function SettingPill({ children, onClick }) {
  return (
    <button className="setting-pill" onClick={onClick}>
      {children}
    </button>
  );
}
