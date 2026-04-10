"use client";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export default function Sparkline({ data, color, height = 40 }: SparklineProps) {
  const isPositive = data[data.length - 1] >= data[0];
  const lineColor = color || (isPositive ? "#22C55E" : "#EF4444");
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={lineColor}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length ? (
              <div className="text-xs px-2 py-1 rounded" style={{ background: "#0F1929", border: "1px solid rgba(255,255,255,0.1)", color: lineColor }}>
                {Number(payload[0].value).toFixed(2)}
              </div>
            ) : null
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
