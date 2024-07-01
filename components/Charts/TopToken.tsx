"use client";
import { useState, useEffect } from 'react';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);


const TopToken = () => {

    const dataDoughnut = {
        labels: ['USDC', 'DAI', 'ETH', 'USDT', 'SOL',"BTC"],
        datasets: [
            {
                data: [300, 800, 150, 200, 250,180],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    "#808080"
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF', 
                    "#808080"

                ],
            },
        ],
    };

    const optionsDoughnut = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'TOP TOKEN TRANSACTIONS',
                font: {
                    size: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
    };
  return (
<div className="bg-white p-4 rounded-lg   shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-50">
                        <div className="h-96 mx-16">
                            <Doughnut data={dataDoughnut} options={optionsDoughnut} />
                        </div>
                    </div>  )
}

export default TopToken