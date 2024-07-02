"use client";
import { useState, useEffect } from 'react';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

const PenCom = () => {
      
    const dataPie2 = {
        labels: ['Completed', 'Panding', ],
        datasets: [
            {
                data: [300, 200],
                backgroundColor: ['#00A36C', '#FF0000'],
                hoverBackgroundColor: ['#00A36C	', '#ff0000'],
            },
        ],
    };

    const optionsPie2 = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context:any) => {
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
    <h2 className="text-2xl font-bold mb-4 text-center">Pending vs Completed</h2>
    <div className="h-96 mx-16">
        <Pie data={dataPie2} options={optionsPie2} />
    </div>
</div>  )
}

export default PenCom