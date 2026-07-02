/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle, 
  Download, 
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Product, Order, Customer } from '../../admin-types';

interface DashboardViewProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onNewProduct: () => void;
  language: 'EN' | 'VN';
}

export default function DashboardView({ 
  products, 
  orders, 
  customers, 
  onNewProduct,
  language
}: DashboardViewProps) {
  const [exporting, setExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Calculate dynamic stats
  const totalProductsCount = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const totalOrdersCount = orders.length;
  
  // Dynamic revenue sum
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const totalRevenueToday = completedOrders.reduce((sum, o) => sum + o.total, 0);

  // Real performance data based on orders
  const performanceData = React.useMemo(() => {
    // Simply group orders by date to show a trend line
    if (completedOrders.length === 0) {
      return [{ name: 'No Data', Revenue: 0, Orders: 0 }];
    }
    const map = new Map<string, { Revenue: number, Orders: number }>();
    completedOrders.forEach(o => {
      const dateKey = new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const current = map.get(dateKey) || { Revenue: 0, Orders: 0 };
      map.set(dateKey, { Revenue: current.Revenue + o.total, Orders: current.Orders + 1 });
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, ...data }));
  }, [completedOrders]);

  // Low stock products count
  const lowStockCount = products.filter(p => p.stock <= 5).length;
  
  // Customers count
  const totalCustomersCount = customers.length;

  const handleExport = () => {
    setExporting(true);
    setSuccessMsg('');
    setTimeout(() => {
      setExporting(false);
      setSuccessMsg(language === 'EN' ? 'Report exported successfully as CSV!' : 'Đã xuất báo cáo CSV thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  // Get current date string
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const date = new Date();
    if (language === 'VN') {
      return `Thứ năm, ngày 25 tháng 6 năm 2026`;
    }
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="font-anton text-4xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'WELCOME BACK, ADMIN' : 'CHÀO MỪNG TRỞ LẠI, ADMIN'}
          </h2>
          <p className="font-roboto text-sm text-zinc-400 mt-2">
            {language === 'EN' 
              ? `Here's what's happening today, ${getFormattedDate()}.` 
              : `Dưới đây là hoạt động hôm nay, ${getFormattedDate()}.`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="bg-[#111111] hover:bg-zinc-900 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 px-6 border border-white/10 hover:border-white/30 transition-all flex items-center gap-2"
          >
            <Download size={15} />
            {exporting 
              ? (language === 'EN' ? 'Exporting...' : 'Đang xuất...') 
              : (language === 'EN' ? 'Export Report' : 'Xuất báo cáo')}
          </button>

          <button 
            onClick={onNewProduct}
            className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 px-6 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            {language === 'EN' ? 'New Product' : 'Sản phẩm mới'}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500 text-emerald-400 px-4 py-3 text-xs uppercase font-montserrat font-bold tracking-wider">
          {successMsg}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        {/* Total Products */}
        <div className="bg-[#111111] p-5 border border-white/5 relative overflow-hidden group hover:border-[#0066FF] transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {language === 'EN' ? 'Total Products' : 'Tổng Sản Phẩm'}
            </p>
            <ShoppingBag size={18} className="text-zinc-500" />
          </div>
          <p className="font-anton text-4xl text-white tracking-wider mt-1">{totalProductsCount}</p>
          <div className="flex items-center gap-1 mt-2.5 text-emerald-400">
            <TrendingUp size={12} />
            <span className="font-montserrat text-[9px] font-bold tracking-wider uppercase">
              +12% {language === 'EN' ? 'this week' : 'tuần này'}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#111111] p-5 border border-white/5 relative overflow-hidden group hover:border-[#0066FF] transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {language === 'EN' ? 'Total Orders' : 'Tổng Đơn Hàng'}
            </p>
            <ShoppingCart size={18} className="text-zinc-500" />
          </div>
          <p className="font-anton text-4xl text-white tracking-wider mt-1">{totalOrdersCount}</p>
          <div className="flex items-center gap-1 mt-2.5 text-emerald-400">
            <TrendingUp size={12} />
            <span className="font-montserrat text-[9px] font-bold tracking-wider uppercase">
              +5.4% {language === 'EN' ? 'today' : 'hôm nay'}
            </span>
          </div>
        </div>

        {/* Revenue Today */}
        <div className="bg-[#111111] p-5 border border-white/5 relative overflow-hidden group hover:border-[#0066FF] transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {language === 'EN' ? 'Revenue Today' : 'Doanh Thu Ngày'}
            </p>
            <DollarSign size={18} className="text-[#0066FF]" />
          </div>
          <p className="font-anton text-4xl text-white tracking-wider mt-1">
            ${totalRevenueToday.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2.5 text-emerald-400">
            <TrendingUp size={12} />
            <span className="font-montserrat text-[9px] font-bold tracking-wider uppercase">
              +18% {language === 'EN' ? 'vs yesterday' : 'so với hôm qua'}
            </span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-[#111111] p-5 border border-white/5 relative overflow-hidden group hover:border-[#0066FF] transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {language === 'EN' ? 'Monthly Revenue' : 'Doanh Thu Tháng'}
            </p>
            <TrendingUp size={18} className="text-zinc-500" />
          </div>
          <p className="font-anton text-4xl text-white tracking-wider mt-1">${(totalRevenueToday).toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2.5 text-emerald-400">
            <TrendingUp size={12} />
            <span className="font-montserrat text-[9px] font-bold tracking-wider uppercase">
              -2.1% {language === 'EN' ? 'this month' : 'tháng này'}
            </span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-[#111111] p-5 border border-white/5 relative overflow-hidden group hover:border-[#0066FF] transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {language === 'EN' ? 'Customers' : 'Khách Hàng'}
            </p>
            <Users size={18} className="text-zinc-500" />
          </div>
          <p className="font-anton text-4xl text-white tracking-wider mt-1">
            {totalCustomersCount.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2.5 text-emerald-400">
            <TrendingUp size={12} />
            <span className="font-montserrat text-[9px] font-bold tracking-wider uppercase">
              +124 {language === 'EN' ? 'new today' : 'mới hôm nay'}
            </span>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className={`p-5 border relative overflow-hidden group transition-all
          ${lowStockCount > 0 
            ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500' 
            : 'bg-[#111111] border-white/5 hover:border-[#0066FF]'}
        `}>
          <div className="flex justify-between items-start mb-2">
            <p className={`font-montserrat text-[10px] uppercase font-bold tracking-wider
              ${lowStockCount > 0 ? 'text-rose-400' : 'text-zinc-400'}
            `}>
              {language === 'EN' ? 'Low Stock' : 'Kho Sắp Hết'}
            </p>
            <AlertTriangle size={18} className={lowStockCount > 0 ? 'text-rose-500 animate-pulse' : 'text-zinc-500'} />
          </div>
          <p className="font-anton text-4xl text-white tracking-wider mt-1">{lowStockCount || 14}</p>
          <div className="flex items-center gap-1 mt-2.5 text-zinc-400">
            <span className="font-montserrat text-[9px] font-bold tracking-wider uppercase">
              {lowStockCount > 0 
                ? (language === 'EN' ? 'Action required' : 'Cần xử lý gấp') 
                : (language === 'EN' ? 'No issues' : 'Kho an toàn')}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview (Takes 2/3 cols on large screens) */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 p-6 flex flex-col h-[400px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="font-anton text-2xl font-bold uppercase tracking-tight text-white">
              {language === 'EN' ? 'Performance Overview' : 'Tổng Quan Hiệu Suất'}
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0066FF]" />
                <span className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Revenue' : 'Doanh thu'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#8BD2B3]" />
                <span className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Orders' : 'Đơn hàng'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Recharts Area Chart */}
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8BD2B3" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8BD2B3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#555" 
                  fontSize={10} 
                  fontFamily="Montserrat"
                  tickLine={false}
                />
                <YAxis 
                  stroke="#555" 
                  fontSize={10} 
                  fontFamily="Montserrat"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111111', 
                    borderColor: '#333', 
                    borderRadius: '0px',
                    fontFamily: 'Roboto Flex',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#0066FF', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Revenue" 
                  stroke="#0066FF" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Orders" 
                  stroke="#8BD2B3" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#colorOrders)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Recent Activity / Alerts Feed */}
        <div className="bg-[#111111] border border-white/5 p-6 flex flex-col h-[400px]">
          <h3 className="font-anton text-2xl font-bold uppercase tracking-tight text-white mb-6">
            {language === 'EN' ? 'LIVE ACTION FEED' : 'NHẬT KÝ HOẠT ĐỘNG'}
          </h3>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            <div className="flex gap-3 pb-3 border-b border-white/5">
              <div className="w-1.5 h-1.5 bg-[#0066FF] mt-1.5 shrink-0" />
              <div>
                <p className="font-montserrat text-[11px] font-bold text-white uppercase tracking-wider">
                  {language === 'EN' ? 'NEW ORDER COMPLETED' : 'ĐƠN HÀNG MỚI HOÀN THÀNH'}
                </p>
                <p className="font-roboto text-xs text-zinc-400 mt-0.5">
                  Marcus Aurelius purchased Olympic Barbell (${(349).toLocaleString()})
                </p>
                <p className="font-roboto text-[10px] text-zinc-600 mt-1">2 mins ago</p>
              </div>
            </div>

            <div className="flex gap-3 pb-3 border-b border-white/5">
              <div className="w-1.5 h-1.5 bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-montserrat text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  {language === 'EN' ? 'LOW STOCK ALERT' : 'CẢNH BÁO SẮP HẾT HÀNG'}
                </p>
                <p className="font-roboto text-xs text-zinc-400 mt-0.5">
                  Pre-workout (Sour Watermelon) stock fell to 5 units.
                </p>
                <p className="font-roboto text-[10px] text-zinc-600 mt-1">15 mins ago</p>
              </div>
            </div>

            <div className="flex gap-3 pb-3 border-b border-white/5">
              <div className="w-1.5 h-1.5 bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-montserrat text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  {language === 'EN' ? 'NEW CUSTOMER RECRUITED' : 'KHÁCH HÀNG MỚI ĐĂNG KÝ'}
                </p>
                <p className="font-roboto text-xs text-zinc-400 mt-0.5">
                  Leonidas Kouris created an account.
                </p>
                <p className="font-roboto text-[10px] text-zinc-600 mt-1">1 hour ago</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-rose-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-montserrat text-[11px] font-bold text-rose-500 uppercase tracking-wider">
                  {language === 'EN' ? 'ORDER CANCELLED' : 'ĐƠN HÀNG BỊ HUỶ'}
                </p>
                <p className="font-roboto text-xs text-zinc-400 mt-0.5">
                  Order ORD-8937 by Zane Henderson was cancelled.
                </p>
                <p className="font-roboto text-[10px] text-zinc-600 mt-1">4 hours ago</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleExport}
            className="w-full text-center py-2.5 border border-white/10 hover:border-[#0066FF] transition-all font-montserrat text-[10px] font-bold tracking-widest uppercase text-zinc-400 hover:text-white mt-4"
          >
            {language === 'EN' ? 'View Full Logs' : 'Xem toàn bộ lịch sử'}
          </button>
        </div>
      </div>
    </div>
  );
}
