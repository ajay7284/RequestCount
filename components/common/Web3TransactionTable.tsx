"use client";
import React, { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';

const Web3TransactionTable = ({ transactions, isSidebarOpen }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'income' && transaction.type === 'income') ||
        (filter === 'expenses' && transaction.type === 'expenses') ||
        (filter === 'investments' && transaction.type === 'investments');

      const matchesSearch =
        transaction.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.payer.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, searchTerm]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filteredTransactions.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / entriesPerPage);

  const emptyRows = entriesPerPage - paginatedTransactions.length;

  return (
    <div className={`main-container bg-gray-100 shadow-md rounded-lg p-8 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
                  <th className="py-3 px-6 text-left">Invoice</th>
                  <th className="py-3 px-6 text-left">Payee</th>
                  <th className="py-3 px-6 text-left">Payer</th>
                  <th className="py-3 px-6 text-left">Expected</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Type</th>

                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {paginatedTransactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-gradient-to-r from-gray-100 to-gray-200 transition duration-300 ease-in-out`}
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">{transaction.created}</td>
                    <td className="py-3 px-6 text-left">{transaction.invoice}</td>
                    <td className="py-3 px-6 text-left">{transaction.payee}</td>
                    <td className="py-3 px-6 text-left">{transaction.payer}</td>
                    <td className="py-3 px-6 text-left">{transaction.expected}</td>
                    <td className="py-3 px-6 text-left">{transaction.amount}</td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`${
                          transaction.status === 'Completed'
                            ? 'bg-green-200 text-green-600'
                            : 'bg-yellow-200 text-yellow-600'
                        } py-1 px-3 rounded-full text-xs`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{transaction.amount}</td>

                  </tr>
                ))}
                {emptyRows > 0 &&
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
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6 overflow-hidden">
            <button
              className="px-4 py-2 bg-purple-500 rounded shadow-md text-white transition duration-300 ease-in-out transform hover:bg-purple-600"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className='text-gray-600'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-purple-500 rounded shadow-md text-white transition duration-300 ease-in-out transform hover:bg-purple-600"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Web3TransactionTable;
