/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Warehouse, AlertTriangle, ArrowUpDown, ChevronUp, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { Product } from '../../admin-types';

interface InventoryViewProps {
  products: Product[];
  onUpdateStock: (id: string, newStock: number) => void;
  language: 'EN' | 'VN';
}

export default function InventoryView({
  products,
  onUpdateStock,
  language
}: InventoryViewProps) {
  const [threshold, setThreshold] = useState<number>(5);
  const [search, setSearch] = useState('');
  
  // Stats calculations
  const physicalItems = products.filter(p => p.category !== 'Programs'); // Programs are digital
  const totalStockUnits = physicalItems.reduce((sum, p) => sum + p.stock, 0);
  const totalValuation = physicalItems.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const outOfStockItems = physicalItems.filter(p => p.stock === 0);
  const lowStockItems = physicalItems.filter(p => p.stock > 0 && p.stock <= threshold);

  const filteredItems = physicalItems.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleStockChange = (id: string, current: number, change: number) => {
    const nextVal = Math.max(0, current + change);
    onUpdateStock(id, nextVal);
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
        <div>
          <h2 className="font-anton text-3xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'INVENTORY CONTROL HUB' : 'QUẢN LÝ KHO HÀNG VÀ CẢNH BÁO'}
          </h2>
          <p className="font-roboto text-sm text-zinc-400 mt-1">
            {language === 'EN' 
              ? 'Real-time stock ledger, physical equipment audits, and automatic critical threshold alerts.'
              : 'Sổ cái tồn kho theo thời gian thực, điều hòa vật tư, thiết bị tập và thiết lập ngưỡng an toàn.'}
          </p>
        </div>

        {/* Dynamic Threshold config */}
        <div className="flex items-center gap-3 bg-[#111111] border border-white/10 px-4 py-2">
          <span className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            {language === 'EN' ? 'Alert Threshold:' : 'Ngưỡng cảnh báo:'}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setThreshold(Math.max(1, threshold - 1))}
              className="text-zinc-400 hover:text-white p-1"
            >
              <ChevronDown size={14} />
            </button>
            <span className="font-anton text-white text-base tracking-wider px-1 w-6 text-center">
              {threshold}
            </span>
            <button 
              onClick={() => setThreshold(threshold + 1)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <ChevronUp size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111111] p-5 border border-white/5">
          <p className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-500">
            {language === 'EN' ? 'Total Units Stocked' : 'Tổng sản phẩm trong kho'}
          </p>
          <p className="font-anton text-3xl text-white mt-1">{totalStockUnits.toLocaleString()}</p>
        </div>

        <div className="bg-[#111111] p-5 border border-white/5">
          <p className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-500">
            {language === 'EN' ? 'Total Inventory Valuation' : 'Giá trị tồn kho'}
          </p>
          <p className="font-anton text-3xl text-[#0066FF] mt-1">${totalValuation.toLocaleString()}</p>
        </div>

        <div className={`p-5 border ${outOfStockItems.length > 0 ? 'bg-rose-950/10 border-rose-500/20' : 'bg-[#111111] border-white/5'}`}>
          <p className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-500">
            {language === 'EN' ? 'Out of Stock Items' : 'Sản phẩm hết hàng'}
          </p>
          <p className={`font-anton text-3xl mt-1 ${outOfStockItems.length > 0 ? 'text-rose-500' : 'text-white'}`}>
            {outOfStockItems.length}
          </p>
        </div>

        <div className={`p-5 border ${lowStockItems.length > 0 ? 'bg-amber-950/10 border-amber-500/20' : 'bg-[#111111] border-white/5'}`}>
          <p className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-500">
            {language === 'EN' ? 'Low Stock Warnings' : 'Cảnh báo sắp hết'}
          </p>
          <p className={`font-anton text-3xl mt-1 ${lowStockItems.length > 0 ? 'text-amber-500 font-bold' : 'text-white'}`}>
            {lowStockItems.length}
          </p>
        </div>
      </div>

      {/* Critical stock alert screen */}
      {(outOfStockItems.length > 0 || lowStockItems.length > 0) && (
        <div className="bg-rose-950/10 border border-rose-500/30 p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle size={18} className="animate-bounce" />
            <span className="font-anton text-sm uppercase tracking-wider">
              {language === 'EN' ? 'INVENTORY DEPLETION RISK STATUS' : 'CẢNH BÁO NGUY CƠ HẾT HÀNG'}
            </span>
          </div>
          <p className="font-roboto text-xs text-zinc-400">
            {language === 'EN'
              ? 'The following hardware SKUs are critically below the configured threshold and require urgent replenishment to preserve checkout services.'
              : 'Các mã sản phẩm dưới đây đang ở dưới ngưỡng tồn kho an toàn, cần nhập thêm hàng để tránh gián đoạn dịch vụ bán lẻ.'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {[...outOfStockItems, ...lowStockItems].map(item => (
              <span 
                key={item.id} 
                className={`font-montserrat text-[9px] uppercase font-bold tracking-wider px-3 py-1 border
                  ${item.stock === 0 
                    ? 'bg-rose-950 text-rose-400 border-rose-500/40' 
                    : 'bg-amber-950 text-amber-400 border-amber-500/40'}
                `}
              >
                {item.name} ({item.stock} {language === 'EN' ? 'left' : 'còn'})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Stock Adjuster Table */}
      <div className="bg-[#111111] border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-zinc-900/30 flex justify-between items-center flex-wrap gap-4">
          <h3 className="font-montserrat text-xs uppercase font-bold tracking-widest text-zinc-300 flex items-center gap-2">
            <Warehouse size={14} className="text-[#0066FF]" />
            {language === 'EN' ? 'REALTIME STOCK LEDGER' : 'SỔ CÁI ĐIỀU CHỈNH KHO'}
          </h3>
          
          <input 
            type="text"
            placeholder={language === 'EN' ? "Filter ledger items..." : "Tìm sản phẩm..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0066FF] w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black">
                <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Product SKU / ID' : 'Mã Sản Phẩm / ID'}
                </th>
                <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Name' : 'Tên'}
                </th>
                <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Unit Price' : 'Đơn Giá'}
                </th>
                <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 text-center">
                  {language === 'EN' ? 'Adjust Stock Level' : 'Điều Chỉnh Tồn Kho'}
                </th>
                <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Security Standing' : 'Trạng Thái An Toàn'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map(item => {
                const isOutOfStock = item.stock === 0;
                const isLowStock = item.stock > 0 && item.stock <= threshold;

                return (
                  <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="p-4 font-mono text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      {item.id}
                    </td>
                    <td className="p-4">
                      <div className="font-anton text-sm tracking-wider text-white uppercase">{item.name}</div>
                      <div className="font-roboto text-xs text-zinc-500 mt-0.5">{item.category}</div>
                    </td>
                    <td className="p-4 font-montserrat text-xs font-semibold text-white">
                      ${item.price}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleStockChange(item.id, item.stock, -1)}
                          className="w-8 h-8 bg-black border border-white/10 hover:border-[#0066FF] text-white font-bold flex items-center justify-center hover:text-[#0066FF] transition-all"
                        >
                          -
                        </button>
                        <span className="font-anton text-base tracking-wider text-white w-10 text-center">
                          {item.stock}
                        </span>
                        <button
                          onClick={() => handleStockChange(item.id, item.stock, 1)}
                          className="w-8 h-8 bg-black border border-white/10 hover:border-[#0066FF] text-white font-bold flex items-center justify-center hover:text-[#0066FF] transition-all"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      {isOutOfStock ? (
                        <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-rose-500 bg-rose-950/20 border border-rose-500/30 px-2.5 py-1">
                          Depleted
                        </span>
                      ) : isLowStock ? (
                        <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-amber-500 bg-amber-950/20 border border-amber-500/30 px-2.5 py-1">
                          Low Warning
                        </span>
                      ) : (
                        <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 px-2.5 py-1">
                          Secure Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
