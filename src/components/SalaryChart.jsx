import React from 'react';

const SalaryChart = ({ data }) => {
  // Simple grouping by city
  const citySalaries = data.reduce((acc, curr) => {
    const city = curr.city || 'Unknown';
    const salary = parseInt(curr.salary || 0);
    acc[city] = (acc[city] || 0) + salary;
    return acc;
  }, {});

  const chartData = Object.entries(citySalaries).map(([city, total]) => ({ city, total }));
  
  const width = 600;
  const height = 400;
  const padding = 60;
  
  const maxValue = Math.max(...chartData.map(d => d.total), 1);
  const barWidth = (width - padding * 2) / chartData.length - 20;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Salary Distribution by City</h3>
      <div className="flex justify-center">
        <svg width={width} height={height} className="overflow-visible">
          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="2" />

          {/* Bars */}
          {chartData.map((d, i) => {
            const barHeight = (d.total / maxValue) * (height - padding * 2);
            const x = padding + i * (barWidth + 20) + 10;
            const y = height - padding - barHeight;

            return (
              <g key={d.city}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#3b82f6"
                  rx="4"
                  className="transition-all duration-500 hover:fill-blue-700 cursor-pointer"
                />
                <text
                  x={x + barWidth / 2}
                  y={height - padding + 20}
                  textAnchor="middle"
                  fontSize="10"
                  className="fill-gray-500 font-medium"
                >
                  {d.city}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="10"
                  className="fill-blue-600 font-bold"
                >
                  ₹{(d.total / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default SalaryChart;
