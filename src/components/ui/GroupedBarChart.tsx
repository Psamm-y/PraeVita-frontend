"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "./chart";

export type GroupedBarDatum = {
  region: string;
  typhoid: number;
  cholera: number;
};

export function GroupedBarChart({
  data,
  height = 320,
  className,
}: {
  data: GroupedBarDatum[];
  height?: number | string;
  className?: string;
}) {
  // Chart config used by ChartContainer to set legend labels and colors
  const config = React.useMemo(() => ({
    typhoid: { label: "Typhoid", color: "#10B981" },
    cholera: { label: "Cholera", color: "#06B6D4" },
  }), []);

  return (
    <ChartContainer config={config} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.6} />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip content={(props) => <ChartTooltipContent {...(props as any)} />} />
          <Legend content={(props) => <ChartLegendContent {...(props as any)} />} />
          <Bar dataKey="typhoid" fill="var(--color-typhoid, #10B981)" barSize={18} radius={[4,4,0,0]} />
          <Bar dataKey="cholera" fill="var(--color-cholera, #06B6D4)" barSize={18} radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default GroupedBarChart;
