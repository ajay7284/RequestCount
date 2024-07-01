"use client";
import { useState, useEffect } from 'react';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);



function TokenHolding() {

    const dataPie = {
        labels: ['USD', 'EUR', 'GBP', 'JPY'],
        datasets: [
            {
                data: [300, 200, 150, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const optionsPie = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: $${value}`;
                    },
                },
            },
        },
    };

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-50">
    <h2 className="text-2xl font-bold mb-4 text-center">Token Holding Distribution</h2>
    <div className="h-96 mx-16">
        <Pie data={dataPie} options={optionsPie} />
    </div>
</div>  )
}

export default TokenHolding
