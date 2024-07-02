import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Client, cacheExchange, fetchExchange } from 'urql';
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from 'ethers';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Payment {
    amount: string;
    to: string;
    tokenAddress: string;
}

function TokenHolding() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [{ wallet }] = useConnectWallet();
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

    const client = new Client({
        url: 'https://api.goldsky.com/api/public/project_cly1en6bbc3h201ztbbac8uwt/subgraphs/pooltogether/1.0.0/gn',
        exchanges: [cacheExchange, fetchExchange],
    });

    const QUERY = `
    query FetchPayments($first: Int!, $skip: Int!, $fromAddress: String) {
      payments(
        where: { from: $fromAddress }
        orderBy: timestamp
        orderDirection: desc
        first: $first
        skip: $skip
      ) {
        amount
        to
        tokenAddress
      }
    }
    `;

    const fetchAllData = async (address: string) => {
        setIsLoading(true);
        setError(null);
        const allPayments: Payment[] = [];
        const pageSize = 1000;

        try {
            let skip = 0;
            let hasMore = true;

            while (hasMore) {
                const result = await client.query(QUERY, {
                    first: pageSize,
                    skip,
                    fromAddress: address
                }).toPromise();

                if (result.error) {
                    throw new Error(result.error.message);
                }

                const fetchedPayments = result.data?.payments as Payment[];

                if (fetchedPayments && fetchedPayments.length > 0) {
                    allPayments.push(...fetchedPayments);
                    skip += pageSize;
                } else {
                    hasMore = false;
                }
            }
            setPayments(allPayments);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (wallet) {
            const address = wallet.accounts[0].address;
            // const address = "0xe269688f24e1c7487f649fc3dcd99a4bf15bdaa1";
            // const address ="0x296e8aabbe8d95fdafddd68d402d6c40f7c6e88e"
            // const address = "0xe269688f24e1c7487f649fc3dcd99a4bf15bdaa1";
            fetchAllData(address);
        }
    }, [wallet]);

    useEffect(() => {
        async function processPayments() {
            const sums: { [tokenAddress: string]: number } = {};
            const symbolsMap: { [tokenAddress: string]: string } = {};

            for (const payment of payments) {
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

        if (payments.length > 0) {
            processPayments();
        }
    }, [payments]);

    function generateRandomColors(numColors: number) {
        return Array.from({ length: numColors }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }

    const backgroundColors = generateRandomColors(Object.values(tokenSums).length);
    console.log(Object.values(tokenSums))

    const dataPie = {
        labels: labels,
        datasets: [
            {
                data: Object.values(tokenSums),
                backgroundColor: backgroundColors,
                hoverBackgroundColor: backgroundColors,
            },
        ],
    };

    const optionsPie = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toFixed(2) + ' ETH'}`;
                    },
                },
            },
        },
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-center">Token Holding Distribution</h2>
            <div className="h-96 mx-16">
                <Pie data={dataPie} options={optionsPie} />
            </div>
        </div>
    );
}

export default TokenHolding;