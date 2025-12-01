// src/components/PageShell.jsx
import React from "react";

export function PageShell({
  title,
  subtitle,
  currentTab,
  onChangeTab,
  children,
}) {
  const hideHeader = currentTab === "home" || currentTab === "create";

  return (
    <div className="page-shell" data-tab={currentTab}>
      {!hideHeader && (
        <header className="page-header glass">
          <div className="page-header-text">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="page-header-orb" />
        </header>
      )}

      {/* 👉 Aquí el cambio importante */}
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}
