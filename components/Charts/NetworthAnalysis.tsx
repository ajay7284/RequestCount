"use client";
import { useState, useEffect } from 'react';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);




function NetworthAnalysis() {
    const [timeframe, setTimeframe] = useState('monthly');


    const dataLine = {
        daily: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Daily Spending',
                    data: [50, 60, 55, 70, 65, 80, 75],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
            ],
        },
        weekly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Weekly Spending',
                    data: [500, 600, 550, 700],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
            ],
        },
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Monthly Spending',
                    data: [500, 600, 550, 700, 650, 800, 750, 850, 900, 950, 1000, 1100],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
            ],
        },
    };

    const optionsLine = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'User Spending Analysis',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '$' + value;
                    },
                },
            },
        },
        animation: {
            duration: 2000, // animation duration in milliseconds
            easing: 'easeOutQuad', // animation easing function
        },
    };



  return (
<div className="bg-white p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-50">
                        <h2 className="text-2xl font-bold mb-4 text-center">Networth Over Time</h2>
                        <div className="flex justify-center mb-4">
                            <button className={`px-4 py-2 mr-2 ${timeframe === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setTimeframe('daily')}>Daily</button>
                            <button className={`px-4 py-2 mr-2 ${timeframe === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setTimeframe('weekly')}>Weekly</button>
                            <button className={`px-4 py-2 ${timeframe === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setTimeframe('monthly')}>Monthly</button>
                        </div>
                        <div className="h-80">
                            <Line data={dataLine[timeframe]} options={optionsLine} />
                        </div>
                    </div>
  )
}

export default NetworthAnalysis