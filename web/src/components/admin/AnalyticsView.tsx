/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, Zap, Award } from 'lucide-react';
import { Product, Order, Category, Customer } from '../../admin-types';

interface AnalyticsViewProps {
  products: Product[];
  orders: Order[];
  categories: Category[];
  customers: Customer[];
  language: 'EN' | 'VN';
}

export default function AnalyticsView({
  products,
  orders,
  categories,
  customers,
  language
}: AnalyticsViewProps) {
  const [timeframe, setTimeframe] = useState<'WEEKLY' | 'MONTHLY'>('MONTHLY');

  // Dynamic Sales trend from real orders
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  
  const avgOrderValue = completedOrders.length > 0 ? (totalRevenue / completedOrders.length) : 0;
  const customerLTV = customers.length > 0 ? (totalRevenue / customers.length) : 0;

  // Chart 1: Sales trends data (Monthly)
  const monthlySalesTrend = React.useMemo(() => {
    const map = new Map<string, { Revenue: number, Orders: number }>();
    completedOrders.forEach(o => {
      const month = new Date(o.date).toLocaleString('default', { month: 'short' });
      const current = map.get(month) || { Revenue: 0, Orders: 0 };
      map.set(month, { Revenue: current.Revenue + o.total, Orders: current.Orders + 1 });
    });
    return Array.from(map.entries()).map(([month, data]) => ({ month, ...data }));
  }, [completedOrders]);

  const weeklySalesTrend = React.useMemo(() => {
    // Simplification for Weekly view: group by exact date string to simulate short-term timeframe
    const map = new Map<string, { Revenue: number, Orders: number }>();
    completedOrders.forEach(o => {
      const dateKey = new Date(o.date).toLocaleDateString();
      const current = map.get(dateKey) || { Revenue: 0, Orders: 0 };
      map.set(dateKey, { Revenue: current.Revenue + o.total, Orders: current.Orders + 1 });
    });
    return Array.from(map.entries()).map(([month, data]) => ({ month, ...data })).slice(-7); // last 7 days
  }, [completedOrders]);

  const chartData = timeframe === 'MONTHLY' ? monthlySalesTrend : weeklySalesTrend;

  // Chart 2: Category breakdown calculation
  const categoryChartData = categories.map(cat => {
    // Count products
    const pCount = products.filter(p => p.category === cat.name).length;
    // Calculate total potential value (price * stock)
    const valuation = products
      .filter(p => p.category === cat.name)
      .reduce((sum, p) => sum + (p.price * p.stock), 0);

    return {
      name: cat.name.toUpperCase(),
      ProductsCount: pCount,
      Valuation: valuation
    };
  });

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
        <div>
          <h2 className="font-anton text-3xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'ATHLETIC METRICS & INTELLIGENCE' : 'BÁO CÁO KINH DOANH & PHÂN TÍCH'}
          </h2>
          <p className="font-roboto text-sm text-zinc-400 mt-1">
            {language === 'EN' 
              ? 'Evaluate revenue loops, seasonal inventory velocities, and athletic product demand.'
              : 'Phân tích doanh thu, nhu cầu thị trường, và tốc độ tiêu thụ thiết bị tập luyện.'}
          </p>
        </div>

        {/* Timeframe config */}
        <div className="flex border border-white/10 p-1 bg-[#111111]">
          {(['WEEKLY', 'MONTHLY'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`
                px-4 py-1.5 font-montserrat text-[9px] uppercase font-bold tracking-widest transition-all
                ${timeframe === t 
                  ? 'bg-[#0066FF] text-white' 
                  : 'bg-transparent text-zinc-400 hover:text-white'}
              `}
            >
              {t === 'WEEKLY' ? (language === 'EN' ? 'Weekly View' : 'Tuần') : (language === 'EN' ? 'Monthly View' : 'Tháng')}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced performance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] p-6 border border-white/5 flex items-center gap-4">
          <span className="p-3 bg-black border border-white/10 text-[#0066FF]">
            <TrendingUp size={20} />
          </span>
          <div>
            <p className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-500">
              {language === 'EN' ? 'Average Order Ticket' : 'Giá Trị Đơn Hàng Trung Bình'}
            </p>
            <p className="font-anton text-2xl text-white tracking-wider mt-1">${avgOrderValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-[#111111] p-6 border border-white/5 flex items-center gap-4">
          <span className="p-3 bg-black border border-white/10 text-emerald-400">
            <Zap size={20} />
          </span>
          <div>
            <p className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-500">
              {language === 'EN' ? 'Total Completed Orders' : 'Tổng Đơn Hoàn Thành'}
            </p>
            <p className="font-anton text-2xl text-white tracking-wider mt-1">{completedOrders.length}</p>
          </div>
        </div>

        <div className="bg-[#111111] p-6 border border-white/5 flex items-center gap-4">
          <span className="p-3 bg-black border border-white/10 text-amber-500">
            <Award size={20} />
          </span>
          <div>
            <p className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-500">
              {language === 'EN' ? 'Customer LTV (Average)' : 'Giá Trị Vòng Đời Khách Hàng'}
            </p>
            <p className="font-anton text-2xl text-white tracking-wider mt-1">${customerLTV.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue trend */}
        <div className="bg-[#111111] border border-white/5 p-6 flex flex-col h-[380px]">
          <h3 className="font-anton text-lg font-bold uppercase tracking-wider text-white mb-6">
            {language === 'EN' ? 'REVENUE DISPATCH VELOCITY' : 'TĂNG TRƯỞNG DOANH THU'}
          </h3>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="month" 
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
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#333', borderRadius: '0px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#0066FF', fontWeight: 'bold' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'Montserrat', textTransform: 'uppercase' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Revenue" 
                  name="REVENUE ($)"
                  stroke="#0066FF" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Valuation breakdown */}
        <div className="bg-[#111111] border border-white/5 p-6 flex flex-col h-[380px]">
          <h3 className="font-anton text-lg font-bold uppercase tracking-wider text-white mb-6">
            {language === 'EN' ? 'CATEGORY INVENTORY VALUE ($)' : 'ĐỊNH GIÁ KHO HÀNG THEO PHÂN LOẠI'}
          </h3>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#333', borderRadius: '0px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#0066FF', fontWeight: 'bold' }}
                />
                <Bar dataKey="Valuation" name="VALUATION ($)" fill="#0066FF">
                  {categoryChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? '#0066FF' : '#8BD2B3'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
