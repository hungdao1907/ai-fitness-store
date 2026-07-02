/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FolderTree, Plus, Trash2, Tag, Calendar } from 'lucide-react';
import { Category } from '../../admin-types';

interface CategoriesViewProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'productCount'>) => void;
  onDeleteCategory: (id: string) => void;
  language: 'EN' | 'VN';
}

export default function CategoriesView({
  categories,
  onAddCategory,
  onDeleteCategory,
  language
}: CategoriesViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddCategory({ name, description });
    setName('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h2 className="font-anton text-3xl font-bold uppercase tracking-tight text-white">
            {language === 'EN' ? 'CATEGORIES ENGINE' : 'PHÂN LOẠI HÀNG HOÁ'}
          </h2>
          <p className="font-roboto text-sm text-zinc-400 mt-1">
            {language === 'EN' 
              ? 'Segment products into high-performance training branches for athletic organization.'
              : 'Phân loại các thiết bị và sản phẩm theo danh mục đào tạo, tập luyện tối ưu.'}
          </p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-3 px-5 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            {language === 'EN' ? 'Add Category' : 'Thêm Danh Mục'}
          </button>
        )}
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/10 p-6 space-y-4">
          <h3 className="font-anton text-lg font-bold uppercase tracking-tight text-[#0066FF]">
            {language === 'EN' ? 'DEFINE NEW CATEGORY SEGMENT' : 'THÊM PHÂN LOẠI MỚI'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Category Label *' : 'Tên phân loại *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Recovery & Mobility"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>

            <div className="space-y-1">
              <label className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {language === 'EN' ? 'Description' : 'Mô tả'}
              </label>
              <input
                type="text"
                placeholder="e.g. Foam rollers, massage guns, stretching bands..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0066FF] font-roboto"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-transparent hover:bg-zinc-900 text-white border border-white/10 font-montserrat text-xs uppercase font-bold tracking-wider py-2 px-4"
            >
              {language === 'EN' ? 'Cancel' : 'Huỷ'}
            </button>
            <button
              type="submit"
              className="bg-[#0066FF] hover:bg-blue-600 text-white font-montserrat text-xs uppercase font-bold tracking-widest py-2 px-5"
            >
              {language === 'EN' ? 'Create Segment' : 'Tạo Phân Loại'}
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="bg-[#111111] border border-white/5 p-6 flex flex-col justify-between group hover:border-[#0066FF] transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-2.5 bg-black border border-white/10 text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white transition-all">
                  <FolderTree size={16} />
                </span>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="text-zinc-500 hover:text-rose-500 transition-colors p-1"
                  title="Delete Category"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h4 className="font-anton text-lg text-white uppercase tracking-wider group-hover:text-[#0066FF] transition-colors">
                {category.name}
              </h4>
              <p className="font-roboto text-xs text-zinc-400 mt-2 min-h-[40px] line-clamp-2">
                {category.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">
                {category.id}
              </span>
              <span className="font-montserrat text-[10px] font-bold tracking-wider uppercase text-zinc-300">
                {category.productCount} {language === 'EN' ? 'Products' : 'Sản phẩm'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
