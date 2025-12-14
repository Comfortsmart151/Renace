export default function SettingAccentSelector({ value, onChange }) {
  const colors = ["morado", "azul", "rosa"];

  const haptic = () => {
    if (window?.navigator?.vibrate) {
      window.navigator.vibrate(8);
    }
  };

  return (
    <div className="settings-accent-row">
      {colors.map((c) => (
        <button
          key={c}
          className={`settings-accent-dot accent-${c} ${
            value === c ? "settings-accent-dot-active" : ""
          }`}
          onClick={() => {
            onChange(c);
            haptic();
          }}
        />
      ))}
    </div>
  );
}
