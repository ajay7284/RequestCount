import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useConnectWallet } from "@web3-onboard/react";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InExp = () => {
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [spentAmount, setSpentAmount] = useState(0);
  const [{wallet}] = useConnectWallet();
const address = wallet?.accounts[0].address;
  useEffect(() => {
    const fetchData = async () => {
        try {
          const receivedQuery = `
            query MyQuery {
              payments(
                orderBy: timestamp
                orderDirection: desc
                where: {to: "${address}"}
              ) {
                amount
              }
            }
          `;
  
          const spentQuery = `
            query MyQuery {
              payments(
                orderBy: timestamp
                orderDirection: desc
                where: {from: "${address}"}
              ) {
                amount
              }
            }
          `;

        // Replace 'YOUR_GRAPHQL_ENDPOINT' with the actual endpoint
        const [receivedRes, spentRes] = await Promise.all([
          fetch('https://api.goldsky.com/api/public/project_cly1en6bbc3h201ztbbac8uwt/subgraphs/pooltogether/1.0.0/gn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: receivedQuery }),
          }),
          fetch('https://api.goldsky.com/api/public/project_cly1en6bbc3h201ztbbac8uwt/subgraphs/pooltogether/1.0.0/gn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: spentQuery }),
          }),
        ]);

        const receivedData = await receivedRes.json();
        const spentData = await spentRes.json();

        const totalReceived = receivedData.data.payments.reduce((sum:any, payment:any) => sum + parseFloat(payment.amount), 0);
        const totalSpent = spentData.data.payments.reduce((sum:any, payment:any) => sum + parseFloat(payment.amount), 0);

        setReceivedAmount(totalReceived/10**18);
        setSpentAmount(totalSpent/10**18);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ['Received', 'Spent'],
    datasets: [
      {
        label: 'Amount',
        data: [receivedAmount, spentAmount],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options:any= {
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
          callback: function (value:any) {
            return value.toFixed(2) + ' ETH';
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-center">Income vs Expenses</h2>
      <div className="h-80 mx-16">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default InExp;