import React from 'react';
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

    return (
        <>
        <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
            <div
                className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32"
            >
                <div className="max-w-prose text-left">
                <h1 className="text-4xl font-bold text-gray-900 leading-13 sm:text-5xl">
                    Discover Books Thatss
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



        </>
    );
};

export default LandingPage;
