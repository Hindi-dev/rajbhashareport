import React from 'react';

export const Inp = ({ label, value, onChange, type = "text", disabled = false, placeholder = "" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} placeholder={placeholder}
      style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #cbd5e1", fontSize: 14, background: disabled ? "#f1f5f9" : "#fff", outline: "none", width: "100%", fontFamily: "inherit" }} />
  </div>
);

export const Num = ({ label, value, onChange, disabled = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>{label}</label>}
    <input type="number" min="0" step="1" value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #cbd5e1", fontSize: 14, fontWeight: 600, background: disabled ? "#f1f5f9" : "#fff", outline: "none", width: "100%", fontFamily: "inherit" }} />
  </div>
);

export const Radio = ({ label, value, onChange, options, disabled = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, opacity: disabled ? 0.7 : 1 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>{label}</label>}
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(o => (
        <button key={o} onClick={(e) => { e.preventDefault(); onChange(o); }} disabled={disabled}
          style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", border: "1.5px solid", borderColor: value === o ? "#6366f1" : "#cbd5e1", background: value === o ? "#6366f1" : "#fff", color: value === o ? "#fff" : "#475569" }}>{o}</button>
      ))}
    </div>
  </div>
);

export const SecCard = ({ title, icon, children }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
    <div style={{ background: "#f8fafc", padding: "14px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>{title}</span>
    </div>
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
  </div>
);

export const Grid = ({ cols = 2, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 16 }}>{children}</div>
);

export const TblInput = ({ headers, rows, data, onChange }) => (
  <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 8 }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead style={{ background: "#f8fafc" }}>
        <tr>{headers.map((h, i) => <th key={i} style={{ padding: "10px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", fontWeight: 700, color: "#475569", textAlign: "center", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", padding: 0 }}>
                {cell.key ?
                  <input type={cell.type || "number"} min="0" step="1" value={data[cell.key] || ""} onChange={e => onChange(cell.key, e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "none", outline: "none", textAlign: "center", fontWeight: 600, background: "transparent" }} />
                  : <div style={{ padding: "10px", textAlign: "center", fontWeight: 700, color: "#1e293b", background: "#f8fafc" }}>{cell.label}</div>
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);