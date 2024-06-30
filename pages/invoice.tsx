"use client";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import { Line } from 'react-chartjs-2';
import {
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

import { Doughnut } from 'react-chartjs-2';


const Invoice = () => {

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


    const dataLine = {
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
    };

    const optionsLine = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'User Monthly Spending',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value, index, values) {
                        return '$' + value;
                    },
                },
            },
        },
    };

    const dataDoughnut = {
        labels: ['Food', 'Rent', 'Transportation', 'Entertainment', 'Utilities'],
        datasets: [
            {
                data: [300, 800, 150, 200, 250],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
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
                text: 'Monthly Expenses',
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
        <div className='absolute left-20 justify-between flex-row 		flex-wrap	'>

            <div className='piechart container mx-4 py-8'>
                <div className="w-full max-w-md mx-auto p-4">
                    <h2 className="text-2xl font-bold mb-4 text-center">Currency Distribution</h2>
                    <Pie data={dataPie} options={optionsPie} />
                </div>
            </div>

          
            <div className="container mx-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Monthly Expense Breakdown</h1>
                <div className="w-full max-w-md mx-auto p-4">
                    <Doughnut data={dataDoughnut} options={optionsDoughnut} />
                </div>
            </div>

            <div className='linechart container mx-4 py-8'>
                <h1 className="text-3xl font-bold text-center mb-8">User Spending Analysis</h1>
                <div className="w-full max-w-4xl mx-auto p-4 bg-gray-100">
                    <Line data={dataLine} options={optionsLine} />
                </div>
            </div>

            <div className='linechart container mx-4 py-8'>
                <h1 className="text-3xl font-bold text-center mb-8">User Spending Analysis</h1>
                <div className="w-full max-w-4xl mx-auto p-4 bg-gray-100">
                    <Line data={dataLine} options={optionsLine} />
                </div>
            </div>

            <div className='linechart container mx-4 py-8'>
                <h1 className="text-3xl font-bold text-center mb-8">User Spending Analysis</h1>
                <div className="w-full max-w-4xl mx-auto p-4 bg-gray-100">
                    <Line data={dataLine} options={optionsLine} />
                </div>
            </div>
        </div>
    );
};

export default Invoice;
