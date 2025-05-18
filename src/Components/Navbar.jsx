import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="bg-white z-50 sticky top-0 ">
  <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      <div className="md:flex md:items-center md:gap-12">
        <Link 
        to='/'
        className="block text-teal-600" href="#">
          <span className="sr-only">Home</span>
          <img src='logo.svg' alt="Logo" className="h-8 w-auto" />
        </Link>
      </div>

      <div className="hidden md:block">
        <nav aria-label="Global">
          <ul className="flex items-center gap-10 text-sm">
            <li>
              <Link
                className="text-gray-600 font-medium transition hover:text-gray-500/75"
                to="/Explore"> 
                Explore All   
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-600 font-medium transition hover:text-gray-500/75"
                to="/Wishlist"> 
                Wishlist   
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-600 font-medium transition hover:text-gray-500/75"
                to="/Cart"> 
                Cart  
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-600 font-medium transition hover:text-gray-500/75"
                to="/Orders"> 
                Orders
              </Link>
            </li>

          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="sm:flex sm:gap-4 ">
        <Link
            to="/Login"
            className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:scale-95 active:scale-90 transition duration-300 ease-in-out"
          >
            Login
          </Link>
        </div>

        <div className="block md:hidden">
          <button
            className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</header>
    );
};

export default Navbar;