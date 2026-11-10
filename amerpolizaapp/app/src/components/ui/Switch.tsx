interface SwitchProps {
  on: boolean;
  onToggle: () => void;
  small?: boolean;
}

/** Toggle matching the prototype's `.switch` styles (with `.notif-row .switch` variant for the smaller size). */
export default function Switch({ on, onToggle, small }: SwitchProps) {
  return (
    <div
      className={`switch${on ? '' : ' off'}`}
      style={small ? { width: 34, height: 20 } : undefined}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <i style={small ? { width: 16, height: 16, top: 2, left: on ? 16 : 2 } : undefined} />
    </div>
  );
}
