/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Percent, Plus, Trash2, Calendar, ShieldAlert, Tag, Power } from 'lucide-react';
import { Promotion } from '../../admin-types';

interface PromotionsViewProps {
  promotions: Promotion[];
  onAddPromotion: (promo: Omit<Promotion, 'id' | 'useCount'>) => void;
  onTogglePromotionStatus: (id: string) => void;
  onDeletePromotion: (id: string) => void;
  language: 'EN' | 'VN';
}

export default function PromotionsView({
  promotions,
  onAddPromotion,
  onTogglePromotionStatus,
  onDeletePromotion,
  language
}: PromotionsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'Percentage' | 'Flat'>('Percentage');
  const [value, setValue] = useState<number | ''>('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || value === '' || !start || !end) return;

    onAddPromotion({
      code: code.toUpperCase().replace(/\s+/g, ''),
      discountType: type,
      discountValue: Number(value),
      status: 'Active',
      startDate: start,
      endDate: end
    });

    setCode('');
    setValue('');
    setStart('');
    setEnd('');
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h2 className="font-anton text-3xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'CAMPAIGNS & PROMOTIONS' : 'MÃ KHUYẾN MÃI / ƯU ĐÃI'}
          </h2>
          <p className="font-roboto text-sm text-zinc-400 mt-1">
            {language === 'EN' 
              ? 'Formulate athletic discount coupons, seasonal loyalty codes, and track redemption.'
              : 'Thiết lập các mã giảm giá cho hội viên, chiến dịch tri ân và đo lường lượt sử dụng.'}
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3 px-5 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            {language === 'EN' ? 'Add Promo Code' : 'Tạo Mã Giảm Giá'}
          </button>
        )}
      </div>

      {/* Add Promotion Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/10 p-6 space-y-4">
          <h3 className="font-anton text-lg font-bold uppercase tracking-tight text-[#0066FF]">
            {language === 'EN' ? 'LAUNCH NEW CAMPAIGN COUPON' : 'THÔNG TIN CHƯƠNG TRÌNH KHUYẾN MÃI'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Promo Code *' : 'Mã Giảm Giá *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SUMMER15"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>

            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Discount Type' : 'Loại Giảm Giá'}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'Percentage' | 'Flat')}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-montserrat text-xs font-bold uppercase tracking-wider"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Flat">Flat Amount ($)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Discount Value *' : 'Mức Giảm *'}
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder={type === 'Percentage' ? "e.g. 15" : "e.g. 25"}
                value={value}
                onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>

            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Start Date *' : 'Ngày Bắt Đầu *'}
              </label>
              <input
                type="date"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>

            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Expiration Date *' : 'Ngày Hết Hạn *'}
              </label>
              <input
                type="date"
                required
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-transparent hover:bg-zinc-900 text-white border border-white/10 font-montserrat text-xs uppercase font-bold tracking-wider py-2 px-4"
            >
              {language === 'EN' ? 'Cancel' : 'Huỷ'}
            </button>
            <button
              type="submit"
              className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-2 px-5"
            >
              {language === 'EN' ? 'Deploy Code' : 'Áp Dụng Mã'}
            </button>
          </div>
        </form>
      )}

      {/* Promotions List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => {
          const isActive = promo.status === 'Active';
          return (
            <div 
              key={promo.id}
              className={`bg-[#111111] p-6 border transition-all relative flex flex-col justify-between
                ${isActive ? 'border-white/5 hover:border-[#0066FF]' : 'border-white/5 opacity-50 bg-zinc-950/20'}
              `}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2.5 bg-black border border-white/10 text-[#0066FF]">
                    <Percent size={16} />
                  </span>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => onTogglePromotionStatus(promo.id)}
                      className={`p-1.5 bg-zinc-900 border border-white/5 hover:border-white/20 transition-all
                        ${isActive ? 'text-emerald-400 hover:text-amber-500' : 'text-zinc-600 hover:text-emerald-400'}
                      `}
                      title={isActive ? 'Mark Expired' : 'Mark Active'}
                    >
                      <Power size={13} />
                    </button>
                    <button
                      onClick={() => onDeletePromotion(promo.id)}
                      className="text-zinc-500 hover:text-rose-500 p-1.5 bg-zinc-900 border border-white/5 hover:border-white/20 transition-all"
                      title="Delete Promo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <h4 className="font-anton text-xl text-white uppercase tracking-wider">
                    {promo.code}
                  </h4>
                  <span className={`font-montserrat text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 border
                    ${isActive ? 'text-[#8BD2B3] border-emerald-500/30 bg-emerald-950/20' : 'text-rose-500 border-rose-500/30 bg-rose-950/20'}
                  `}>
                    {promo.status}
                  </span>
                </div>

                <p className="font-roboto text-sm font-semibold text-zinc-300 mt-2.5">
                  {promo.discountType === 'Percentage' 
                    ? `${promo.discountValue}% Off Total Order` 
                    : `$${promo.discountValue} Flat Discount`}
                </p>

                <div className="mt-5 bg-black p-3.5 border border-white/5 flex justify-between items-center text-xs font-roboto">
                  <span className="text-zinc-500 uppercase tracking-wider text-[9px] font-montserrat font-bold">
                    {language === 'EN' ? 'Times Redeemed' : 'Lượt Sử Dụng'}
                  </span>
                  <span className="font-anton text-sm text-white tracking-wider">
                    {promo.useCount} times
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-roboto">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  <span>Exp: {promo.endDate}</span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider">
                  {promo.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
