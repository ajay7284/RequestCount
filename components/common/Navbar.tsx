import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import { LayoutDashboard, Wallet, Menu, X ,Home,FileText,Repeat} from 'lucide-react';
import { truncateAddress } from "@/utils/walletUtils";
import { Button } from "../common";
import { FaFileInvoiceDollar } from "react-icons/fa";
import ReactTooltip from 'react-tooltip';


const Sidebar = () => {
  const router = useRouter();
  const [{ wallet }, connect] = useConnectWallet();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const links = [
   {
 name:"Home",
 href:"/homepage",
 icon:<Home className="w-6 h-6"/>,
   },
    {
      name: "My Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
      name: "List of Invoices",
      href: "/",
      icon: <FileText className="w-6 h-6"/>,
      
    },
    {
      name: "Create an Invoice",
      href: "/create-invoice",
      icon: <FaFileInvoiceDollar className="w-6 h-6"/>,
    },
    {
      name: "Transaction",
      href: "/Transaction",
      icon: <Repeat className="w-6 h-6" />,
    },
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen bg-[#0B0C10] text-gray-300 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'} overflow-hidden z-50 shadow-lg flex flex-col justify-between font-sans`}>
      <div className="flex flex-col items-center gap-8 relative">
        {isOpen ? (
          <>
            {/* <a
              target="_blank"
              rel="noreferrer noopener"
              href="/dashboard"
              className="mb-[30px] flex items-center justify-center"
            >
              <img
                src="assets/c2.png"
                alt="Request Network Logo"
                className={`transition-opacity duration-300 ${isOpen ? 'w-[100px] xl:w-[140px] hover:opacity-80' : 'w-16 xl:w-[40px]'}`}
              />

 
            </a> */}
          <Link href="/dashboard">
            <img
                src="assets/c2.png"
                alt="Request Network Logo"
                className={`transition-opacity duration-300 absolute  right-24 ${isOpen ? 'w-[100px] xl:w-[140px] hover:opacity-80 absolute top-0' : 'w-16 xl:w-[40px]'}`}
                style={{top:"-10px"}}
              />
            </Link>



            <button
              className={`absolute top-4  text-gray-300 focus:outline-none ${isOpen ? 'right-10' : 'top-20'}`}
              onClick={toggleSidebar}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 absolute  top-10" />}
            </button>
          </>
        ) : (
          < >
            <button
              className={`absolute   text-gray-300 focus:outline-none ${isOpen ? 'right-10' : 'top-20'}`}
              onClick={toggleSidebar}
              style={{marginTop:"-50px",right:"0px" }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 absolute right-7" />}
            </button>
            {/* <a
              target=""
              rel="noreferrer noopener"
              href="/dashboard"
              className="mb-[30px] flex items-center justify-center"
            >
              <img
                src="assets/c2.png"
                alt="Request Network Logo"
                className={`transition-opacity duration-300 absolute top-14 ${isOpen ? 'w-[100px] xl:w-[140px] hover:opacity-80' : 'w-16 xl:w-[40px]'}`}
              />
            </a> */}

            {/* <Link href="/dashboard">
            <img
                src="assets/c2.png"
                alt="Request Network Logo"
                className={`transition-opacity duration-300 absolute  ${isOpen ? 'w-[100px] xl:w-[140px] hover:opacity-80 ' : 'w-16 xl:w-[40px]'}`}
                style={{top:"80px",right:"10px"}}
              />
            </Link> */}


            
          </>
        )}
        <ul className={`flex flex-col items-start    ${isOpen ? "mt-0" : "mt-24"}      mt-16 w-full gap-4 px-4` }>
          {links.map((link, index) => (
            <li
              className={`relative w-full rounded-full ${router.pathname === link.href  ? 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 ' : 'hover:bg-gradient-to-r hover:from-gray-600 hover:via-gray-700 hover:to-gray-800'} transition-colors duration-500 ease-in-out`}
              key={index}
            >
              <Link href={link.href} className="flex items-center gap-[10px] p-[15px] w-full rounded-lg ">
                {link.icon}
                <span className={`${isOpen ? 'inline' : 'hidden'} transition-all duration-300 text-sm font-medium`}>{link.name}</span>
              </Link>
              <div
                className={`${router.pathname === link.href && "h-[4px] w-full absolute bottom-0 rounded-lg"}`}
              ></div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-center gap-[15px] lg:gap-[35px] mb-6 w-full">
        {isOpen ? (
          <Button
            className="px-[14px] lg:px-[20px] text-sm lg:text-base py-[8px] bg-gray-800 text-purple-600 rounded hover:bg-gray-700 transition-all duration-300 w-3/4"
            text={
              wallet
                ? truncateAddress(wallet.accounts[0].address)
                : "Connect Wallet"
            }
            onClick={() => {
              connect();
            }}
          />
        ) : (
          <button
            className="flex items-center justify-center w-12 h-12 bg-gray-800 text-black-600 rounded-full hover:bg-gray-700 transition-all duration-300"
            onClick={() => {
              connect();
            }}
          >
            <Wallet className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
