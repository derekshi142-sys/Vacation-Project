import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Plan Trip', href: '/plan' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TravelAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side: CTA + Auth */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <Link to="/plan" className="btn-primary">Start Planning</Link>
            {!user ? (
              <a href="/login.html" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </a>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu((s) => !s)}
                  className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=2563eb&color=fff`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-800 max-w-[140px] truncate">
                    {user.displayName || user.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-3 py-2 text-sm text-gray-700 border-b flex items-center space-x-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span>Signed in</span>
                    </div>
                    <a
                      href="/history.html"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      My Trips
                    </a>
                    <button
                      onClick={async () => { await signOut(auth); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/plan" className="block w-full text-center mt-4 btn-primary" onClick={() => setIsMenuOpen(false)}>
                Start Planning
              </Link>
              {!user ? (
                <a href="/login.html" className="block w-full text-center mt-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                   onClick={() => setIsMenuOpen(false)}>
                  Login
                </a>
              ) : (
                <div className="mt-3 px-3 py-2 border-t">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=2563eb&color=fff`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm text-gray-800 truncate max-w-[180px]">
                      {user.displayName || user.email}
                    </div>
                  </div>
                  <a href="/history.html" className="block text-sm text-gray-700 py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    My Trips
                  </a>
                  <button
                    className="w-full text-left text-sm text-gray-700 py-2 hover:text-primary-600"
                    onClick={async () => { await signOut(auth); setIsMenuOpen(false); }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
