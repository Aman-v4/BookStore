import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; 
import Records from '../Books/BooksData.json';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Explore = () => {
  const location = useLocation(); 
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState({});
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const genre = queryParams.get('genre');
    if (genre) {
      setSelectedGenre(genre);
    }
  }, [location.search]); 

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

  const handleAddToCart = async (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    setAddingToCart(prev => ({ ...prev, [bookId]: true }));
    try {
      const result = await addToCart(bookId);
      if (result.success) {
        toast.success('Added to cart!');
      } else {
        toast.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Error adding to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const handleWishlist = async (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to manage wishlist');
      return;
    }
    
    setWishlistItems(prev => ({ ...prev, [bookId]: true }));
    try {
      const isCurrentlyInWishlist = wishlistItems[bookId];
      let result;
      
      if (isCurrentlyInWishlist) {
        result = await removeFromWishlist(bookId);
        if (result.success) {
          setWishlistItems(prev => ({ ...prev, [bookId]: false }));
          toast.success('Removed from wishlist!');
        }
      } else {
        result = await addToWishlist(bookId);
        if (result.success) {
          setWishlistItems(prev => ({ ...prev, [bookId]: true }));
          toast.success('Added to wishlist!');
        }
      }
      
      if (!result.success) {
        toast.error(result.error || 'Failed to update wishlist');
      }
    } catch (error) {
      toast.error('Error updating wishlist');
    } finally {
      setWishlistItems(prev => ({ ...prev, [bookId]: !prev[bookId] }));
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:flex-row min-h-screen">
        <aside className="w-full lg:w-1/4 bg-gray-100 p-6 border-r border-gray-200 sticky top-20 h-screen">
          <h2 className="text-xl font-semibold mb-4">Filter By Genre</h2>
          <ul className="space-y-2 mb-6">
            {genres.map((genre) => (
              <li key={genre}>
                <button
                  onClick={() => {
                    setSelectedGenre(genre);
                    setCurrentPage(1);
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
              setCurrentPage(1);
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

        <main className="w-full lg:w-3/4 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedBooks.map((record) => {
              const discount = Math.round(((record.price - record.discounted_price) / record.price) * 100);
              return (
                <div key={record.id} className="relative">
                  <Link to={`/product/${record.id}`}>
                    <div
                      className="bg-white border border-gray-200 p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow rounded-lg"
                    >
                      <img
                        src={record.image}
                        alt={record.name}
                        className="w-32 h-48 object-cover mb-4"
                      />
                      <h2 className="text-lg font-semibold">{record.name}</h2>
                      <p className="text-sm text-gray-600 mb-1 italic">{record.author}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-500 line-through text-sm">₹{record.price}</span>
                        <span className="text-green-600 font-bold">
                          ₹{record.discounted_price} <span className="text-red-500 text-sm font-medium">({discount}% OFF)</span>
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={(e) => handleWishlist(e, record.id)}
                      className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                      aria-label={wishlistItems[record.id] ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {wishlistItems[record.id] ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={(e) => handleAddToCart(e, record.id)}
                      disabled={addingToCart[record.id]}
                      className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70"
                    >
                      {addingToCart[record.id] ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                setCurrentPage(i + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
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
    </>
  );
};

export default Explore;
