import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const MyPieChart = (props: any) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const { data } = props;

  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <PieChart width={250} height={250}>
      <Pie
        data={data}
        cx={110}
        cy={100}
        innerRadius={0}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={0}
        dataKey="value"
      >
        {data.map((entry: any, index: any) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default MyPieChart;
