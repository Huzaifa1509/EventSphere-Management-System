import React from 'react'
import { Bar, BarChart } from "recharts"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/Card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart"

const chartData = [
  { visitorName: "Visitors", visitors: 275, fill: "var(--color-visitors)" },
  { visitorName: "Exhibitors", visitors: 200, fill: "var(--color-exhibitors)" },
  { visitorName: "Organizers", visitors: 287, fill: "var(--color-organizers)" },
  { visitorName: "Registered Visitors", visitors: 173, fill: "var(--color-registered)" },
  { visitorName: "Random Visitors", visitors: 190, fill: "var(--color-random)" },

]


const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-1))",
  },
  exhibitors: {
    label: "Exhibitors",
    color: "hsl(var(--chart-2))",
  },
  organizers: {
    label: "Organizers",
    color: "hsl(var(--chart-3))",
  },
  registered: {
    label: "Registered Visitors",
    color: "hsl(var(--chart-4))",
  },
  random: {
    label: "Random Visitors",
    color: "hsl(var(--chart-5))",
  },

} satisfies ChartConfig

const Dashboard = () => {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Event Attendance</CardTitle>
        <CardDescription>November - December 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="visitorName"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default Dashboard
