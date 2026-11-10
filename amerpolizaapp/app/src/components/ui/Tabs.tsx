export interface TabDef {
  key: string;
  label: string;
  count?: string;
}

interface TabsProps {
  tabs: TabDef[];
  active: string;
  onChange: (key: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <div
          key={t.key}
          className={`tab${active === t.key ? ' on' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
          {t.count != null && <span className="tab-ct">{t.count}</span>}
        </div>
      ))}
    </div>
  );
}
