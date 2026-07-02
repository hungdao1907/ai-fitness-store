/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

import { Product, Category, Order, Customer, Promotion, Staff, TabType } from '../../admin-types';
import { useTheme } from '../../context/ThemeContext';

// Component imports
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import LoginView from '../../components/admin/LoginView';
import DashboardView from '../../components/admin/DashboardView';
import ProductsView from '../../components/admin/ProductsView';
import CategoriesView from '../../components/admin/CategoriesView';
import OrdersView from '../../components/admin/OrdersView';
import CustomersView from '../../components/admin/CustomersView';
import InventoryView from '../../components/admin/InventoryView';
import PromotionsView from '../../components/admin/PromotionsView';
import StaffView from '../../components/admin/StaffView';
import AnalyticsView from '../../components/admin/AnalyticsView';
import SettingsView from '../../components/admin/SettingsView';

export default function AdminApp() {
  const { isDark } = useTheme();
  // Authentication & Global state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('hf_logged_in');
    return saved === 'true';
  });

  const [userRole, setUserRole] = useState<'Admin' | 'Staff'>(() => {
    const saved = localStorage.getItem('hf_user_role');
    return (saved as 'Admin' | 'Staff') || 'Admin';
  });

  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [language, setLanguage] = useState<'EN' | 'VN'>('EN');
  const [adminName, setAdminName] = useState<string>(() => {
    const savedName = localStorage.getItem('hf_user_name');
    if (savedName) return savedName;
    const savedRole = localStorage.getItem('hf_user_role');
    return savedRole === 'Staff' ? 'Coach Marcus' : 'Henry Peterson';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [openCreateProduct, setOpenCreateProduct] = useState<boolean>(false);

  // Core Data models (initially fallback to client-side localStorage/INITIAL mock data, then synced from real Prisma database)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hf_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('hf_categories');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hf_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('hf_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('hf_promotions');
    return saved ? JSON.parse(saved) : [];
  });

  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('hf_staff');
    return saved ? JSON.parse(saved) : [];
  });

  // Load real data from Prisma SQLite database on component mount
  const fetchAllData = async () => {
    try {
      const [resProd, resCat, resOrd, resCust, resPromo, resStaff] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/customers').then(r => r.json()),
        fetch('/api/promotions').then(r => r.json()),
        fetch('/api/staff').then(r => r.json())
      ]);

      if (Array.isArray(resProd)) setProducts(resProd);
      if (Array.isArray(resCat)) setCategories(resCat);
      if (Array.isArray(resOrd)) setOrders(resOrd);
      if (Array.isArray(resCust)) setCustomers(resCust);
      if (Array.isArray(resPromo)) setPromotions(resPromo);
      if (Array.isArray(resStaff)) setStaffList(resStaff);
    } catch (err) {
      console.error("Error fetching data from Prisma backend:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync state to local storage as fallback/cache
  useEffect(() => {
    localStorage.setItem('hf_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('hf_user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('hf_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hf_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('hf_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hf_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('hf_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('hf_staff', JSON.stringify(staffList));
  }, [staffList]);

  // Handlers for Products (synchronizing to Prisma DB)
  const handleAddProduct = async (newProd: Omit<Product, 'id'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (res.ok) {
        const created = await res.json();
        setProducts(prev => [created, ...prev]);
        // Refresh categories count
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(cats);
        }
      }
    } catch (err) {
      console.error("Error adding product to Prisma DB:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        // Refresh categories count
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(cats);
        }
      }
    } catch (err) {
      console.error("Error deleting product from Prisma DB:", err);
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
      }
    } catch (err) {
      console.error("Error updating stock in Prisma DB:", err);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const res = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updated : p));
        // Refresh categories count
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(cats);
        }
      }
    } catch (err) {
      console.error("Error updating product in Prisma DB:", err);
    }
  };

  // Handlers for Categories
  const handleAddCategory = async (newCat: Omit<Category, 'id' | 'productCount'>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
      if (res.ok) {
        const created = await res.json();
        setCategories(prev => [...prev, created]);
      }
    } catch (err) {
      console.error("Error adding category to Prisma DB:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error("Error deleting category from Prisma DB:", err);
    }
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === id ? updated : o));
      }
    } catch (err) {
      console.error("Error updating order status in Prisma DB:", err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
      }
    } catch (err) {
      console.error("Error deleting order from Prisma DB:", err);
    }
  };

  // Handlers for Customers
  const handleToggleCustomerStatus = async (id: string) => {
    try {
      const customerObj = customers.find(c => c.id === id);
      if (!customerObj) return;
      const nextStatus = customerObj.status === 'Active' ? 'Suspended' : 'Active';
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setCustomers(prev => prev.map(c => c.id === id ? updated : c));
      }
    } catch (err) {
      console.error("Error toggling customer status in Prisma DB:", err);
    }
  };

  // Handlers for Promotions
  const handleAddPromotion = async (newPromo: Omit<Promotion, 'id' | 'useCount'>) => {
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromo)
      });
      if (res.ok) {
        const created = await res.json();
        setPromotions(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error("Error adding promotion to Prisma DB:", err);
    }
  };

  const handleTogglePromotionStatus = async (id: string) => {
    try {
      const promoObj = promotions.find(p => p.id === id);
      if (!promoObj) return;
      const nextStatus = promoObj.status === 'Active' ? 'Expired' : 'Active';
      const res = await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setPromotions(prev => prev.map(p => p.id === id ? updated : p));
      }
    } catch (err) {
      console.error("Error toggling promotion status in Prisma DB:", err);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPromotions(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting promotion from Prisma DB:", err);
    }
  };

  // Handlers for Staff
  const handleAddStaff = async (newStaff: Omit<Staff, 'id'>) => {
    try {
      // Re-fetch the list from DB since StaffView already created it via /api/auth/create-staff
      const res = await fetch('/api/staff');
      if (res.ok) {
        const list = await res.json();
        setStaffList(list);
      }
    } catch (err) {
      console.error("Error refreshing staff list:", err);
    }
  };

  const handleToggleStaffStatus = async (id: string) => {
    try {
      const staffObj = staffList.find(s => s.id === id);
      if (!staffObj) return;
      const nextStatus = staffObj.status === 'Active' ? 'Inactive' : 'Active';
      const res = await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setStaffList(prev => prev.map(s => s.id === id ? updated : s));
      }
    } catch (err) {
      console.error("Error toggling staff status in Prisma DB:", err);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStaffList(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error("Error deleting staff from Prisma DB:", err);
    }
  };

  // Render proper content view based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardView 
            products={products} 
            orders={orders} 
            customers={customers} 
            onNewProduct={() => {
              setActiveTab('Products');
              setOpenCreateProduct(true);
            }}
            language={language}
          />
        );
      case 'Products':
        return (
          <ProductsView 
            products={products} 
            categories={categories} 
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateStock={handleUpdateStock}
            onUpdateProduct={handleUpdateProduct}
            searchQuery={searchQuery}
            language={language}
            openCreateImmediately={openCreateProduct}
            setOpenCreateImmediately={setOpenCreateProduct}
            userRole={userRole}
          />
        );
      case 'Categories':
        return (
          <CategoriesView 
            categories={categories} 
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            language={language}
          />
        );
      case 'Orders':
        return (
          <OrdersView 
            orders={orders} 
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            searchQuery={searchQuery}
            language={language}
          />
        );
      case 'Customers':
        return (
          <CustomersView 
            customers={customers} 
            onToggleCustomerStatus={handleToggleCustomerStatus}
            searchQuery={searchQuery}
            language={language}
          />
        );
      case 'Inventory':
        return (
          <InventoryView 
            products={products} 
            onUpdateStock={handleUpdateStock}
            language={language}
          />
        );
      case 'Promotions':
        return (
          <PromotionsView 
            promotions={promotions} 
            onAddPromotion={handleAddPromotion}
            onTogglePromotionStatus={handleTogglePromotionStatus}
            onDeletePromotion={handleDeletePromotion}
            language={language}
          />
        );
      case 'Staff':
        if (userRole === 'Staff') return <div className="text-rose-500 p-8 font-montserrat font-bold uppercase">{language === 'EN' ? 'Access Denied: Admin privileges required.' : 'Truy cập bị từ chối: Yêu cầu quyền quản trị viên.'}</div>;
        return (
          <StaffView 
            staffList={staffList} 
            onAddStaff={handleAddStaff}
            onToggleStaffStatus={handleToggleStaffStatus}
            onDeleteStaff={handleDeleteStaff}
            language={language}
          />
        );
      case 'Analytics':
        if (userRole === 'Staff') return <div className="text-rose-500 p-8 font-montserrat font-bold uppercase">{language === 'EN' ? 'Access Denied: Admin privileges required.' : 'Truy cập bị từ chối: Yêu cầu quyền quản trị viên.'}</div>;
        return (
          <AnalyticsView 
            products={products} 
            orders={orders} 
            categories={categories} 
            customers={customers}
            language={language}
          />
        );
      case 'Settings':
        if (userRole === 'Staff') return <div className="text-rose-500 p-8 font-montserrat font-bold uppercase">{language === 'EN' ? 'Access Denied: Admin privileges required.' : 'Truy cập bị từ chối: Yêu cầu quyền quản trị viên.'}</div>;
        return (
          <SettingsView 
            adminName={adminName} 
            setAdminName={setAdminName} 
            language={language}
          />
        );
      default:
        return null;
    }
  };

  // If not logged in, render the gorgeous Admin Login page
  if (!isLoggedIn) {
    return (
      <LoginView 
        onLogin={(role, name) => {
          setIsLoggedIn(true);
          setUserRole(role);
          setAdminName(name);
          localStorage.setItem('hf_logged_in', 'true');
          localStorage.setItem('hf_user_role', role);
          localStorage.setItem('hf_user_name', name);
        }} 
        language={language}
        setLanguage={setLanguage}
        onMemberLoginSuccess={(name, email) => {
          const session = { name, email };
          localStorage.setItem('hf_member_session', JSON.stringify(session));
          window.location.href = '/';
        }}
      />
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => {
          setIsLoggedIn(false);
          setUserRole('Admin');
          localStorage.removeItem('hf_user_role');
        }}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col md:ml-64 overflow-hidden transition-colors ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        {/* Top Header bar */}
        <Header 
          onMenuToggle={() => setMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          language={language}
          setLanguage={setLanguage}
          adminName={adminName}
          userRole={userRole}
        />

        {/* Scrollable Main tab */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 no-scrollbar">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
