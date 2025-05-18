import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout, getUserInitials } = useAuth();
    const { cart, itemCount: cartCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="bg-white z-50 sticky top-0 shadow-sm">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12">
                        <Link 
                            to='/'
                            className="block text-teal-600">
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
                                        className="text-gray-600 font-medium transition hover:text-gray-500/75 relative"
                                        to="/Wishlist"> 
                                        Wishlist
                                        {wishlistCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {wishlistCount}
                                            </span>
                                        )}   
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="text-gray-600 font-medium transition hover:text-gray-500/75 relative"
                                        to="/Cart"> 
                                        Cart
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}  
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
                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={toggleDropdown}
                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700"
                                >
                                    {getUserInitials()}
                                </button>
                                
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Your Profile
                                        </Link>
                                        <button 
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="sm:flex sm:gap-4">
                                <Link
                                    to="/Login"
                                    className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:scale-95 active:scale-90 transition duration-300 ease-in-out"
                                >
                                    Login
                                </Link>
                            </div>
                        )}

                        <div className="block md:hidden">
                            <button
                                onClick={toggleMobileMenu}
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

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white p-4 border-t">
                    <nav className="flex flex-col space-y-4">
                        <Link
                            to="/Explore"
                            className="text-gray-600 font-medium transition hover:text-gray-500/75"
                            onClick={() => setMobileMenuOpen(false)}
                        > 
                            Explore All   
                        </Link>
                        <Link
                            to="/Wishlist"
                            className="text-gray-600 font-medium transition hover:text-gray-500/75 flex items-center"
                            onClick={() => setMobileMenuOpen(false)}
                        > 
                            Wishlist   
                            {wishlistCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/Cart"
                            className="text-gray-600 font-medium transition hover:text-gray-500/75 flex items-center"
                            onClick={() => setMobileMenuOpen(false)}
                        > 
                            Cart  
                            {cartCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/Orders"
                            className="text-gray-600 font-medium transition hover:text-gray-500/75"
                            onClick={() => setMobileMenuOpen(false)}
                        > 
                            Orders
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;