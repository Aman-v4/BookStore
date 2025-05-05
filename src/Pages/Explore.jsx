import React, { useState ,useEffect} from 'react';
import Records from '../Books/BooksData.json';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Explore = () => {

   

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 9;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, sortOption, selectedGenre]);

  const genres = ['All', 'Thriller', 'Manga', 'Romance', 'Psychology', 'Fiction', 'Technology'];

  const handleSort = (books) => {
    switch (sortOption) {
      case 'low-to-high':
        return [...books].sort((a, b) => a.discounted_price - b.discounted_price);
      case 'high-to-low':
        return [...books].sort((a, b) => b.discounted_price - a.discounted_price);
      case 'highest-discount':
        return [...books].sort((a, b) =>
          ((b.price - b.discounted_price) / b.price) - ((a.price - a.discounted_price) / a.price)
        );
      case 'lowest-discount':
        return [...books].sort((a, b) =>
          ((a.price - a.discounted_price) / a.price) - ((b.price - b.discounted_price) / b.price)
        );
      default:
        return books;
    }
  };

  const filteredBooks = Records.filter(book =>
    selectedGenre === 'All' ? true : book.genre.toLowerCase() === selectedGenre.toLowerCase()
  );

  const sortedBooks = handleSort(filteredBooks);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = sortedBooks.slice(startIndex, startIndex + booksPerPage);

  return (
    <>
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-gray-100 p-6 border-r border-gray-200 sticky top-20 h-screen">
          <h2 className="text-xl font-semibold mb-4">Filter By Genre</h2>
          <ul className="space-y-2 mb-6">
            {genres.map((genre) => (
              <li key={genre}>
                <button
                  onClick={() => {
                    setSelectedGenre(genre);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className={`text-left w-full px-3 py-2 rounded-md text-sm ${
                    selectedGenre === genre
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-indigo-50'
                  }`}
                >
                  {genre}
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mb-3">Sort By</h2>
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1); // Reset to first page on sort change
            }}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Default</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
            <option value="highest-discount">Highest Discount</option>
            <option value="lowest-discount">Lowest Discount</option>
          </select>
        </aside>

        {/* Product Grid */}
        <main className="w-full lg:w-3/4 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBooks.map((record) => {
              const discount = Math.round(((record.price - record.discounted_price) / record.price) * 100);
              return (
                <div
                  key={record.id}
                  className="bg-white border border-gray-200 shadow rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                >
                  <img
                    src={record.image}
                    alt={record.name}
                    className="w-32 h-48 object-cover mb-4"
                  />
                  <h2 className="text-lg font-semibold">{record.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">{record.author}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500 line-through text-sm">₹{record.price}</span>
                    <span className="text-green-600 font-bold">₹{record.discounted_price}</span>
                  </div>
                  <span className="text-sm text-red-500 font-medium">{discount}% OFF</span>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md border text-sm ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-indigo-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Explore;
