/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Eye, ChevronDown, Check, X, Clock, Trash2, Search } from 'lucide-react';
import { Order } from '../../admin-types';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
  searchQuery: string;
  language: 'EN' | 'VN';
}

export default function OrdersView({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  searchQuery,
  language
}: OrdersViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');

  const filteredOrders = orders.filter(o => {
    // Search query matches
    const sQuery = searchQuery.toLowerCase();
    const matchesSearch = o.customerName.toLowerCase().includes(sQuery) || 
                          o.id.toLowerCase().includes(sQuery) ||
                          o.customerEmail.toLowerCase().includes(sQuery);

    // Status filter matches
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
        <div>
          <h2 className="font-anton text-3xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'ORDERS MANAGEMENT' : 'QUẢN LÝ ĐƠN HÀNG'}
          </h2>
          <p className="font-roboto text-sm text-zinc-400 mt-1">
            {language === 'EN' 
              ? 'Process transactions, verify trainer plans activations, and dispatch physical equipment.'
              : 'Xử lý các giao dịch, thanh toán khoá học, giáo án huấn luyện và thiết bị tập.'}
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {(['All', 'Pending', 'Completed', 'Cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`
                px-4 py-1.5 font-montserrat text-[10px] uppercase font-bold tracking-wider border transition-all
                ${statusFilter === filter 
                  ? 'bg-white border-white text-black' 
                  : 'bg-transparent border-white/10 text-zinc-400 hover:text-white hover:border-white/20'}
              `}
            >
              {filter === 'All' ? (language === 'EN' ? 'All Transactions' : 'Tất Cả') : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Structure */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Table list - Takes 2 cols if order selected, else takes full */}
        <div className={`bg-[#111111] border border-white/5 overflow-hidden transition-all duration-300
          ${selectedOrder ? 'xl:col-span-2' : 'xl:col-span-3'}
        `}>
          <div className="p-4 border-b border-white/5 bg-zinc-900/30">
            <h3 className="font-montserrat text-xs uppercase font-bold tracking-widest text-zinc-300 flex items-center gap-2">
              <ShoppingCart size={14} className="text-[#0066FF]" />
              {language === 'EN' ? 'CUSTOMER ORDER DATABASE' : 'LỊCH SỬ GIAO DỊCH KHÁCH HÀNG'}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black">
                  <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    {language === 'EN' ? 'Order ID' : 'Mã Đơn'}
                  </th>
                  <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    {language === 'EN' ? 'Customer' : 'Khách Hàng'}
                  </th>
                  <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    {language === 'EN' ? 'Date' : 'Ngày đặt'}
                  </th>
                  <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    {language === 'EN' ? 'Total' : 'Tổng Tiền'}
                  </th>
                  <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    {language === 'EN' ? 'Status' : 'Trạng thái'}
                  </th>
                  <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 text-right">
                    {language === 'EN' ? 'Actions' : 'Thao tác'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-zinc-500 font-roboto text-sm">
                      {language === 'EN' ? 'No orders matches selection.' : 'Không có đơn hàng nào khớp.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr 
                        key={order.id} 
                        className={`hover:bg-zinc-900/30 transition-all cursor-pointer
                          ${isSelected ? 'bg-zinc-900/50 border-l-4 border-l-[#0066FF]' : ''}
                        `}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="p-4 font-mono text-xs font-bold text-white uppercase tracking-wider">
                          #{order.id}
                        </td>
                        <td className="p-4">
                          <div className="font-montserrat text-xs font-bold text-white">{order.customerName}</div>
                          <div className="font-roboto text-[11px] text-zinc-500 mt-0.5">{order.customerEmail}</div>
                        </td>
                        <td className="p-4 font-roboto text-xs text-zinc-400">
                          {order.date}
                        </td>
                        <td className="p-4 font-montserrat text-xs font-bold text-[#0066FF]">
                          ${order.total.toLocaleString()}
                        </td>
                        <td className="p-4">
                          {order.status === 'Completed' ? (
                            <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-[#8BD2B3] bg-emerald-950/20 border border-emerald-500/30 px-2.5 py-1">
                              Completed
                            </span>
                          ) : order.status === 'Pending' ? (
                            <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-amber-500 bg-amber-950/20 border border-amber-500/30 px-2.5 py-1">
                              Pending
                            </span>
                          ) : (
                            <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-rose-500 bg-rose-950/20 border border-rose-500/30 px-2.5 py-1">
                              Cancelled
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-zinc-400 hover:text-white p-1.5 bg-zinc-900 border border-white/5 hover:border-white/20"
                              title="Inspect Details"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => onDeleteOrder(order.id)}
                              className="text-zinc-500 hover:text-rose-500 p-1.5 bg-zinc-900 border border-white/5 hover:border-white/20"
                              title="Delete Transaction"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Drawer Panel (Takes 1 col) */}
        {selectedOrder && (
          <div className="bg-[#111111] border border-[#0066FF] p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-anton text-lg text-white uppercase tracking-wider">
                  {language === 'EN' ? 'TRANSACTION SPEC SHEET' : 'CHI TIẾT GIAO DỊCH'}
                </h4>
                <p className="font-mono text-[10px] text-zinc-500 mt-0.5">#{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick status management */}
            <div className="bg-black p-4 border border-white/5 space-y-2">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                {language === 'EN' ? 'CHANGE ORDER STATUS' : 'CẬP NHẬT TRẠNG THÁI'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateOrderStatus(selectedOrder.id, 'Completed')}
                  className="flex-1 bg-emerald-950/50 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/20 py-2 text-[9px] font-bold tracking-wider uppercase font-montserrat flex items-center justify-center gap-1.5"
                >
                  <Check size={11} />
                  Complete
                </button>
                <button
                  onClick={() => onUpdateOrderStatus(selectedOrder.id, 'Pending')}
                  className="flex-1 bg-amber-950/50 hover:bg-amber-900 text-amber-500 border border-amber-500/20 py-2 text-[9px] font-bold tracking-wider uppercase font-montserrat flex items-center justify-center gap-1.5"
                >
                  <Clock size={11} />
                  Pending
                </button>
                <button
                  onClick={() => onUpdateOrderStatus(selectedOrder.id, 'Cancelled')}
                  className="flex-1 bg-rose-950/50 hover:bg-rose-900 text-rose-500 border border-rose-500/20 py-2 text-[9px] font-bold tracking-wider uppercase font-montserrat flex items-center justify-center gap-1.5"
                >
                  <X size={11} />
                  Cancel
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-500 block border-b border-white/5 pb-1">
                {language === 'EN' ? 'ATHLETE INFORMATION' : 'THÔNG TIN THÀNH VIÊN'}
              </span>
              <div>
                <p className="font-montserrat text-xs font-bold text-white uppercase">{selectedOrder.customerName}</p>
                <p className="font-roboto text-xs text-zinc-400 mt-0.5">{selectedOrder.customerEmail}</p>
                <p className="font-roboto text-[11px] text-zinc-500 mt-2">
                  {language === 'EN' ? 'Payment: ' : 'Thanh toán: '}
                  <span className="text-white font-semibold font-montserrat uppercase text-[10px] tracking-wider">
                    {selectedOrder.paymentMethod}
                  </span>
                </p>
                <p className="font-roboto text-[11px] text-zinc-500">
                  {language === 'EN' ? 'Date Purchased: ' : 'Thời gian: '}
                  <span className="text-white font-semibold font-montserrat uppercase text-[10px] tracking-wider">
                    {selectedOrder.date}
                  </span>
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-500 block border-b border-white/5 pb-1">
                {language === 'EN' ? 'LINE ITEMS BREAKDOWN' : 'CHI TIẾT SẢN PHẨM MUA'}
              </span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-anton text-[11px] text-white tracking-wider uppercase">{item.productName}</p>
                      <p className="font-roboto text-[10px] text-zinc-400 mt-0.5">
                        ${item.price} x {item.quantity}
                      </p>
                    </div>
                    <span className="font-montserrat font-bold text-white">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-white/10 pt-4 flex justify-between items-center bg-black p-4 border border-white/5">
              <span className="font-montserrat text-xs font-bold tracking-wider uppercase text-zinc-400">
                {language === 'EN' ? 'Total Amount' : 'Tổng Đơn'}
              </span>
              <span className="font-anton text-xl tracking-wider text-[#0066FF]">
                ${selectedOrder.total.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
