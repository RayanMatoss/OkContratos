
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface BarChartProps {
  data: any[];
  xAxisKey: string;
  barKey: string;
  barName: string;
  barColor?: string;
  height?: number;
  className?: string;
}

const BarChartComponent = ({
  data,
  xAxisKey,
  barKey,
  barName,
  barColor = "#3B82F6",
  height = 350,
  className,
}: BarChartProps) => {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey={xAxisKey}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ background: barColor }}
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                          {barName}
                        </span>
                      </div>
                      <div className="text-right text-sm font-medium">
                        {payload[0].value}
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            }}
          />
          <Bar
            dataKey={barKey}
            fill={barColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
