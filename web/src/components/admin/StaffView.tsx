/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BadgeCheck, Plus, Trash2, Mail, Shield, User, X } from 'lucide-react';
import { Staff } from '../../admin-types';

interface StaffViewProps {
  staffList: Staff[];
  onAddStaff: (staff: Omit<Staff, 'id'>) => void;
  onToggleStaffStatus: (id: string) => void;
  onDeleteStaff: (id: string) => void;
  language: 'EN' | 'VN';
}

export default function StaffView({
  staffList,
  onAddStaff,
  onToggleStaffStatus,
  onDeleteStaff,
  language
}: StaffViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manager' | 'Trainer'>('Trainer');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !username || !staffPassword) return;
    setFormError('');
    setFormLoading(true);

    try {
      const res = await fetch('/api/auth/create-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: staffPassword, name, email, role: role === 'Trainer' ? 'Staff' : role })
      });
      const data = await res.json();
      if (data.success) {
        onAddStaff({
          name,
          email,
          role,
          status: 'Active',
          avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200'
        });
        setName('');
        setEmail('');
        setUsername('');
        setStaffPassword('');
        setRole('Trainer');
        setShowForm(false);
      } else {
        setFormError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setFormError('Connection error.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h2 className="font-anton text-3xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'FACILITY STAFF & CONTROLLERS' : 'ĐỘI NGŨ NHÂN SỰ & QUẢN TRỊ'}
          </h2>
          <p className="font-inter text-sm text-zinc-400 mt-1">
            {language === 'EN' 
              ? 'Create accounts for staff members with login credentials.'
              : 'Tạo tài khoản đăng nhập cho nhân sự với username và mật khẩu.'}
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-[11px] uppercase font-bold tracking-wider py-3 px-5 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} />
            {language === 'EN' ? 'Add Staff' : 'Thêm Nhân Sự'}
          </button>
        )}
      </div>

      {/* Add Staff Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/10 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-anton text-lg font-bold uppercase tracking-tight text-[#0066FF]">
              {language === 'EN' ? 'CREATE STAFF ACCOUNT' : 'TẠO TÀI KHOẢN NHÂN SỰ'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          {formError && (
            <div className="bg-rose-950/30 border border-rose-500/50 text-rose-400 p-3 text-xs font-semibold font-inter">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Full Name *' : 'Họ và tên *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Coach Marcus"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-inter"
              />
            </div>

            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Work Email *' : 'Email Công Việc *'}
              </label>
              <input
                type="email"
                required
                placeholder="marcus@henryfit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-inter"
              />
            </div>

            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Username *' : 'Tên đăng nhập *'}
              </label>
              <input
                type="text"
                required
                placeholder="coach.marcus"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-inter"
              />
            </div>

            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Password *' : 'Mật khẩu *'}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-inter"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {language === 'EN' ? 'Privilege Role' : 'Vai Trò Hệ Thống'}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Staff['role'])}
              className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-montserrat text-xs font-bold uppercase tracking-wider max-w-xs"
            >
              <option value="Trainer">Trainer (PT)</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
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
              disabled={formLoading}
              className={`bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-2 px-5 ${formLoading ? 'opacity-60' : ''}`}
            >
              {formLoading ? '...' : (language === 'EN' ? 'Create Account' : 'Tạo Tài Khoản')}
            </button>
          </div>
        </form>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => {
          const isActive = staff.status === 'Active';
          return (
            <div 
              key={staff.id}
              className={`bg-[#111111] p-6 border transition-all relative flex flex-col justify-between
                ${isActive ? 'border-white/5 hover:border-[#0066FF]' : 'border-white/5 opacity-50 bg-zinc-950/20'}
              `}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={staff.avatar} 
                      alt={staff.name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover border border-white/10 grayscale brightness-90 shrink-0" 
                    />
                    <div>
                      <h4 className="font-anton text-base text-white uppercase tracking-wider">
                        {staff.name}
                      </h4>
                      <span className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-[#0066FF] flex items-center gap-1 mt-0.5">
                        <Shield size={10} />
                        {staff.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onToggleStaffStatus(staff.id)}
                      className={`
                        px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest border transition-all
                        ${isActive 
                          ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white' 
                          : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-[#8BD2B3] hover:text-black'}
                      `}
                      title={isActive ? 'Mark Inactive' : 'Mark Active'}
                    >
                      {isActive ? (language === 'EN' ? 'Deactivate' : 'Khố') : (language === 'EN' ? 'Activate' : 'Mở')}
                    </button>

                    {staff.id !== 'STF-001' && (
                      <button
                        onClick={() => onDeleteStaff(staff.id)}
                        className="text-zinc-500 hover:text-rose-500 p-1.5 bg-zinc-900 border border-white/5 hover:border-rose-500/30 transition-all"
                        title="Remove Staff"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mt-5 bg-black p-3.5 border border-white/5 text-xs font-roboto">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[9px] font-montserrat font-bold uppercase tracking-wider">
                      Work Email
                    </span>
                    <span className="text-zinc-300 font-medium font-mono">{staff.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[9px] font-montserrat font-bold uppercase tracking-wider">
                      Standing
                    </span>
                    <span className={`font-montserrat text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-[#8BD2B3]' : 'text-rose-500'}`}>
                      {staff.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
                <span>LICENSED HENRY FIT PRO</span>
                <span>{staff.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
