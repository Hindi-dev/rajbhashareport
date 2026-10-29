import React, { useState } from 'react';

export const Inp = ({ label, value, onChange, type = "text", disabled = false, placeholder = "" }) => (
  <div className="field">
    {label && <label className="field-label">{label}</label>}
    <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} disabled={disabled} placeholder={placeholder} className="input" />
  </div>
);

export const Num = ({ label, value, onChange, disabled = false }) => (
  <div className="field">
    {label && <label className="field-label">{label}</label>}
    <input type="number" min="0" step="1" value={value ?? ""} onChange={e => onChange(e.target.value)} disabled={disabled} className="input input--num" />
  </div>
);

export const Radio = ({ label, value, onChange, options, disabled = false }) => (
  <div className="field">
    {label && <label className="field-label">{label}</label>}
    <div className="segmented">
      {options.map(o => (
        <button type="button" key={o} onClick={() => onChange(o)} disabled={disabled}
          className={`seg${value === o ? " is-active" : ""}`}>{o}</button>
      ))}
    </div>
  </div>
);

export const SecCard = ({ title, icon, children, color, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const border = color?.border || "#e2e8f0";
  const headerBg = color?.bg || "#f8fafc";
  const text = color?.text || "#1e293b";
  return (
    <div className="sec print-box" style={{ borderColor: border }}>
      <div className="sec-head no-print" onClick={() => setOpen(o => !o)} style={{ background: headerBg }}>
        <div className="sec-title" style={{ color: text }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span>{title}</span>
        </div>
        <span className="sec-caret" style={{ color: text, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </div>
      {open && <div className="sec-body">{children}</div>}
    </div>
  );
};

export const Grid = ({ cols = 2, children }) => (
  <div className={cols === 3 ? "grid grid-3" : "grid grid-2"}>{children}</div>
);

export const TblInput = ({ headers, rows, data, onChange }) => (
  <div className="tbl-wrap">
    <table className="tbl-input">
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci}>
                {cell.key ? (
                  <input type={cell.type || "number"} min={0} value={data[cell.key] || ""} onChange={e => onChange(cell.key, e.target.value)} />
                ) : (
                  <span style={{ padding: "5px 8px", display: "block", color: "var(--ink-2)", fontWeight: 650, whiteSpace: "nowrap" }}>{cell.label}</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const LoadingSpinner = ({ label = "लोड हो रहा है..." }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, minHeight: "100vh" }}>
    <div className="spinner"></div>
    <div style={{ color: "var(--ink-3)", fontSize: 13 }}>{label}</div>
  </div>
);
