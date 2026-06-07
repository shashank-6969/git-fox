import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { GitHubRepo } from '../types/github';
import { motion } from 'framer-motion';

interface LanguageChartProps {
  repos: GitHubRepo[];
}

const COLORS = [
  '#58a6ff', // blue
  '#7ee787', // green
  '#f78166', // red-orange
  '#d2a8ff', // purple
  '#ffa657', // orange
  '#79c0ff', // light blue
  '#56d364', // bright green
  '#ff7b72', // coral
  '#a371f7', // violet
  '#e3b341', // yellow
];

const RADIAN = Math.PI / 180;

function CustomLabel({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: any) {
  if (percent < 0.05) return null; // hide tiny slices
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#c9d1d9"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  const total = p.total as number;
  const pct = ((value / total) * 100).toFixed(1);

  return (
    <div className="bg-[#161b22]/95 backdrop-blur-sm border border-[#30363d] rounded-xl px-4 py-2.5 shadow-xl">
      <p className="text-[#c9d1d9] font-semibold text-sm">{name}</p>
      <p className="text-[#8b949e] text-xs mt-0.5">
        {value} {value === 1 ? 'repo' : 'repos'} · {pct}%
      </p>
    </div>
  );
}

export function LanguageChart({ repos }: LanguageChartProps) {
  // Aggregate language counts
  const langMap: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] ?? 0) + 1;
    }
  }

  const total = Object.values(langMap).reduce((s, v) => s + v, 0);

  if (total === 0) return null;

  const data = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value, total }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-[#161b22]/80 backdrop-blur-md border border-[#30363d]/80 rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-[#c9d1d9] font-bold text-lg mb-5 tracking-tight">
        Language Distribution
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            dataKey="value"
            paddingAngle={3}
            labelLine={false}
            label={CustomLabel}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                stroke="transparent"
                style={{ cursor: 'pointer', filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.4))' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-[#8b949e] text-xs">{value}</span>
            )}
            wrapperStyle={{ paddingTop: '16px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
