/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  Warehouse, 
  Percent, 
  BadgeCheck, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  X,
  Store
} from 'lucide-react';
import { TabType } from '../../admin-types';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'Admin' | 'Staff';
  language?: 'EN' | 'VN';
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose, userRole = 'Admin', language = 'EN' }: SidebarProps) {
  const { isDark } = useTheme();

  const menuItems = [
    { name: 'Dashboard' as TabType, vnName: 'Tổng Quan', icon: LayoutDashboard },
    { name: 'Products' as TabType, vnName: 'Sản Phẩm', icon: ShoppingBag },
    { name: 'Categories' as TabType, vnName: 'Danh Mục', icon: FolderTree },
    { name: 'Orders' as TabType, vnName: 'Đơn Hàng', icon: ShoppingCart },
    { name: 'Customers' as TabType, vnName: 'Khách Hàng', icon: Users },
    { name: 'Inventory' as TabType, vnName: 'Tồn Kho', icon: Warehouse },
    { name: 'Promotions' as TabType, vnName: 'Khuyến Mãi', icon: Percent },
    { name: 'Staff' as TabType, vnName: 'Nhân Viên', icon: BadgeCheck },
    { name: 'Analytics' as TabType, vnName: 'Thống Kê', icon: BarChart3 },
    { name: 'Settings' as TabType, vnName: 'Cài Đặt', icon: Settings },
  ].filter(item => {
    if (userRole === 'Staff') {
      return item.name !== 'Analytics' && item.name !== 'Settings' && item.name !== 'Staff';
    }
    return true;
  });

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden transition-opacity duration-300" 
          onClick={onClose}
        />
      )}

      <nav className={`
        fixed left-0 top-0 h-full w-64 border-r flex flex-col py-6 shrink-0 z-50
        transition-all duration-300 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-gray-200'}
      `}>
        {/* Header logo */}
        <div className="px-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-anton text-3xl font-bold tracking-wider text-[#0066FF] uppercase">
              HENRY FIT
            </h1>
            <p className={`font-montserrat text-[10px] uppercase tracking-widest mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              {userRole === 'Staff' ? (language === 'EN' ? 'Staff Control' : 'Quản lý Nhân Viên') : (language === 'EN' ? 'Admin Control' : 'Quản lý Hệ Thống')}
            </p>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 md:hidden ${isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  onClose();
                }}
                className={`
                  flex items-center gap-4 px-6 py-3.5 text-left border-l-4 transition-all duration-150 font-montserrat text-[11px] uppercase font-semibold tracking-wider whitespace-nowrap
                  ${isActive 
                    ? `border-[#0066FF] ${isDark ? 'bg-zinc-900 text-white' : 'bg-blue-50 text-[#0066FF]'}` 
                    : `border-transparent ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                `}
              >
                <Icon size={18} className={isActive ? 'text-[#0066FF]' : ''} />
                {language === 'VN' ? item.vnName : item.name}
              </button>
            );
          })}
        </div>

        {/* Bottom utility links */}
        <div className={`mt-auto flex flex-col gap-1 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className={`flex items-center gap-4 px-6 py-3 text-left border-l-4 border-transparent font-montserrat text-[11px] uppercase font-semibold tracking-wider whitespace-nowrap ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <Store size={18} />
            {language === 'EN' ? 'Back to Shop' : 'Về Cửa Hàng'}
          </button>

          <button
            onClick={() => {
              setActiveTab('Settings');
              onClose();
            }}
            className={`flex items-center gap-4 px-6 py-3 text-left border-l-4 border-transparent font-montserrat text-[11px] uppercase font-semibold tracking-wider whitespace-nowrap ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <HelpCircle size={18} />
            {language === 'EN' ? 'Help Center' : 'Trợ Giúp'}
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-4 px-6 py-3 text-left border-l-4 border-transparent text-red-500 hover:bg-red-950/20 font-montserrat text-[11px] uppercase font-semibold tracking-wider whitespace-nowrap"
          >
            <LogOut size={18} />
            {language === 'EN' ? 'Logout' : 'Đăng Xuất'}
          </button>
        </div>
      </nav>
    </>
  );
}
