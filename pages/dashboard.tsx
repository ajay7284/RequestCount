"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import 'animate.css';
import TopToken from '@/components/Charts/TopToken';
import InExp from '@/components/Charts/InExp';
import PenCom from '@/components/Charts/PenCom';
import TFA from '@/components/Charts/TFA';
import TransactionVolumeChart from '@/components/Charts/TransactionVolumeChart';
import TokenHolding from '@/components/Charts/TokenHolding';
import NetworthAnalysis from '@/components/Charts/NetworthAnalysis';
import TransactionFees from '@/components/Charts/TransactionFees';

const Dashboard = () => {

    useEffect(() => {
        document.body.classList.add('animate__animated', 'animate__fadeIn');
        return () => {
            document.body.classList.remove('animate__animated', 'animate__fadeIn');
        };
    }, []);
 
   
    return (
        <div style={{ backgroundImage: `url("https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149023436.jpg?t=st=1719821411~exp=1719825011~hmac=b3d4ae9dc7462099dc76a3c71b90626450ed1a8ce550a7fbc203d76c8deedca8&w=996")`, backgroundSize: 'cover', backgroundPosition: 'center', }} >
            <div className="flex flex-wrap ml-48 justify-center gap-16 mx-4">
                <div className="w-full px-4 my-8">
                    <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 animate-pulse">My Dashboard</h1>
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
                        <div className="h-64 mx-16">
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
                        <div className="h-64">
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
                   <TokenHolding/>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full h-full lg:w-[55%] px-4 mb-8"
                >
                  <TransactionVolumeChart/>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full md:w-1/2 lg:w-[40%] px-4 mb-8"
                >
                    <TopToken/>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full md:w-1/2 lg:w-[55%] px-4 mb-8"
                >
                    <InExp/>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full md:w-1/2 lg:w-[40%] px-4 mb-8"
                >
                   <PenCom/>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full h-full lg:w-[55%] px-4 mb-8"
                >
                    <NetworthAnalysis/>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="w-full h-full lg:w-[55%] px-4 mb-8"
                >
                    <TransactionFees/>
                </motion.div>

                

             
            </div>
        </div>
    );
};

export default Dashboard;
