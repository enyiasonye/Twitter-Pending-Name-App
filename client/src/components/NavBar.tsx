import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { RootState } from '../store/store';
import { signIn, signOut } from '../store/thunks/authThunks';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = window.location.pathname;
  let history = useHistory();

  const currentUser = useSelector((state: RootState) => state.auth.userProfile);
  const dispatch = useDispatch();

  return (
    <>
      <div className="w-full py-4 px-6 sm:px-12 flex items-center justify-between">
        <h1 className="font-bold text-4xl">
          <Link className="hover:text-black" to="/">
            twee<span className="text-emerald-500">thresh</span>
          </Link>
        </h1>

        {/* Mobile */}
        <button
          className="block sm:hidden focus:outline-none focus:ring-4 ring-blue-100 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className={`w-8 h-8 ${isOpen && 'hidden'}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            className={`w-8 h-8 ${isOpen || 'hidden'}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="hidden sm:grid gap-12 grid-flow-col">
          <button
            className={`text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 hover:text-emerald-500 rounded-lg leading-10 px-4 ${
              pathname.includes('pricing') && 'bg-emerald-50 text-emerald-500'
            }`}
            onClick={() => {
              history.push('/pricing');
            }}
          >
            Pricing
          </button>
          {currentUser ? (
            <button
              className={`text-lg font-semibold hover:text-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg leading-10 px-4`}
              onClick={(e) => {
                dispatch(signOut());
              }}
            >
              Sign Out
            </button>
          ) : (
            <button
              className={`text-lg font-semibold hover:text-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg leading-10 px-4`}
              onClick={() => {
                dispatch(signIn());
              }}
            >
              Sign in with Twitter
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="grid sm:hidden bg-white transition ease-in-out duration-300 gap-2 px-6 p-2 pb-4">
          <button
            className={`text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 hover:text-emerald-500 rounded-lg leading-10 px-4 ${
              pathname.includes('pricing') && 'bg-emerald-50 text-emerald-500'
            }`}
            onClick={() => {
              history.push('/pricing');
            }}
          >
            Pricing
          </button>
          {currentUser ? (
            <button
              className={`text-lg font-semibold hover:text-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg leading-10 px-4 ${
                pathname.includes('signin') && 'bg-emerald-50 text-emerald-500'
              }`}
              onClick={(e) => {
                dispatch(signOut());
              }}
            >
              Sign Out
            </button>
          ) : (
            <button
              className={`text-lg font-semibold hover:text-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg leading-10 px-4 ${
                pathname.includes('signin') && 'bg-emerald-50 text-emerald-500'
              }`}
              onClick={() => {
                dispatch(signIn());
              }}
            >
              Sign in with Twitter
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default NavBar;
