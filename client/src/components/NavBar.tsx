import React, { useState } from 'react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = window.location.pathname;

  return (
    <>
      <div className="w-full py-4 px-6 sm:px-12 flex items-center justify-between">
        <h1 className="font-bold text-4xl">twee<span className="text-emerald-500">thresh</span></h1>

        {/* Mobile */}
        <button className="block sm:hidden focus:outline-none focus:ring-4 ring-blue-100 rounded-md" onClick={() => setIsOpen(!isOpen)}>
          <svg className={`w-8 h-8 ${isOpen && 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg className={`w-8 h-8 ${isOpen || 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="hidden sm:grid gap-12 grid-flow-col">
          <a className={`text-lg font-semibold hover:text-emerald-500 rounded-lg leading-10 px-4 ${pathname.includes('pricing') || 'bg-emerald-50 text-emerald-500'}`} href="/pricing">Pricing</a>
          <a className={`text-lg font-semibold hover:text-emerald-500 rounded-lg leading-10 px-4 ${pathname.includes('signin') && 'bg-emerald-50 text-emerald-500'}`} href="/signin">Sign in with Twitter</a>
        </div>
      </div>
      {
        isOpen &&
        <div className="grid sm:hidden bg-white transition ease-in-out duration-300 gap-2 px-6 p-2 pb-4">
          <a className={`text-lg font-semibold rounded-lg px-4 hover:bg-gray-100 px-4 leading-10 hover:text-emerald-500 ${pathname.includes('pricing') && 'bg-emerald-50 text-emerald-500'}`} href="/pricing">Pricing</a>
          <a className={`text-lg font-semibold rounded-lg px-4 hover:bg-gray-100 px-4 leading-10 hover:text-emerald-500 ${pathname.includes('signin') && 'bg-emerald-50 text-emerald-500'}`} href="/signin">Sign in with Twitter</a>
        </div>
      }
    </>
  );
};

export default NavBar;
