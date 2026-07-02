/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Globe, Check, User, Mail, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: 'Admin' | 'Staff', name: string) => void;
  onMemberLoginSuccess?: (name: string, email: string) => void;
  language: 'EN' | 'VN';
  setLanguage: (lang: 'EN' | 'VN') => void;
}

export default function LoginView({ onLogin, onMemberLoginSuccess, language, setLanguage }: LoginViewProps) {
  // Modes
  const [portalMode, setPortalMode] = useState<'member' | 'admin'>('member');
  const [memberAuthMode, setMemberAuthMode] = useState<'login' | 'register' | 'otp'>('login');

  // Admin state
  const [username, setUsername] = useState('');
  
  // Shared password
  const [password, setPassword] = useState('');
  
  // Member state
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.role as 'Admin' | 'Staff', data.name);
      } else {
        setErrorMsg(data.error || (language === 'EN' ? 'Login failed.' : 'Đăng nhập thất bại.'));
      }
    } catch (err) {
      setErrorMsg(language === 'EN' ? 'Connection error. Please try again.' : 'Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: memberEmail, password })
      });
      const data = await res.json();
      if (data.success) {
        if (onMemberLoginSuccess) {
          onMemberLoginSuccess(data.name, data.email);
        }
      } else {
        if (data.error?.includes('verify')) {
          setMemberAuthMode('otp');
          setErrorMsg(language === 'EN' ? 'Please verify your OTP first.' : 'Vui lòng xác thực OTP trước.');
        } else {
          setErrorMsg(data.error || 'Login failed.');
        }
      }
    } catch (err) {
      setErrorMsg(language === 'EN' ? 'Connection error.' : 'Lỗi kết nối.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/member/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: memberName, email: memberEmail, password })
      });
      const data = await res.json();
      if (data.success) {
        setMemberAuthMode('otp');
        setSuccessMsg(language === 'EN' ? 'OTP sent to your email.' : 'Mã OTP đã được gửi đến email của bạn.');
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg(language === 'EN' ? 'Connection error.' : 'Lỗi kết nối.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/member/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: memberEmail, otp })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          setMemberAuthMode('login');
          setSuccessMsg('');
          setPassword('');
        }, 2000);
      } else {
        setErrorMsg(data.error || 'Verification failed.');
      }
    } catch (err) {
      setErrorMsg(language === 'EN' ? 'Connection error.' : 'Lỗi kết nối.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col md:flex-row relative">
      {/* Left side: Visual brand container */}
      <div className="relative w-full md:w-1/2 min-h-[40vh] md:min-h-screen overflow-hidden flex flex-col justify-between p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" 
            alt="Gym Lifter"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale brightness-40 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/85" />
        </div>

        <div className="relative z-10">
          <h1 className="font-anton text-3xl font-bold tracking-widest text-white uppercase">
            HENRY FIT
          </h1>
        </div>

        <div className="relative z-10 mt-auto pt-16 md:pt-0">
          <h2 className="font-anton text-5xl md:text-7xl lg:text-8xl text-white tracking-wider leading-none uppercase select-none">
            {language === 'EN' ? 'WELCOME BACK' : 'CHÀO MỪNG'}
          </h2>
          <p className="font-roboto text-sm md:text-base text-zinc-300 mt-4 max-w-md tracking-wide">
            {portalMode === 'admin' 
              ? (language === 'EN' ? 'Manage your Henry Fit store with absolute confidence.' : 'Quản lý cửa hàng với hiệu suất vượt trội.')
              : (language === 'EN' ? 'Log in to manage your orders and profile.' : 'Đăng nhập để theo dõi đơn hàng và thành viên.')}
          </p>
        </div>
      </div>

      {/* Right side: Login Form Panel */}
      <div className="w-full md:w-1/2 min-h-[60vh] md:min-h-screen bg-black flex flex-col justify-center items-center p-6 md:p-16 relative">
        
        {/* Form Container */}
        <div className="w-full max-w-[460px] bg-[#111111] border border-white/10 p-8 md:p-10 space-y-6">
          
          <div className="flex gap-4 border-b border-white/10 pb-4 mb-6">
            <button
              onClick={() => { setPortalMode('member'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`font-montserrat text-[10px] font-bold tracking-widest uppercase transition-colors ${portalMode === 'member' ? 'text-[#0066FF]' : 'text-zinc-500 hover:text-white'}`}
            >
              {language === 'EN' ? 'Customer' : 'Khách hàng'}
            </button>
            <button
              onClick={() => { setPortalMode('admin'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`font-montserrat text-[10px] font-bold tracking-widest uppercase transition-colors ${portalMode === 'admin' ? 'text-[#0066FF]' : 'text-zinc-500 hover:text-white'}`}
            >
              {language === 'EN' ? 'Staff & Admin' : 'Nhân viên'}
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="font-montserrat text-2xl font-bold uppercase tracking-tight text-white">
              {portalMode === 'admin' 
                ? (language === 'EN' ? 'System Portal' : 'Cổng Quản Trị')
                : (memberAuthMode === 'login' ? (language === 'EN' ? 'Sign In' : 'Đăng nhập') : memberAuthMode === 'register' ? (language === 'EN' ? 'Create Account' : 'Tạo Tài Khoản') : (language === 'EN' ? 'Verify OTP' : 'Xác thực OTP'))
              }
            </h3>
            <p className="font-roboto text-xs text-zinc-400">
              {portalMode === 'admin'
                ? (language === 'EN' ? 'Sign in to manage the store.' : 'Đăng nhập để quản trị cửa hàng.')
                : (language === 'EN' ? 'Access your Henry Fit account.' : 'Truy cập tài khoản Henry Fit của bạn.')
              }
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-950/30 border border-rose-500/50 text-rose-400 p-3 text-xs font-semibold font-roboto">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-950/30 border border-emerald-500/50 text-emerald-400 p-3 text-xs font-semibold font-roboto">
              {successMsg}
            </div>
          )}

          {/* ADMIN FORM */}
          {portalMode === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-400 block">
                  {language === 'EN' ? 'Username' : 'Tên đăng nhập'}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0066FF] font-inter"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-400 block">
                  {language === 'EN' ? 'Password' : 'Mật khẩu'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#0066FF] hover:bg-blue-600 active:scale-[0.99] text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 transition-all ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (language === 'EN' ? 'Authenticating...' : 'Đang xác thực...') : (language === 'EN' ? 'Login' : 'Đăng nhập')}
                </button>

                <button
                  type="button"
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-transparent hover:bg-zinc-900 border border-white/10 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 transition-all"
                >
                  {language === 'EN' ? 'Back to Store' : 'Quay lại cửa hàng'}
                </button>
              </div>
            </form>
          )}

          {/* MEMBER FORM */}
          {portalMode === 'member' && (
            <>
              {memberAuthMode === 'login' && (
                <form onSubmit={handleMemberLogin} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Email Address' : 'Địa chỉ Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0066FF] font-inter"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Password' : 'Mật khẩu'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-[#0066FF] hover:bg-blue-600 active:scale-[0.99] text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 transition-all ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (language === 'EN' ? 'Authenticating...' : 'Đang xác thực...') : (language === 'EN' ? 'Login' : 'Đăng nhập')}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => { setMemberAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                      className="w-full bg-transparent hover:bg-zinc-900 border border-white/10 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 transition-all"
                    >
                      {language === 'EN' ? 'Create Account' : 'Tạo tài khoản'}
                    </button>

                    <button
                      type="button"
                      onClick={() => window.location.href = '/'}
                      className="w-full bg-transparent hover:text-[#0066FF] text-zinc-500 font-montserrat text-[10px] uppercase font-bold tracking-widest pt-4 transition-all"
                    >
                      {language === 'EN' ? 'Back to Store' : 'Quay lại cửa hàng'}
                    </button>
                  </div>
                </form>
              )}

              {memberAuthMode === 'register' && (
                <form onSubmit={handleMemberRegister} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Full Name' : 'Họ và tên'}
                    </label>
                    <input
                      type="text"
                      required
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0066FF] font-inter"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Email Address' : 'Địa chỉ Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0066FF] font-inter"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Password' : 'Mật khẩu'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-[#0066FF] hover:bg-blue-600 active:scale-[0.99] text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 transition-all ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (language === 'EN' ? 'Creating...' : 'Đang tạo...') : (language === 'EN' ? 'Register' : 'Đăng ký')}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => { setMemberAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                      className="w-full bg-transparent hover:bg-zinc-900 border border-white/10 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 transition-all"
                    >
                      {language === 'EN' ? 'Back to Login' : 'Quay lại đăng nhập'}
                    </button>
                  </div>
                </form>
              )}

              {memberAuthMode === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[9px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'OTP Code' : 'Mã Xác Thực OTP'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      className="w-full bg-black border border-white/15 px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold text-white focus:outline-none focus:border-[#0066FF] font-inter"
                    />
                    <p className="text-[10px] text-zinc-500 font-inter mt-2">
                      {language === 'EN' ? `Sent to ${memberEmail}` : `Đã gửi đến ${memberEmail}`}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 transition-all ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (language === 'EN' ? 'Verifying...' : 'Đang kiểm tra...') : (language === 'EN' ? 'Verify Code' : 'Xác thực mã')}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => { setMemberAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                      className="w-full bg-transparent hover:bg-zinc-900 border border-white/10 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3.5 transition-all"
                    >
                      {language === 'EN' ? 'Back to Login' : 'Quay lại đăng nhập'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

        </div>

        {/* Page absolute footer */}
        <div className="w-full max-w-[460px] md:max-w-none md:absolute md:bottom-0 md:left-0 md:right-0 p-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-montserrat font-bold tracking-widest text-zinc-500 gap-4">
          <div className="flex items-center gap-2">
            <Globe size={11} className="text-[#0066FF]" />
            <button 
              onClick={() => setLanguage('EN')} 
              className={`hover:text-white ${language === 'EN' ? 'text-white underline underline-offset-4' : ''}`}
            >
              EN
            </button>
            <span>/</span>
            <button 
              onClick={() => setLanguage('VN')} 
              className={`hover:text-white ${language === 'VN' ? 'text-white underline underline-offset-4' : ''}`}
            >
              VN
            </button>
            <span className="text-zinc-700 ml-2">|</span>
            <span className="text-zinc-400">© 2026 HENRY FIT.</span>
          </div>

          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">
              {language === 'EN' ? 'PRIVACY POLICY' : 'CHÍNH SÁCH BẢO MẬT'}
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              {language === 'EN' ? 'TERMS OF SERVICE' : 'ĐIỀU KHOẢN DỊCH VỤ'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
