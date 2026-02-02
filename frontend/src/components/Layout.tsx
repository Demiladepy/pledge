/**
 * Premium Layout Component
 * Enhanced with brand identity, better navigation, and smooth transitions
 */

import { ReactNode, useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  IoMoon,
  IoSunny,
  IoMenu,
  IoClose,
  IoRocket,
  IoStatsChart,
  IoCloudUpload,
  IoAddCircle
} from 'react-icons/io5'
import { useTheme } from '../contexts/ThemeContext'
import { cn } from '../utils/cn'
import WalletConnector from './WalletConnector'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <IoStatsChart aria-hidden="true" /> },
    { to: '/create-goal', label: 'Create Goal', icon: <IoAddCircle aria-hidden="true" /> },
    { to: '/submit-proof', label: 'Submit Proof', icon: <IoCloudUpload aria-hidden="true" /> },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* Skip to Content - Accessible skip link */}
      <a 
        href="#main-content" 
        className="skip-to-content"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header
        role="banner"
        className={cn(
          'sticky top-0 z-[1000] w-full transition-all duration-300',
          scrolled
            ? 'glass-strong py-3 shadow-lg'
            : 'bg-transparent py-5'
        )}
      >
        <nav 
          className="container-custom flex items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            aria-label="PledgeAgent - Go to homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform" aria-hidden="true">
              <IoRocket className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-heading font-extrabold tracking-tight dark:text-white">
                PledgeAgent
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-500">
                AI Accountability
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                role="menuitem"
                aria-current={isActive(link.to) ? 'page' : undefined}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
                  isActive(link.to)
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <WalletConnector />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {resolvedTheme === 'dark' ? (
                <IoSunny className="w-5 h-5 text-yellow-500" aria-hidden="true" />
              ) : (
                <IoMoon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl glass hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <IoClose className="w-6 h-6" aria-hidden="true" />
              ) : (
                <IoMenu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <div 
          id="mobile-navigation"
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!mobileMenuOpen}
          className={cn(
            'lg:hidden fixed inset-x-0 top-[70px] glass-strong border-b border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden',
            mobileMenuOpen ? 'max-h-[400px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
          )}
        >
          <div className="container-custom space-y-3" role="menu">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                role="menuitem"
                aria-current={isActive(link.to) ? 'page' : undefined}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className={cn(
                  'flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-bold transition-all',
                  isActive(link.to)
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div 
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isActive(link.to) ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'
                  )}
                  aria-hidden="true"
                >
                  {link.icon}
                </div>
                {link.label}
              </Link>
            ))}
            <div className="pt-4 sm:hidden">
              <WalletConnector className="w-full justify-center py-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="relative">
        {/* Background decorations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
        </div>

        <div className="container-custom py-12 relative z-10 page-transition">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 py-20">
        <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white">
                <IoRocket className="w-5 h-5" />
              </div>
              <span className="text-xl font-heading font-extrabold dark:text-white">PledgeAgent</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm text-lg leading-relaxed">
              Don't just set goals. Enforce them with AI and real financial stakes.
              The future of accountability is here.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-gray-900 dark:text-white mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link></li>
              <li><Link to="/create-goal" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Create Goal</Link></li>
              <li><Link to="/submit-proof" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Submit Proof</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-gray-900 dark:text-white mb-6">Connect</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Twitter / X</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Discord</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="container-custom mt-20 pt-8 border-t border-gray-200 dark:border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>&copy; 2026 PledgeAgent. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
