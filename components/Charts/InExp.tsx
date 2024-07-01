
"use client";
import { useState, useEffect } from 'react';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);



function InExp() {
    
    const dataBar = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Income',
                data: [1000, 1200, 1100, 1400],
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Expenses',
                data: [500, 600, 550, 700],
                backgroundColor: '#FF6384',
            },
        ],
    };

    const optionsBar = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Income vs Expenses',
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
    };
  return (
    <div className="bg-white p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-50">
                        <h2 className="text-2xl font-bold mb-4 text-center">Income vs Expenses</h2>
                        <div className="h-80 mx-16">
                            <Bar data={dataBar} options={optionsBar} />
                        </div>
                    </div>
  )
}

export default InExp
