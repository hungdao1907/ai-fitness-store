/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Search, 
  Edit2, 
  Check, 
  X, 
  Tag, 
  Copy, 
  BarChart3, 
  RefreshCw, 
  ArrowUpFromLine, 
  Download, 
  Eye, 
  Settings, 
  Upload 
} from 'lucide-react';
import { Product, Category } from '../../admin-types';

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onUpdateProduct?: (product: Product) => void;
  searchQuery: string;
  language: 'EN' | 'VN';
  openCreateImmediately?: boolean;
  setOpenCreateImmediately?: (val: boolean) => void;
  userRole?: 'Admin' | 'Staff';
}

export default function ProductsView({
  products,
  categories,
  onAddProduct,
  onDeleteProduct,
  onUpdateStock,
  onUpdateProduct,
  searchQuery,
  language,
  openCreateImmediately = false,
  setOpenCreateImmediately,
  userRole = 'Admin'
}: ProductsViewProps) {
  const [showAddForm, setShowAddForm] = useState(openCreateImmediately);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Equipment');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [image, setImage] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<number>(0);

  // Synchronization & Toast State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Product Details / Edit Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditingInModal, setIsEditingInModal] = useState<boolean>(false);
  
  // Modal Form State
  const [modalName, setModalName] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [modalPrice, setModalPrice] = useState<number | ''>('');
  const [modalStock, setModalStock] = useState<number | ''>('');
  const [modalStatus, setModalStatus] = useState<'Active' | 'Low Stock' | 'Out of Stock' | 'Draft'>('Active');
  const [modalImage, setModalImage] = useState('');

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(
        language === 'EN' ? 'Product database re-synchronized.' : 'Đồng bộ danh sách sản phẩm thành công.',
        'success'
      );
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === '' || stock === '') return;

    onAddProduct({
      name: name.toUpperCase(),
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      image: image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
      status: Number(stock) === 0 ? 'Out of Stock' : Number(stock) <= 5 ? 'Low Stock' : 'Active'
    });

    // Reset Form
    setName('');
    setDescription('');
    setCategory(categories[0]?.name || 'Equipment');
    setPrice('');
    setStock('');
    setImage('');
    setShowAddForm(false);
    if (setOpenCreateImmediately) {
      setOpenCreateImmediately(false);
    }
    showToast(
      language === 'EN' ? 'Product created successfully' : 'Tạo sản phẩm thành công',
      'success'
    );
  };

  const startEditingStock = (p: Product) => {
    setEditingId(p.id);
    setEditingStock(p.stock);
  };

  const saveStockEdit = (id: string) => {
    onUpdateStock(id, editingStock);
    setEditingId(null);
    showToast(
      language === 'EN' ? 'Inventory stock level updated' : 'Đã cập nhật số lượng tồn kho',
      'success'
    );
  };

  const handleDuplicateProduct = (prod: Product) => {
    onAddProduct({
      name: `${prod.name} (COPY)`,
      description: prod.description,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      image: prod.image,
      status: prod.status
    });
    showToast(
      language === 'EN' ? `Duplicated product "${prod.name}" successfully` : `Nhân bản sản phẩm "${prod.name}" thành công`,
      'success'
    );
  };

  const handleOpenDetails = (prod: Product) => {
    setSelectedProduct(prod);
    setIsEditingInModal(false);
    setModalName(prod.name);
    setModalDescription(prod.description);
    setModalCategory(prod.category);
    setModalPrice(prod.price);
    setModalStock(prod.stock);
    setModalStatus(prod.status);
    setModalImage(prod.image);
  };

  const handleSaveModalEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!modalName || modalPrice === '' || modalStock === '') return;

    if (onUpdateProduct) {
      onUpdateProduct({
        id: selectedProduct.id,
        name: modalName.toUpperCase(),
        description: modalDescription,
        category: modalCategory,
        price: Number(modalPrice),
        stock: Number(modalStock),
        image: modalImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
        status: modalStatus
      });
    } else {
      // Fallback update stock
      onUpdateStock(selectedProduct.id, Number(modalStock));
    }

    showToast(
      language === 'EN' ? 'Product information updated' : 'Đã cập nhật thông tin sản phẩm',
      'success'
    );
    setSelectedProduct(null);
  };

  const handleSimulateUpload = () => {
    const fitnessImages = [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600'
    ];
    const randomImg = fitnessImages[Math.floor(Math.random() * fitnessImages.length)];
    setImage(randomImg);
    showToast(
      language === 'EN' ? 'Simulated image upload completed!' : 'Đã tải ảnh lên (giả lập thành công)!',
      'success'
    );
  };

  const handleSimulateUploadInModal = () => {
    const fitnessImages = [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600'
    ];
    const randomImg = fitnessImages[Math.floor(Math.random() * fitnessImages.length)];
    setModalImage(randomImg);
    showToast(
      language === 'EN' ? 'Simulated image upload completed!' : 'Đã tải ảnh lên (giả lập thành công)!',
      'success'
    );
  };

  const filteredProducts = products.filter(p => {
    const sQuery = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(sQuery) || 
                          p.description.toLowerCase().includes(sQuery) || 
                          p.category.toLowerCase().includes(sQuery);
    return matchesSearch;
  });

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 bg-[#111111] border-l-4 border-[#0066FF] text-white px-5 py-3 shadow-2xl z-55 font-montserrat text-xs uppercase font-bold tracking-wider flex items-center gap-2 animate-bounce">
          <Check size={14} className="text-[#0066FF]" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* View Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10 flex-wrap gap-4">
        <div>
          <h2 className="font-anton text-3xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'PRODUCTS PORTFOLIO' : 'DANH MỤC SẢN PHẨM'}
          </h2>
          <p className="font-roboto text-sm text-zinc-400 mt-1">
            {language === 'EN' 
              ? `Manage and monitor active training inventory items (${filteredProducts.length} visible).`
              : `Quản lý và cập nhật vật tư, thiết bị tập luyện (${filteredProducts.length} sản phẩm).`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshData}
            className="bg-transparent hover:bg-zinc-900 text-white border border-white/10 font-montserrat text-xs uppercase font-bold tracking-widest py-3 px-4 transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#0066FF]' : ''} />
            {language === 'EN' ? 'Refresh' : 'Làm mới'}
          </button>

          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3 px-5 transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              {language === 'EN' ? 'Add Product' : 'Thêm Sản Phẩm'}
            </button>
          )}
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/10 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-anton text-xl font-bold uppercase tracking-tight text-[#0066FF]">
              {language === 'EN' ? 'CREATE NEW INVENTORY RECORD' : 'NHẬP THÔNG TIN SẢN PHẨM MỚI'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                if (setOpenCreateImmediately) setOpenCreateImmediately(false);
              }}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                {language === 'EN' ? 'Product Name *' : 'Tên sản phẩm *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ULTRA GRIP LIFTING BELT"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                {language === 'EN' ? 'Category *' : 'Phân loại *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-montserrat uppercase font-semibold text-xs tracking-wider"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                {language === 'EN' ? 'Price (USD) *' : 'Giá tiền (USD) *'}
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 120"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                {language === 'EN' ? 'Initial Stock Level *' : 'Số lượng tồn kho ban đầu *'}
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 50"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                {language === 'EN' ? 'Image URL (optional)' : 'Đường dẫn ảnh sản phẩm (tuỳ chọn)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
                />
                <button
                  type="button"
                  onClick={handleSimulateUpload}
                  className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-montserrat text-[10px] uppercase font-bold px-3 py-2 flex items-center gap-1 shrink-0"
                  title={language === 'EN' ? 'Upload Presets' : 'Tải lên (giả lập)'}
                >
                  <Upload size={12} />
                  {language === 'EN' ? 'Simulate Upload' : 'Tải lên'}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                {language === 'EN' ? 'Technical Specifications & Description' : 'Thông số kỹ thuật & Mô tả sản phẩm'}
              </label>
              <textarea
                rows={3}
                placeholder="Provide physical parameters, material composite, size breakdowns, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                if (setOpenCreateImmediately) setOpenCreateImmediately(false);
              }}
              className="bg-transparent hover:bg-zinc-900 text-white border border-white/10 font-montserrat text-xs uppercase font-bold tracking-wider py-3 px-6"
            >
              {language === 'EN' ? 'Cancel' : 'Huỷ bỏ'}
            </button>
            <button
              type="submit"
              className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3 px-6"
            >
              {language === 'EN' ? 'Save Record' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      )}

      {/* Products Table Card */}
      <div className="bg-[#111111] border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-zinc-900/30 flex justify-between items-center flex-wrap gap-4">
          <h3 className="font-montserrat text-xs uppercase font-bold tracking-widest text-zinc-300 flex items-center gap-2">
            <ShoppingBag size={14} className="text-[#0066FF]" />
            {language === 'EN' ? 'PRODUCTS INVENTORY LIST' : 'DANH SÁCH THIẾT BỊ TRONG KHO'}
          </h3>

          {/* Admin exclusive functions hidden for Staff */}
          {userRole !== 'Staff' && (
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => showToast(language === 'EN' ? 'Import products simulation triggered.' : 'Bắt đầu quá trình nạp dữ liệu...', 'info')}
                className="bg-zinc-950 hover:bg-zinc-900 border border-white/10 text-white font-montserrat text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 transition-all flex items-center gap-1.5"
              >
                <ArrowUpFromLine size={12} />
                {language === 'EN' ? 'Import' : 'Nhập file'}
              </button>
              <button 
                onClick={() => showToast(language === 'EN' ? 'Exporting inventory database to Microsoft Excel...' : 'Đang chuyển đổi và xuất tệp Excel...', 'info')}
                className="bg-zinc-950 hover:bg-zinc-900 border border-white/10 text-white font-montserrat text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 transition-all flex items-center gap-1.5"
              >
                <Download size={12} />
                {language === 'EN' ? 'Export Excel' : 'Xuất Excel'}
              </button>
              <button 
                onClick={() => showToast(language === 'EN' ? 'Restoring previously deleted product records...' : 'Đang khôi phục toàn bộ dữ liệu lưu trữ tạm...', 'info')}
                className="bg-zinc-950 hover:bg-zinc-900 border border-white/10 text-white font-montserrat text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 transition-all flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                {language === 'EN' ? 'Restore Deleted' : 'Khôi phục'}
              </button>
              <button 
                onClick={() => showToast(language === 'EN' ? 'Select rows and confirm bulk delete operations.' : 'Vui lòng chọn các mục cần xoá hàng loạt.', 'info')}
                className="bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/30 text-rose-400 font-montserrat text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 transition-all flex items-center gap-1.5"
              >
                <Trash2 size={12} />
                {language === 'EN' ? 'Bulk Delete' : 'Xoá nhiều'}
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black">
                <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Item Details' : 'Chi tiết sản phẩm'}
                </th>
                <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Category' : 'Phân loại'}
                </th>
                <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Price' : 'Giá bán'}
                </th>
                <th className="p-4 font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {language === 'EN' ? 'Stock Level' : 'Tồn kho'}
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-zinc-500 font-roboto text-sm">
                    {language === 'EN' ? 'No products matches your search filter.' : 'Không tìm thấy sản phẩm nào phù hợp.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-900/30 transition-colors">
                    {/* Item details */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover border border-white/10 grayscale brightness-90 hover:grayscale-0 transition-all shrink-0" 
                        />
                        <div className="cursor-pointer" onClick={() => handleOpenDetails(product)}>
                          <p className="font-anton text-sm tracking-wider text-white uppercase hover:text-[#0066FF] transition-colors">{product.name}</p>
                          <p className="font-roboto text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-[280px]">
                            {product.description}
                          </p>
                          <p className="font-mono text-[9px] text-zinc-600 tracking-wider mt-0.5 uppercase">{product.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="font-montserrat text-[10px] uppercase font-semibold text-zinc-300 tracking-wider px-2 py-1 bg-zinc-900 border border-white/5">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-montserrat text-sm font-bold text-white">
                      ${product.price.toLocaleString()}
                    </td>

                    {/* Stock Level (Inline editable) */}
                    <td className="p-4">
                      {editingId === product.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={editingStock}
                            onChange={(e) => setEditingStock(Number(e.target.value))}
                            className="w-16 bg-black border border-[#0066FF] p-1 text-xs text-white text-center focus:outline-none"
                          />
                          <button
                            onClick={() => saveStockEdit(product.id)}
                            className="p-1 bg-emerald-950 text-emerald-400 hover:bg-[#8BD2B3] hover:text-black transition-colors"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <span className={`font-montserrat text-sm font-bold ${product.stock === 0 ? 'text-rose-500' : 'text-white'}`}>
                            {product.stock}
                          </span>
                          <button
                            onClick={() => startEditingStock(product)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-[#0066FF] transition-all p-0.5"
                            title="Edit Stock"
                          >
                            <Edit2 size={11} />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {product.stock === 0 ? (
                        <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-rose-500 bg-rose-950/20 border border-rose-500/30 px-2.5 py-1">
                          {language === 'EN' ? 'Out of Stock' : 'Hết hàng'}
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-amber-500 bg-amber-950/20 border border-amber-500/30 px-2.5 py-1">
                          {language === 'EN' ? 'Low Stock' : 'Sắp hết'}
                        </span>
                      ) : (
                        <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-[#8BD2B3] bg-emerald-950/20 border border-emerald-500/30 px-2.5 py-1">
                          {language === 'EN' ? 'Active' : 'Đang bán'}
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Details edit is accessible to BOTH Admin and Staff */}
                        <button
                          onClick={() => handleOpenDetails(product)}
                          className="text-zinc-500 hover:text-[#0066FF] transition-colors p-1.5"
                          title={language === 'EN' ? "View Details & Edit" : "Xem & Sửa thông tin"}
                        >
                          <Eye size={14} />
                        </button>

                        {/* Admin Exclusive Row Actions hidden for Staff */}
                        {userRole !== 'Staff' && (
                          <>
                            <button
                              onClick={() => handleDuplicateProduct(product)}
                              className="text-zinc-500 hover:text-blue-500 transition-colors p-1.5"
                              title={language === 'EN' ? "Duplicate" : "Nhân bản"}
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              onClick={() => showToast(language === 'EN' ? `Opening analytics for "${product.name}"` : `Mở báo cáo thống kê cho "${product.name}"`, 'info')}
                              className="text-zinc-500 hover:text-emerald-500 transition-colors p-1.5"
                              title={language === 'EN' ? "Product Analytics" : "Thống kê sản phẩm"}
                            >
                              <BarChart3 size={13} />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(product.id)}
                              className="text-zinc-500 hover:text-rose-500 transition-colors p-1.5"
                              title={language === 'EN' ? "Delete Product" : "Xoá sản phẩm"}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details & Edit Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-white/10 w-full max-w-2xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div className="border-b border-white/10 pb-4">
              <span className="font-mono text-[10px] text-[#0066FF] tracking-widest uppercase font-bold">
                {selectedProduct.id}
              </span>
              <h3 className="font-anton text-2xl font-bold uppercase tracking-tight text-white mt-1">
                {isEditingInModal ? (language === 'EN' ? 'EDIT PRODUCT INFORMATION' : 'SỬA THÔNG TIN SẢN PHẨM') : (language === 'EN' ? 'PRODUCT DETAILED SPECIFICATIONS' : 'CHI TIẾT SẢN PHẨM')}
              </h3>
            </div>

            {!isEditingInModal ? (
              /* View Mode */
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full md:w-48 h-48 object-cover border border-white/10 grayscale brightness-90 shrink-0"
                  />
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                        {language === 'EN' ? 'Product Name' : 'Tên sản phẩm'}
                      </h4>
                      <p className="font-anton text-lg text-white uppercase mt-1">{selectedProduct.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                          {language === 'EN' ? 'Category' : 'Phân loại'}
                        </h4>
                        <p className="font-montserrat text-xs uppercase font-semibold text-zinc-300 tracking-wider mt-1">
                          {selectedProduct.category}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                          {language === 'EN' ? 'Price' : 'Giá bán'}
                        </h4>
                        <p className="font-montserrat text-sm font-bold text-white mt-1">
                          ${selectedProduct.price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                          {language === 'EN' ? 'Stock Level' : 'Tồn kho'}
                        </h4>
                        <p className="font-montserrat text-sm font-bold text-white mt-1">
                          {selectedProduct.stock} units
                        </p>
                      </div>
                      <div>
                        <h4 className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                          {language === 'EN' ? 'Status' : 'Trạng thái'}
                        </h4>
                        <span className="inline-block mt-1">
                          {selectedProduct.stock === 0 ? (
                            <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-rose-500 bg-rose-950/20 border border-rose-500/30 px-2 py-0.5">
                              {language === 'EN' ? 'Out of Stock' : 'Hết hàng'}
                            </span>
                          ) : selectedProduct.stock <= 5 ? (
                            <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-amber-500 bg-amber-950/20 border border-amber-500/30 px-2 py-0.5">
                              {language === 'EN' ? 'Low Stock' : 'Sắp hết'}
                            </span>
                          ) : (
                            <span className="font-montserrat text-[8px] uppercase font-bold tracking-widest text-[#8BD2B3] bg-emerald-950/20 border border-emerald-500/30 px-2 py-0.5">
                              {language === 'EN' ? 'Active' : 'Đang bán'}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    {language === 'EN' ? 'Specifications & Technical details' : 'Thông số kỹ thuật & Mô tả chi tiết'}
                  </h4>
                  <p className="font-roboto text-sm text-zinc-300 mt-1 leading-relaxed">
                    {selectedProduct.description || (language === 'EN' ? 'No specifications provided.' : 'Chưa có mô tả kỹ thuật.')}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="bg-transparent hover:bg-zinc-900 text-white border border-white/10 font-montserrat text-xs uppercase font-bold tracking-wider py-2.5 px-5"
                  >
                    {language === 'EN' ? 'Close' : 'Đóng'}
                  </button>
                  <button
                    onClick={() => setIsEditingInModal(true)}
                    className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-2.5 px-5 transition-all flex items-center gap-1.5"
                  >
                    <Edit2 size={12} />
                    {language === 'EN' ? 'Edit Information' : 'Sửa Thông Tin'}
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSaveModalEdit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Product Name *' : 'Tên sản phẩm *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Category *' : 'Phân loại *'}
                    </label>
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-montserrat uppercase font-semibold text-xs tracking-wider"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Price (USD) *' : 'Giá tiền (USD) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={modalPrice}
                      onChange={(e) => setModalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Stock Level *' : 'Số lượng tồn kho *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={modalStock}
                      onChange={(e) => setModalStock(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Product Status *' : 'Trạng thái *'}
                    </label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value as any)}
                      className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-montserrat uppercase font-semibold text-xs tracking-wider"
                    >
                      <option value="Active">{language === 'EN' ? 'Active' : 'Đang bán'}</option>
                      <option value="Draft">{language === 'EN' ? 'Draft' : 'Bản nháp'}</option>
                      <option value="Low Stock">{language === 'EN' ? 'Low Stock' : 'Sắp hết'}</option>
                      <option value="Out of Stock">{language === 'EN' ? 'Out of Stock' : 'Hết hàng'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Product Image' : 'Ảnh sản phẩm'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={modalImage}
                        onChange={(e) => setModalImage(e.target.value)}
                        className="flex-1 bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
                      />
                      <button
                        type="button"
                        onClick={handleSimulateUploadInModal}
                        className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-montserrat text-[10px] uppercase font-bold px-3 py-2 flex items-center gap-1 shrink-0"
                        title={language === 'EN' ? 'Upload Presets' : 'Tải lên (giả lập)'}
                      >
                        <Upload size={12} />
                        {language === 'EN' ? 'Upload' : 'Tải lên'}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                      {language === 'EN' ? 'Technical Specifications & Description' : 'Thông số kỹ thuật & Mô tả sản phẩm'}
                    </label>
                    <textarea
                      rows={3}
                      value={modalDescription}
                      onChange={(e) => setModalDescription(e.target.value)}
                      className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsEditingInModal(false)}
                    className="bg-transparent hover:bg-zinc-900 text-white border border-white/10 font-montserrat text-xs uppercase font-bold tracking-wider py-2.5 px-5"
                  >
                    {language === 'EN' ? 'Back' : 'Quay lại'}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-2.5 px-5 transition-all"
                  >
                    {language === 'EN' ? 'Save Changes' : 'Lưu Thay Đổi'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
