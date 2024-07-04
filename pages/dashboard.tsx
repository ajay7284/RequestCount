"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import 'animate.css';
import TopToken from '@/components/Charts/TopToken';
import InExp from '@/components/Charts/InExp';
import PenCom from '@/components/Charts/PenCom';
import TransactionVolumeChart from '@/components/Charts/TransactionVolumeChart';
import TokenHolding from '@/components/Charts/TokenHolding';
import NetworthAnalysis from '@/components/Charts/NetworthAnalysis';
import TransactionFees from '@/components/Charts/TransactionFees';
import { Client, cacheExchange, fetchExchange } from 'urql';
import { useConnectWallet } from "@web3-onboard/react";

interface Payment {
    timestamp: number;
    from: string;
    amount: number;
    to: string;
    tokenAddress: string;
}

const Dashboard = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [{ wallet }] = useConnectWallet();
    const [labels, setLabels] = useState<string[]>([]);
    useEffect(() => {
        document.body.classList.add('animate__animated', 'animate__fadeIn');
        return () => {
            document.body.classList.remove('animate__animated', 'animate__fadeIn');
        };
    }, []);

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
            tokenAddress
            timestamp
            gasUsed
            gasPrice
            from
            to
            feeAmount
            feeAddress
            amount
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
            // const address ="0x9edc71b24235ca9e3f147fd11af4cc559d51e9c1"
            fetchAllData(address);
        }
    }, [wallet]);


    return (
        <div style={{ backgroundImage: `url("https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149023436.jpg?t=st=1719821411~exp=1719825011~hmac=b3d4ae9dc7462099dc76a3c71b90626450ed1a8ce550a7fbc203d76c8deedca8&w=996")`, backgroundSize: 'cover', backgroundPosition: 'center', }} >
            <div className="flex flex-wrap ml-48 justify-center gap-16 mx-4">
                <div className="w-full px-4 my-8">
                    <h3 className="text-2xl font-bold mb-8 text-center text-gray-800 animate-pulse">Welcome {wallet?.accounts[0].address.slice(0,4)+'...'+ wallet?.accounts[0].address.slice(-4)}! Your Wallet Overview and Insights Await! 🌟 </h3>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
                >
                    <div className="bg-white p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-50">
                        <h2 className="text-2xl font-bold mb-4 text-center">Wallet</h2>
                        <div className="h-64 mx-9">
                          <p> {wallet?.accounts[0].address}</p> 
                            <p>Currently we have integrated only for Sepolia Ethereum network</p>
                            <p> We plan to expand this integration to other chains soon.</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false }}
      className="w-full h-full lg:w-[60%] px-4 mb-8"
    >
      <div className="bg-white p-4 rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:bg-gray-50">
        <h2 className="text-2xl font-bold mb-4 text-center">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount (Gwei)
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  From
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  To
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 4).map((payment, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {(Number(payment.amount)/10**9).toFixed(2)}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {payment.from.slice(0, 6)}...{payment.from.slice(-4)}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {payment?.to ? `${payment.to.slice(0, 6)}...${payment.to.slice(-4)}` : 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(payment.timestamp * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>

                <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false }}
      className="w-full md:w-1/2 lg:w-[40%] px-4 mb-8"
    >
      <div className="relative" style={{ paddingTop: '100%' }}> {/* 1:1 Aspect ratio */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <h2 className="text-4xl font-bold text-white text-center">Work in progress🚀</h2>
        </div>
        <div className="absolute inset-0 opacity-50">
          <TokenHolding />
        </div>
      </div>
    </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full h-full lg:w-[55%] px-4 mb-8"
                >
                    <TransactionVolumeChart data={payments} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full md:w-1/2 lg:w-[40%] px-4 mb-8"
                >
                    <TopToken data={payments} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full md:w-1/2 lg:w-[55%] px-4 mb-8"
                >
                    <InExp />
                </motion.div>

                <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false }}
      className="w-full md:w-1/2 lg:w-[40%] px-4 mb-8 relative"
    >
      <div className="relative overflow-hidden" style={{ paddingTop: '100%' }}> {/* 1:1 Aspect ratio */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <h2 className="text-4xl font-bold text-white text-center">Work in progress🚀</h2>
        </div>
        <div className="absolute inset-0 opacity-50">
          <PenCom />
        </div>
      </div>
    </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full h-full lg:w-[55%] px-4 mb-8 relative"
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                        <h2 className="text-4xl font-bold text-white">Work in progress🚀 </h2>
                    </div>
                    <div className="opacity-50">
                        <NetworthAnalysis />
                    </div>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full h-full lg:w-[55%] px-4 mb-8"
                >
                    <TransactionFees data={payments} />
                </motion.div>




            </div>
        </div>
    );
};

export default Dashboard;
