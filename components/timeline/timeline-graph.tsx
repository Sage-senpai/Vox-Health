'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Mon', severity: 4 },
  { date: 'Tue', severity: 5 },
  { date: 'Wed', severity: 3 },
  { date: 'Thu', severity: 6 },
  { date: 'Fri', severity: 5 },
  { date: 'Sat', severity: 4 },
  { date: 'Sun', severity: 3 },
];

interface TimelineGraphProps {
  timeframe?: '7d' | '30d' | 'all';
}

export function TimelineGraph({ timeframe = '7d' }: TimelineGraphProps) {
  return (
    <div className="w-full h-96 bg-white rounded-lg border border-border p-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            domain={[0, 10]}
            label={{ value: 'Severity', angle: -90, position: 'insideLeft' }}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => [`${value}/10`, 'Severity']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="severity"
            stroke="#0F4C81"
            strokeWidth={2}
            dot={{ fill: '#0F4C81', r: 4 }}
            activeDot={{ r: 6 }}
            name="Symptom Severity"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
