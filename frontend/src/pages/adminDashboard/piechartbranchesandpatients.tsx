
import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie.d.ts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { getPatientsCountPerBranch } from "@/services/patientServices";

type BranchCount = {
    branch_name: string;
    patient_count: number;
    fill?: string;
};

export function BranchPatientsPieChart() {
    const id = "branch-patients-pie";
    const [branchData, setBranchData] = React.useState<BranchCount[]>([]);
    const [activeBranch, setActiveBranch] = React.useState<string | null>(null);

    React.useEffect(() => {
        (async () => {
            try {
                const counts = await getPatientsCountPerBranch(); 
                const colors = [
                    "#003A6B", // Ateneo Blue
                    "#1B5886", // Blue Sapphire
                    "#3776A1", // Queen Blue
                    "#5293BB", // Silver Lake Blue
                    "#6EB1D6", // Iceberg
                    "#89CFF1", // Baby Blue
                    "#A3D2F4", // Light Sky Blue
                    "#BEE1F4", // Pale Blue
                     
                ]


                const filled = counts.map((item, i) => ({
                    ...item,
                    fill: colors[i % colors.length],
                }));


                setBranchData(filled);
                setActiveBranch(filled[0]?.branch_name ?? null);
            } catch (error) {
                console.error("Error fetching patient counts per branch:", error);
            }
        })();
    }, []);

    const activeIndexRaw = React.useMemo(
        () => branchData.findIndex((item) => item.branch_name === activeBranch),
        [activeBranch, branchData]
    );
    const activeIndex = activeIndexRaw >= 0 ? activeIndexRaw : 0; 
    const chartConfig: ChartConfig = React.useMemo(
        () =>
            branchData.reduce(
                (acc, item) => ({
                    ...acc,
                    [item.branch_name]: {
                        label: item.branch_name,
                        color: item.fill,
                    },
                }),
                {}
            ),
        [branchData]
    );

    if (!branchData.length) {
        return (
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Patients by Branch</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card data-chart={id} className="flex flex-col">
            <ChartStyle id={id} config={chartConfig} />

            <CardHeader className="flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                    <CardTitle>Patients by Branch</CardTitle>
                    <CardDescription>Distribution across branches</CardDescription>
                </div>

                <Select value={activeBranch ?? ""} onValueChange={setActiveBranch}>
                    <SelectTrigger className="ml-auto h-7 w-[180px] rounded-lg pl-2.5" aria-label="Select branch">
                        <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        {branchData.map((item) => (
                            <SelectItem key={item.branch_name} value={item.branch_name} className="rounded-lg">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="flex h-3 w-3 shrink-0 rounded-xs" style={{ backgroundColor: item.fill }} />
                                    {item.branch_name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="flex flex-1 justify-center pb-0">
                <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[320px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={branchData}
                            dataKey="patient_count"  
                            nameKey="branch_name"  
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={activeIndex}
                            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                                <g>
                                    <Sector {...props} outerRadius={outerRadius + 10} />
                                    <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                                </g>
                            )}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {branchData[activeIndex]?.patient_count ?? 0}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
                                                    Patients
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}