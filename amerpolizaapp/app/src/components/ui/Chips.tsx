export interface ChipDef {
  key: string;
  label: string;
  count: number;
}

interface ChipsProps {
  chips: ChipDef[];
  active: string;
  onChange: (key: string) => void;
}

export default function Chips({ chips, active, onChange }: ChipsProps) {
  return (
    <div className="chips">
      {chips.map((c) => (
        <div
          key={c.key}
          className={`chip${active === c.key ? ' on' : ''}`}
          onClick={() => onChange(c.key)}
        >
          {c.label}
          <span className="chip-ct">{c.count}</span>
        </div>
      ))}
    </div>
  );
}
