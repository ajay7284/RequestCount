import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataItem {
  timestamp: number;
  amount: number;
}

interface TransactionVolumeChartProps {
  data: DataItem[];
}

const TransactionVolumeChart: React.FC<TransactionVolumeChartProps> = ({ data }:any) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const processedData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
    const groupedData: { [key: string]: number[] } = {};

    sortedData.forEach((item) => {
      const date = new Date(item.timestamp * 1000);
      let key: string;

      if (timeframe === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (timeframe === 'weekly') {
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(item.amount / 10**18);
    });

    const labels = Object.keys(groupedData).sort();
    const values = labels.map(label => {
      const sum = groupedData[label].reduce((acc, val) => acc + val, 0);
      return Number(sum.toFixed(2));
    });

    return { labels, values };
  }, [data, timeframe]);
  const chartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Transaction Volume`,
        data: processedData.values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options:any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Transaction Volume Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${value.toFixed(2)+ ' ETH'  }`,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuad',
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-center">Transaction Volume Over Time</h2>
      <div className="flex justify-center mb-4">
        {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
          <button
            key={tf}
            className={`px-4 py-2 mr-2 ${
              timeframe === tf ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setTimeframe(tf)}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TransactionVolumeChart;