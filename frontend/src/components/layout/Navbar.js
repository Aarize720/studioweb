'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Shop', href: '/shop' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.getCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">HS</span>
            </div>
            <span className={`font-heading font-bold text-xl ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Horizon Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-primary-600'
                    : isScrolled
                    ? 'text-gray-700 hover:text-primary-600'
                    : 'text-white hover:text-primary-200'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/shop/cart"
              className={`relative p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <FiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <FiUser className="w-6 h-6" />
                  <span className="font-medium">{user?.first_name}</span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href={user?.role === 'admin' || user?.role === 'super_admin' ? '/admin' : '/dashboard'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Mes commandes
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="btn btn-primary"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t pt-2 mt-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={user?.role === 'admin' || user?.role === 'super_admin' ? '/admin' : '/dashboard'}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-primary-600 hover:bg-gray-100"
                      >
                        Inscription
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}