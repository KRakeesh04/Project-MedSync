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

import { fetchMonthlyRevenueForYear } from "@/services/adminDashboardServices";

type ChartRow = {
  date: string; 
  revenue: number;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function MonthlyRevenueChart({ year = new Date().getFullYear() }: { year?: number }) {
  const [data, setData] = React.useState<ChartRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const rows = await fetchMonthlyRevenueForYear(year);
        const mapped: ChartRow[] = rows.map((r) => ({
          date: `${r.month}-01`,
          revenue: Number(r.revenue ?? 0),
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
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>{year}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", { month: "short" })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                  }
                //   valueFormatter={(val) =>
                //     new Intl.NumberFormat("en-US", {
                //       style: "currency",
                //       currency: "LKR", // adjust if needed
                //       minimumFractionDigits: 2,
                //     }).format(Number(val))
                //   }
                />
              }
            />

            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>

        {loading && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
      </CardContent>
    </Card>
  );
}
