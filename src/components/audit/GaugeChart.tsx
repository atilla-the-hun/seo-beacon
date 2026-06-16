import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function GaugeChart({
  value,
  max = 100,
  color,
  label,
  size = 120,
}: {
  value: number;
  max?: number;
  color: string;
  label?: string;
  size?: number;
}) {
  const pct = Math.min(value / max, 1);
  const data = [
    { name: "filled", value: pct * 100 },
    { name: "empty", value: (1 - pct) * 100 },
  ];

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: size, height: size * 0.55 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.3}
              outerRadius={size * 0.48}
              dataKey="value"
              animationBegin={200}
              animationDuration={1000}
              animationEasing="ease-out"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="var(--glass-border)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="-mt-1 text-center">
        <span className="text-lg font-semibold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">/{max}</span>
        {label && <div className="text-[10px] text-muted-foreground">{label}</div>}
      </div>
    </div>
  );
}
