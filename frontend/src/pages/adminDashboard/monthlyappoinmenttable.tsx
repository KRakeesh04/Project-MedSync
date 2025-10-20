import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { fetchMonthlyAppointmentsForYear } from "@/services/adminDashboardServices";

type ChartRow = {
  date: string;       
  appointments: number;
};

const chartConfig = {
  appointments: {
    label: "Appointments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function MonthlyAppointmentsChart({ year = new Date().getFullYear() }: { year?: number }) {
  const [data, setData] = React.useState<ChartRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const rows = await fetchMonthlyAppointmentsForYear(year);
        const mapped: ChartRow[] = rows.map((r) => ({
          date: `${r.month}-01`,
          appointments: r.count,
        }));
        setData(mapped);
      } finally {
        setLoading(false);
      }
    })();
  }, [year]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Monthly Appointments</CardTitle>
          <CardDescription>{year}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-appointments)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-appointments)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) => {
                const d = new Date(value);
                return d.toLocaleDateString("en-US", { month: "short" });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "long" })
                  }
                />
              }
            />

            <Area
              dataKey="appointments"
              type="natural"
              fill="url(#fillAppointments)"
              stroke="var(--color-appointments)"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>

        {loading && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
      </CardContent>
    </Card>
  );
}
