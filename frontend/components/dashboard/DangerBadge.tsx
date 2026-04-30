interface DangerBadgeProps {
  score: number;
  size?: number;
}

export function DangerBadge({ score, size = 40 }: DangerBadgeProps) {
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;
  const fill = Math.min(score / 100, 1) * circ;
  const color = score >= 60 ? "#ef4444" : score >= 30 ? "#f59e0b" : "#10b981";
  const cx = size / 2;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke="currentColor" strokeWidth="3"
        className="text-border/40"
      />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
      />
      <text
        x={cx} y={cx}
        textAnchor="middle" dominantBaseline="central"
        fontSize={size < 36 ? 8 : 10}
        fontFamily="monospace"
        fill={color}
        transform={`rotate(90, ${cx}, ${cx})`}
      >
        {Math.round(score)}
      </text>
    </svg>
  );
}
