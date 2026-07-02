/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Save, ShieldAlert, Check } from 'lucide-react';

interface SettingsViewProps {
  adminName: string;
  setAdminName: (name: string) => void;
  language: 'EN' | 'VN';
}

export default function SettingsView({
  adminName,
  setAdminName,
  language
}: SettingsViewProps) {
  const [name, setName] = useState(adminName);
  const [email, setEmail] = useState('admin@henryfit.com');
  const [storeName, setStoreName] = useState('HENRY FIT');
  const [currency, setCurrency] = useState('USD ($)');
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* View Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h2 className="font-anton text-3xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'SYSTEM SETTINGS' : 'THIẾT LẬP HỆ THỐNG'}
          </h2>
          <p className="font-roboto text-sm text-zinc-400 mt-1">
            {language === 'EN' 
              ? 'Configure facility operational hours, metadata profiles, and security standing.'
              : 'Điều chỉnh cấu hình cửa hàng, thông tin quản trị và cài đặt bảo mật.'}
          </p>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-950/40 border border-[#8BD2B3]/30 text-[#8BD2B3] px-4 py-3.5 text-xs font-montserrat font-bold tracking-wider uppercase flex items-center gap-2">
          <Check size={14} />
          {language === 'EN' ? 'Configuration records successfully compiled!' : 'Cấu hình hệ thống đã được lưu thành công!'}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Admin Profile */}
        <div className="bg-[#111111] p-6 border border-white/5 space-y-6">
          <h3 className="font-anton text-lg font-bold uppercase tracking-tight text-[#0066FF] border-b border-white/5 pb-2.5">
            {language === 'EN' ? 'ADMINISTRATOR CREDENTIALS' : 'HỒ SƠ QUẢN TRỊ VIÊN'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Display Name *' : 'Tên hiển thị *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Recovery Work Email *' : 'Email Công Việc *'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Store Operational Config */}
        <div className="bg-[#111111] p-6 border border-white/5 space-y-6">
          <h3 className="font-anton text-lg font-bold uppercase tracking-tight text-[#0066FF] border-b border-white/5 pb-2.5">
            {language === 'EN' ? 'STORE PROFILE & STANDING' : 'THÔNG TIN CỬA HÀNG & HOẠT ĐỘNG'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Global Brand Name' : 'Tên thương hiệu'}
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-anton tracking-wider uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Primary Base Currency' : 'Đơn vị tiền tệ chính'}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-montserrat text-xs font-bold uppercase tracking-wider"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="VND (đ)">VND (đ)</option>
                <option value="EUR (€)">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Advanced Security standing */}
        <div className="bg-[#111111] p-6 border border-white/5 space-y-4">
          <h3 className="font-anton text-lg font-bold uppercase tracking-tight text-[#0066FF] border-b border-white/5 pb-2.5">
            {language === 'EN' ? 'SYSTEM SECURITY PROTOCOLS' : 'BẢO MẬT HỆ THỐNG'}
          </h3>

          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              id="securityToggle"
              checked={securityEnabled}
              onChange={(e) => setSecurityEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 bg-black border-white/15 text-[#0066FF] focus:ring-0"
            />
            <div>
              <label htmlFor="securityToggle" className="font-montserrat text-xs font-bold uppercase tracking-wider text-white cursor-pointer select-none">
                {language === 'EN' ? 'Enable Multi-Factor authentication (MFA) mock audits' : 'Kích hoạt xác thực 2 lớp (MFA) thử nghiệm'}
              </label>
              <p className="font-roboto text-xs text-zinc-500 mt-1 leading-relaxed">
                {language === 'EN'
                  ? 'Verify terminal authenticity before login attempts. Recommended for training security compliance.'
                  : 'Xác thực độ tin cậy của thiết bị trước khi đăng nhập. Khuyến nghị cho bảo mật doanh nghiệp.'}
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 px-8 flex items-center gap-2"
          >
            <Save size={16} />
            {language === 'EN' ? 'Commit Changes' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
