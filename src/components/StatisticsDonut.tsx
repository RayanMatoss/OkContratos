
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface StatisticsDonutProps {
  data: DataItem[];
  className?: string;
  innerRadius?: number;
}

const StatisticsDonut = ({ 
  data, 
  className,
  innerRadius = 60
}: StatisticsDonutProps) => {
  return (
    <div className={cn("h-72 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            background: payload[0].payload.color,
                          }}
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                          {payload[0].name}
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
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center">
            <div
              className="mr-2 h-3 w-3 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsDonut;
