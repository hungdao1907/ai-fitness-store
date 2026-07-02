/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Mail, DollarSign, Calendar, ShieldAlert, CheckCircle2, UserX } from 'lucide-react';
import { Customer } from '../../admin-types';

interface CustomersViewProps {
  customers: Customer[];
  onToggleCustomerStatus: (id: string) => void;
  searchQuery: string;
  language: 'EN' | 'VN';
}

export default function CustomersView({
  customers,
  onToggleCustomerStatus,
  searchQuery,
  language
}: CustomersViewProps) {

  const filteredCustomers = customers.filter(c => {
    const sQuery = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(sQuery) || 
           c.email.toLowerCase().includes(sQuery) ||
           c.id.toLowerCase().includes(sQuery);
  });

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h2 className="font-anton text-3xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'ATHLETE MEMBERS DIRECTORY' : 'QUẢN LÝ THÀNH VIÊN / HỘI VIÊN'}
          </h2>
          <p className="font-roboto text-sm text-zinc-400 mt-1">
            {language === 'EN' 
              ? `Manage registered athletes profiles, total coaching investments, and account standings.`
              : `Tra cứu danh sách hội viên, lịch sử chi tiêu, và điều hành trạng thái tài khoản.`}
          </p>
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-[#111111] p-10 text-center border border-white/5 text-zinc-500 font-roboto text-sm">
            {language === 'EN' ? 'No customers found.' : 'Không tìm thấy hội viên nào.'}
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const isActive = customer.status === 'Active';
            return (
              <div 
                key={customer.id} 
                className={`bg-[#111111] p-6 border transition-all relative flex flex-col justify-between
                  ${isActive ? 'border-white/5 hover:border-[#0066FF]' : 'border-rose-950 bg-rose-950/5'}
                `}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`p-2.5 bg-black border ${isActive ? 'border-white/10 text-[#0066FF]' : 'border-rose-500/30 text-rose-500'}`}>
                      <Users size={16} />
                    </span>

                    <button
                      onClick={() => onToggleCustomerStatus(customer.id)}
                      className={`
                        flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest border transition-all
                        ${isActive 
                          ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500' 
                          : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-[#8BD2B3] hover:text-black hover:border-[#8BD2B3]'}
                      `}
                      title={isActive ? 'Suspend Account' : 'Activate Account'}
                    >
                      {isActive ? <UserX size={10} /> : <CheckCircle2 size={10} />}
                      {isActive ? (language === 'EN' ? 'Suspend' : 'Khoá') : (language === 'EN' ? 'Activate' : 'Mở')}
                    </button>
                  </div>

                  <h4 className="font-anton text-lg text-white uppercase tracking-wider">
                    {customer.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1.5 font-roboto">
                    <Mail size={12} className="text-zinc-600" />
                    <span>{customer.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 bg-black p-4 border border-white/5">
                    <div>
                      <p className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-500">
                        {language === 'EN' ? 'Total Investments' : 'Đã đầu tư'}
                      </p>
                      <p className="font-anton text-lg text-white tracking-wider mt-1.5">
                        ${customer.totalSpend.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-500">
                        {language === 'EN' ? 'Orders Count' : 'Tổng Đơn'}
                      </p>
                      <p className="font-anton text-lg text-white tracking-wider mt-1.5">
                        {customer.orderCount} {language === 'EN' ? 'Orders' : 'Đơn'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-roboto">
                    <Calendar size={11} />
                    <span>Joined {customer.joinDate}</span>
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-wider
                    ${isActive ? 'text-zinc-600' : 'text-rose-500 font-bold'}
                  `}>
                    {customer.id}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
