"use client";
import { useState, useEffect,useMemo } from 'react';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { useConnectWallet } from "@web3-onboard/react";
import { Client, cacheExchange, fetchExchange } from 'urql';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

interface Payment {
    amount: string;
    to: string;
    tokenAddress: string;
}


function TransactionFees({data}:any) {
    // console.log("data",data)
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
        groupedData[key].push(item.gasUsed / 10**9);
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
            callback: (value: number) => `${value.toFixed(2)} Gwei`,
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
    <h2 className="text-2xl font-bold mb-4 text-center">Transaction Fees Analysis</h2>
    <div className="flex justify-center mb-4">
        <button className={`px-4 py-2 mr-2 ${timeframe === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setTimeframe('daily')}>Daily</button>
        <button className={`px-4 py-2 mr-2 ${timeframe === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setTimeframe('weekly')}>Weekly</button>
        <button className={`px-4 py-2 ${timeframe === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setTimeframe('monthly')}>Monthly</button>
    </div>
    <div className="h-80">
        <Line data={chartData} options={options} />
    </div>
</div>
  )
}

export default TransactionFees