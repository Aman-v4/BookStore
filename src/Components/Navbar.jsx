import React from 'react';

const Navbar = () => {
    return (
        <header className="bg-white">
  <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      <div className="md:flex md:items-center md:gap-12">
        <a className="block text-teal-600" href="#">
          <span className="sr-only">Home</span>
          <img src='logo.svg' alt="Logo" className="h-8 w-auto" />
        </a>
      </div>

      <div className="hidden md:block">
        <nav aria-label="Global">
          <ul className="flex items-center gap-10 text-sm">
            <li>
              <a className="text-gray-600 font-medium transition hover:text-gray-500/75" href="#"> Explore All </a>
            </li>

            <li>
              <a className="text-gray-600 font-medium transition hover:text-gray-500/75" href="#"> Wishlist </a>
            </li>

            <li>
              <a className="text-gray-600 font-medium transition hover:text-gray-500/75" href="#"> Cart </a>
            </li>

            <li>
              <a className="text-gray-600 font-medium transition hover:text-gray-500/75" href="#"> Orders </a>
            </li>

          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="sm:flex sm:gap-4">
          <a
            className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm"
            href="#"
          >
            Login
          </a>
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