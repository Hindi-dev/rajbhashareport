import React from 'react';
import { ROLES } from '../../constants/constants';

const STEPS = [
  { role: "DEO", label: "अनुभाग" },
  { role: "AAO", label: "AAO" },
  { role: "SAO", label: "SAO" },
  { role: "HINDI_CELL", label: "हिंदी प्रकोष्ठ" },
];

export const WorkflowPipeline = ({ currentRole }) => {
  const currentIdx = STEPS.findIndex(s => s.role === currentRole);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "10px 0" }}>
      {STEPS.map((s, i) => {
        const active = s.role === currentRole;
        const done = i < currentIdx;
        const r = ROLES[s.role];
        return (
          <div key={s.role} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, border: "2.5px solid",
                background: active ? r.color : done ? "#d1fae5" : "#f1f5f9",
                borderColor: active ? r.color : done ? "#10b981" : "#e2e8f0",
                boxShadow: active ? `0 0 0 4px ${r.color}30` : "none",
              }}>{done ? "✓" : r.icon}</div>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? r.color : done ? "#10b981" : "#94a3b8", textAlign: "center" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ height: 3, flex: 0.4, background: i < currentIdx ? "#10b981" : "#e2e8f0", borderRadius: 2 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};
