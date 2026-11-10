interface StatusBadgeProps {
  label: string;
  cls: string;
}

/** Generic dot+label badge used for Vigente/Por vencer/Vencida, Cliente/Prospecto/Inactivo, etc. */
export default function StatusBadge({ label, cls }: StatusBadgeProps) {
  return (
    <span className={`badge ${cls}`}>
      <span className="b-dot" />
      {label}
    </span>
  );
}
