"use client";
import { useState, useEffect, use } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title } from 'chart.js';
import { Client, cacheExchange, fetchExchange } from 'urql';
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from 'ethers';
import { get } from 'http';


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title);

interface Payment {
    amount: string;
    gasUsed: string;
    id: string;
    timestamp: string;
    from: string;
    to: string;
    tokenAddress: string; // Add the 'tokenAddress' property
}

function TokenHolding() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fromAddress, setFromAddress] = useState<string>('');
    const [{ wallet }, connect] = useConnectWallet();
    const [lables, setLables] = useState<string[]>([]);
    const [tokenSymbols, setTokenSymbols] = useState<{ [address: string]: string }>({});
    const [allPayments, setAllPayments] = useState<Payment[]>([]);
    const [tokenSums, setTokenSums] = useState<{ [tokenAddress: string]: number }>({});


    const minABI = [
        // Some ERC20 functions
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [{ "name": "", "type": "string" }],
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [{ "name": "", "type": "string" }],
            "type": "function"
        }
    ];


    async function getTokenInfo(tokenAddress: any): Promise<{ name: string; symbol: string; } | null> {
        // You might want to use an environment variable for the RPC URL
        const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/X7Fr3tEhG4fCxId_urlR46n6cnatYBrl');

        try {
            console.log(tokenAddress)   
            const contract = new ethers.Contract(tokenAddress, minABI, provider);
            console.log(contract)
            const name = await contract.name();
           
            const symbol = await contract.symbol();
            return { name, symbol };
        } catch (error) {
            console.error('Error fetching token info:', error);
            return null;
        }
    }
    // const fetchTokenLabels = async () => {
    //     console.log('Fetching labels for tokens:', Object.keys(tokenSums));
    //     const labelsPromises = Object.keys(tokenSums).map(async (tokenAddress) => {
    //         console.log('Fetching label for token:', tokenAddress);
    //         const tokenInfo = await getTokenInfo(tokenAddress);
    //         console.log(tokenInfo);
    //         return tokenInfo ? tokenInfo.symbol : tokenAddress.slice(0, 6) + '...';
    //     });
    
    //     const resolvedLabels = await Promise.all(labelsPromises);
    //     console.log('Resolved labels:', resolvedLabels);
    //     setLables(resolvedLabels);
    // };
    
    // useEffect(() => {
    //     if (Object.keys(tokenSums).length > 0) {
    //         fetchTokenLabels();
    //     }
    // }, [tokenSums]);

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
        amountInCrypto
        currency
        feeAddress
        feeAmount
        feeAmountInCrypto
        from
        gasUsed
        gasPrice
        timestamp
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
            console.log('Payments:', allPayments);
            setPayments(allPayments);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (wallet) {
            // const address = wallet.accounts[0].address;
            // const address = "0x26cfaf371d38d679e14b17a8bd00e3fffbaad512";
            const address = "0x296e8aabbe8d95fdafddd68d402d6c40f7c6e88e"
            // const address = "0xe269688f24e1c7487f649fc3dcd99a4bf15bdaa1"
            console.log('Wallet address:', address);
            setFromAddress(address);
            fetchAllData(address);
        }

    }, [wallet]);
    useEffect(() => {
        async function processPayments() {
            setIsLoading(true);
            const newSymbols: any = { ...tokenSymbols };
           
            const uniqueTokenAddresses :any= new Set();

            // Iterate through the array and add unique token addresses to the Set
            payments.forEach(obj => {
                uniqueTokenAddresses.add(obj.tokenAddress);
            });
            
            // Convert Set to array using spread operator
            const uniqueTokenAddressesArray = [...uniqueTokenAddresses];
            console.log('Unique token addresses:', uniqueTokenAddressesArray);
            const symbolsPromises = uniqueTokenAddressesArray.map(async (tokenAddress) => {
                if (!newSymbols[tokenAddress]) {
                    const symbol = await getTokenInfo(tokenAddress);
                    return { tokenAddress, symbol };
                }
                return { tokenAddress, symbol: newSymbols[tokenAddress] };
            });
    
            const resolvedSymbols = await Promise.all(symbolsPromises);
    
            resolvedSymbols.forEach(({ tokenAddress, symbol }) => {
                if (symbol) {
                    newSymbols[tokenAddress] = symbol;
                }
            });
    
            console.log('Token symbols:', newSymbols);
            const symbolsArray = Object.values(newSymbols).map((token:any) => token.symbol);
setLables(symbolsArray);
            // setTokenSymbols(newSymbols);
            setIsLoading(false);
        }
    
        if (payments.length > 0) {
            processPayments();
        }
    }, [payments]);
    
    

    const calculateSums = (payments: Payment[]) => {
        const sums: { [tokenAddress: string]: number } = {};
        payments.forEach(payment => {
            if (!sums[payment.to]) {
                sums[payment.to] = 0;
            }
            sums[payment.to] += parseFloat(payment.amount);

        });
        console.log('Token sums:', sums);
        setTokenSums(sums);
    };

    useEffect(() => {
        if (payments.length > 0) {
            calculateSums(payments);
        }
    }, [payments]);
    console.log(tokenSums);
    function generateRandomColors(numColors:any) {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate random hex color
            colors.push(color);
        }
        return colors;
    }
    
    // Usage
    const numSegments = Object.values(tokenSums).length;
    const backgroundColors = generateRandomColors(numSegments);
    
    const dataPie = {
        labels: lables,
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
        </div>
    )
}

export default TokenHolding;
