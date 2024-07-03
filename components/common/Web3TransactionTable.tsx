"use client";
import React, { useState, useEffect,useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Client, cacheExchange, fetchExchange } from 'urql';
import { useConnectWallet } from "@web3-onboard/react";


const Web3TransactionTable = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [{ wallet }] = useConnectWallet();
  const [labels, setLabels] = useState<string[]>([]);
  interface Payment {
    timestamp: number;
    amount: string;
    to: string;
    tokenAddress: string;
    from: string;
    __typename: string;
}
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
          feeAmount
          feeAddress
          amount
          to
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
          // const address = "0x9edc71b24235ca9e3f147fd11af4cc559d51e9c1"
          fetchAllData(address);
      }
  }, [wallet]);
  function formatDate(timestamp:any) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  return (
    <div className={`main-container bg-gray-100 shadow-md rounded-lg p-8 ml-64 mr-36 mt-16 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="container mx-auto px-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Web3 Transactions</h1>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <button
              className={`mr-2 px-4 py-2 rounded ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              } shadow-md transition duration-300 ease-in-out transform hover:scale-105`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`mr-2 px-4 py-2 rounded ${
                filter === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              } shadow-md transition duration-300 ease-in-out transform hover:scale-105`}
              onClick={() => setFilter('income')}
            >
              Income
            </button>
            <button
              className={`mr-2 px-4 py-2 rounded ${
                filter === 'expenses' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
              } shadow-md transition duration-300 ease-in-out transform hover:scale-105`}
              onClick={() => setFilter('expenses')}
            >
              Expenses
            </button>
            <button
              className={`px-4 py-2 rounded ${
                filter === 'investments' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
              } shadow-md transition duration-300 ease-in-out transform hover:scale-105`}
              onClick={() => setFilter('investments')}
            >
              Investments
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-full shadow-md focus:ring-2 focus:ring-teal-400 transition duration-300 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="p-6 rounded-lg shadow-md">
            <table className="min-w-full rounded-lg">
              <thead className="bg-violet-950	 text-white uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Created</th>
                  {/* <th className="py-3 px-6 text-left">Invoice</th> */}
                  <th className="py-3 px-6 text-left">Payee</th>
                  <th className="py-3 px-6 text-left">Payer</th>
                  <th className="py-3 px-6 text-left">Expected</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Type</th>

                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {payments.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-gradient-to-r from-gray-100 to-gray-200 transition duration-300 ease-in-out`}
                  >
  
                    <td className="py-3 px-6 text-left whitespace-nowrap"> {formatDate(transaction.timestamp)}</td>
                    {/* <td className="py-3 px-6 text-left">{transaction}</td> */}
                    <td className="py-3 px-6 text-left">{(transaction.from.slice(0,4)+'...'+transaction.from.slice(-4))}</td>
                    <td className="py-3 px-6 text-left">{transaction.to.slice(0,4)+'...'+transaction.to.slice(-4)}</td>
                    <td className="py-3 px-6 text-left">{Number(transaction.amount) / 10**9} Gwei</td>
                    <td className="py-3 px-6 text-left">{Number(transaction.amount)/ 10**9} Gwei</td>

                    <td className="py-3 px-6 text-left">
                      <span
                        className={`bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs`}
                      >
                        completed
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{transaction.__typename}</td>

                  </tr>
                ))}
                {/* {emptyRows > 0 &&
                  Array.from(Array(emptyRows).keys()).map((_, index) => (
                    <tr
                      key={`empty-${index}`}
                      className={`border-b border-gray-200 ${
                        (paginatedTransactions.length + index) % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">&nbsp;</td>
                      <td className="py-3 px-6 text-left">&nbsp;</td>
                      <td className="py-3 px-6 text-left">&nbsp;</td>
                      <td className="py-3 px-6 text-left">&nbsp;</td>
                      <td className="py-3 px-6 text-left">&nbsp;</td>
                      <td className="py-3 px-6 text-left">&nbsp;</td>
                      <td className="py-3 px-6 text-left">&nbsp;</td>
                    </tr>
                  ))} */}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6 overflow-hidden">
            {/* <button
              className="px-4 py-2 bg-purple-500 rounded shadow-md text-white transition duration-300 ease-in-out transform hover:bg-purple-600"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button> */}
            {/* <span className='text-gray-600'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-purple-500 rounded shadow-md text-white transition duration-300 ease-in-out transform hover:bg-purple-600"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Web3TransactionTable;
