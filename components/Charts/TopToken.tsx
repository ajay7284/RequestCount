"use client";
import { useState, useEffect } from 'react';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { ethers } from 'ethers';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);


const TopToken = ({data}:any) => {
    const [labels, setLabels] = useState<string[]>([]);
    const [tokenSums, setTokenSums] = useState<{ [tokenAddress: string]: number }>({});

    const minABI = [
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [{ "name": "", "type": "string" }],
            "type": "function"
        }
    ];

    async function getTokenSymbol(tokenAddress: string): Promise<string> {
        const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/X7Fr3tEhG4fCxId_urlR46n6cnatYBrl');
        try {
            const contract = new ethers.Contract(tokenAddress, minABI, provider);
            return await contract.symbol();
        } catch (error) {
            console.error('Error fetching token symbol:', error);
            return tokenAddress;
        }
    }
    useEffect(() => {
        async function processPayments() {
            const sums: { [tokenAddress: string]: number } = {};
            const symbolsMap: { [tokenAddress: string]: string } = {};

            for (const payment of data) {
                if (!sums[payment.tokenAddress]) {
                    sums[payment.tokenAddress] = 0;
                    const tokenSymbol = await getTokenSymbol(payment.tokenAddress);
                    if (tokenSymbol !== null) {
                        symbolsMap[payment.tokenAddress] = tokenSymbol;
                    }
                }
                console.log(symbolsMap[payment.tokenAddress] == null)
                if (symbolsMap[payment.tokenAddress] !== null) {
                    sums[payment.tokenAddress] += parseFloat(payment.amount) / 10 ** 18;
                }
            }

            setTokenSums(sums);
            setLabels(Object.values(symbolsMap));
        }

        if (data.length > 0) {
            processPayments();
        }
    }, [data]);

    function generateRandomColors(numColors: number) {
        return Array.from({ length: numColors }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }

    const backgroundColors = generateRandomColors(Object.values(tokenSums).length);
    console.log(Object.values(tokenSums))

    const dataDoughnut = {
        labels: labels,
        datasets: [
            {
                data: Object.values(tokenSums),
                backgroundColor: backgroundColors,
                hoverBackgroundColor: backgroundColors,
            },
        ],
    };


    const optionsDoughnut:any = {
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
                    label: function (context:any) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'eth' }).format(context.parsed);
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
                    </div> 
                     )
}

export default TopToken