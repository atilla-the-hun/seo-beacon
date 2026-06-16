import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Slice {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  slices,
  size = 120,
  innerRadius = size * 0.27,
  outerRadius = size * 0.45,
}: {
  slices: Slice[];
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
}) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  const data = slices.map((s) => ({ name: s.label, value: s.value }));

  if (total === 0) {
    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div
          className="rounded-full border-2 border-dashed border-glass-border"
          style={{ width: outerRadius * 2, height: outerRadius * 2 }}
        />
        <span className="absolute text-[10px] text-muted-foreground">0</span>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {slices.map((sl, i) => (
              <Cell key={i} fill={sl.color} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-foreground">{total}</span>
      </div>
    </div>
  );
}

export function DonutLegend({ slices }: { slices: Slice[] }) {
  return (
    <div className="space-y-1">
      {slices.map((sl, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ background: sl.color }}
          />
          <span className="text-muted-foreground">{sl.label}</span>
          <span className="ml-auto font-medium text-foreground">{sl.value}</span>
        </div>
      ))}
    </div>
  );
}
