import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

const LandingPage = () => {

    
    const genres = [
        {
            id: 1,
            name: "Fiction",
            bgImage:"superman.jpg",
        },
        {
            id: 2,
            name: "Thriller",
            bgImage:"thriller.jpg",
        },
        {
            id: 3,
            name: "Technology",
            bgImage:"tech.jpg",
        },
        {
            id: 4,
            name: "Romance",
            bgImage:"romance.jpg",
        },
        {
            id: 5,
            name: "Psychology",
            bgImage:"philosophy.jpg",
        },
        {
            id: 6,
            name: "Manga",
            bgImage:"manga.jpg",
        },
    ];

    // Define product data
    const products = [
        {
            id: 1,
            name: "Harry Potter and the cursed child",
            image:"https://placehold.co/200x300",
            price: "$14.99",
            label: "New",
        },
        {
            id: 1,
            name: "Harry Potter and the cursed child",
            image:"https://placehold.co/200x300",
            price: "$14.99",
            label: "New",
        },
        {
            id: 1,
            name: "Harry Potter and the cursed child",
            image:"https://placehold.co/200x300",
            price: "$14.99",
            label: "New",
        },
        {
            id: 1,
            name: "Harry Potter and the cursed child",
            image:"https://placehold.co/200x300",
            price: "$14.99",
            label: "New",
        },
        {
            id: 1,
            name: "Harry Potter and the cursed child",
            image:"https://placehold.co/200x300",
            price: "$14.99",
            label: "New",
        },
        {
            id: 1,
            name: "Harry Potter and the cursed child",
            image:"https://placehold.co/200x300",
            price: "$14.99",
            label: "New",
        },
    ];

    return (
        <>
        <Navbar/>

        <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
            <div
                className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32"
            >
                <div className="max-w-prose text-left">
                <h1 className="text-4xl font-bold text-gray-900 leading-13 sm:text-5xl">
                    Discover Books That
                    <strong className="text-indigo-600"> Inspire, </strong>
                    Entertain , and Change Your Life.
                </h1>

                <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                    Browse our collection of books and find your next great read. Whether you're looking for fiction, non-fiction, or self-help, we have something for everyone.
                </p>

                <div className="mt-4 flex gap-4 sm:mt-6">
                    <Link
                    className="hover:scale-90 active:scale-85 transition duration-300 ease-in-out inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm "
                    to="/Explore"
                    >
                    Explore All
                    </Link>
                </div>
                </div>

                <img 
                    src='hero.jpg' 
                    alt="Hero" 
                    className="hidden md:block md:mt-0 md:w-full md:max-w-lg lg:max-w-xl " 
                />
            </div>
        </section>

        <section className="bg-gray-50 py-16 sm:py-24 lg:py-16">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-prose text-left">
                    <h2 className="text-lg font-semibold text-indigo-600">Our Collection</h2>
                    <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Which Genre Are You Interested In?
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-2 gap-y-8 sm:grid-cols-4 h-fit lg:grid-cols-6 ">
                {genres.map((genre) => (
                    <div
                    className="relative w-full h-56 transition duration-300 ease-in-out active:scale-90 hover:scale-95 overflow-hidden group"
                    style={{
                        backgroundImage: `url(${genre.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    >
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-indigo-200/70 h-full flex items-center justify-center">
                        <h3 className="text-xl font-semibold text-gray-900">{genre.name}</h3>
                    </div>
                    </div>
                ))}
                </div>

                <Link to="/Explore" className="mt-8 inline-block  text-indigo-600 font-medium hover:underline">
                    View All Genres
                </Link>
            </div>
        </section>

        <section className="py-16 sm:py-24 lg:py-16">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-prose text-left">
                    <h2 className="text-lg font-semibold text-indigo-600">New Arrivals</h2>
                    <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Check Out Our Latest Additions!
                    </p>
                </div>
            </div>    

            <div className='mx-auto mt-20 max-w-screen-xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-y-8 sm:grid-cols-3 h-fit sm:gap-x-8 lg:grid-cols-4 lg:gap-x-8'>
                {products.map((product) => (
                    <a href="#" key={product.id} className="group relative border border-gray-200 block overflow-hidden">
                        

                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-64 w-full object-contain transition duration-500 group-hover:scale-105 sm:h-72"
                        />

                        <div className="relative  bg-white p-6">
                            <div className='flex justify-between'>
                                <span className="bg-yellow-200 px-3 py-1.5 text-xs font-medium whitespace-nowrap">{product.label}</span>
                                <button
                                className=" hover:bg-pink-400 transition duration-300 rounded-full bg-gray-200 p-1.5 text-gray-900 hover:text-gray-900/75"
                            >
                                <span className="sr-only">Wishlist</span>

                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-4"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                />
                                </svg>
                                </button>
                            </div>

                            <h3 className="mt-4 text-lg font-medium text-gray-900">{product.name}</h3>

                            <p className="mt-1.5 text-sm text-gray-700">{product.price}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>

        <Footer/>

        </>
    );
};

export default LandingPage;
