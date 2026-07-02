/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, Search, Globe, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onMenuToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: 'EN' | 'VN';
  setLanguage: (lang: 'EN' | 'VN') => void;
  adminName: string;
  userRole?: 'Admin' | 'Staff';
}

export default function Header({ 
  onMenuToggle, 
  searchQuery, 
  setSearchQuery, 
  language, 
  setLanguage,
  adminName,
  userRole = 'Admin'
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`w-full h-16 sticky top-0 border-b z-35 flex justify-between items-center px-6 transition-colors ${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
      {/* Left section: Hamburger for mobile, search for desktop */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuToggle}
          className={`p-1 md:hidden ${isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Menu size={24} />
        </button>

        <h1 className={`font-anton text-xl font-bold tracking-wider md:hidden uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
          HENRY FIT
        </h1>

        <div className={`hidden md:flex items-center gap-3 px-4 py-2 border focus-within:border-[#0066FF] transition-colors w-96 ${isDark ? 'bg-[#111111] border-white/15' : 'bg-gray-50 border-gray-300'}`}>
          <Search size={16} className={isDark ? 'text-zinc-500' : 'text-gray-400'} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'EN' ? "Search orders, products, or customers..." : "Tìm đơn hàng, sản phẩm, khách hàng..."}
            className={`bg-transparent border-none outline-none text-sm w-full focus:ring-0 font-inter ${isDark ? 'text-white placeholder-zinc-600' : 'text-gray-900 placeholder-gray-400'}`}
          />
        </div>
      </div>

      {/* Right section: Theme toggle, Language toggle, Divider, Profile */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${isDark ? 'text-yellow-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Language selector */}
        <button 
          onClick={() => setLanguage(language === 'EN' ? 'VN' : 'EN')}
          className={`flex items-center gap-1.5 transition-colors text-xs font-semibold uppercase font-montserrat tracking-wider py-1.5 px-2.5 border ${isDark ? 'text-zinc-400 hover:text-white border-white/10 hover:border-white/30' : 'text-gray-500 hover:text-gray-900 border-gray-300 hover:border-gray-400'}`}
          title="Switch Language / Đổi ngôn ngữ"
        >
          <Globe size={14} className="text-[#0066FF]" />
          <span>{language}</span>
        </button>

        <div className={`h-6 w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 hover:text-[#0066FF] transition-colors py-1 focus:outline-none"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5DfIF7XicV9Ke3662DVJ9HZjzqZXL5kxBgLy14FFgD3Laidgd3ZfPD49wKjzbzYmvmDXgJxr4quqeB0b1TZ2Tqolw7Qd0oq4-TP6rWD0Z7wfK_EIje6W2lfz1JgH3eo7jxQn_4FuNsv4sjK6m4d1MODS4rBn3BHKTn3QCps9iV-FrnVolUq2ogohYuiSEDKQGOkQoOohqqWoCmbLfZWCQd0lSfJeghsN5Fxnu95Ev850rxsHSzSrazCqLRCogeP0CYjWVC_bB5yDw" 
              alt="Profile" 
              referrerPolicy="no-referrer"
              className={`w-8 h-8 object-cover border ${isDark ? 'border-white/20' : 'border-gray-300'}`}
            />
            <span className={`font-montserrat text-[11px] uppercase font-bold tracking-wider hidden md:block ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {adminName}
            </span>
            <ChevronDown size={12} className={`hidden md:block ${isDark ? 'text-zinc-400' : 'text-gray-400'}`} />
          </button>

          {profileOpen && (
            <div className={`absolute right-0 mt-2.5 w-48 border shadow-2xl z-50 ${isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-gray-200'}`}>
              <div className={`p-3 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <p className={`font-montserrat text-xs font-bold uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>{adminName}</p>
                <p className={`font-inter text-[11px] mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {userRole === 'Staff' ? 'staff@henryfit.com' : 'admin@henryfit.com'}
                </p>
              </div>
              <div className="p-1">
                <button 
                  onClick={() => { setProfileOpen(false); }}
                  className={`w-full text-left font-montserrat text-[11px] uppercase tracking-wider px-3 py-2 ${isDark ? 'text-zinc-300 hover:bg-zinc-900' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  My Profile
                </button>
                {userRole !== 'Staff' && (
                  <button 
                    onClick={() => { setProfileOpen(false); }}
                    className={`w-full text-left font-montserrat text-[11px] uppercase tracking-wider px-3 py-2 ${isDark ? 'text-zinc-300 hover:bg-zinc-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    System Settings
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
