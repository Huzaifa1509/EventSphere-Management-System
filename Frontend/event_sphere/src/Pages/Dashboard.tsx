import React, { useMemo, useEffect, useState } from 'react'
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
import axios from 'axios'



const Dashboard = () => {

  const [attendeeCount, setAttendeeCount] = useState(0)
  const [exhibitorCount, setExhibitorCount] = useState(0)

  const chartData = [
    { visitorName: "ATTENDEES", visitors: attendeeCount, fill: "var(--color-attendees)" },
    { visitorName: "EXHIBITORS", visitors: exhibitorCount, fill: "var(--color-exhibitors)" },


  ]


  const chartConfig = {
    attendees: {
      label: "Attendees",
      color: "hsl(var(--chart-1))",
    },
    exhibitors: {
      label: "Exhibitors",
      color: "hsl(var(--chart-2))",
    },

  } satisfies ChartConfig

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  useEffect(() => {
    ; (async () => {
      try {
        const response = await axios.get('/api/user_count')
        console.log(response.data)
        console.log(response.data.userCount.ATTENDEES)
        setAttendeeCount(response.data.userCount.ATTENDEES)
        setExhibitorCount(response.data.userCount.EXHIBITORS)
      } catch (error) {
        console.error('Error fetching visitors:', error)
      }
    })()
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">

        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>These are the total users who are registered in the site.</CardDescription>
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

      </div>
    </>
  )
}

export default Dashboard
