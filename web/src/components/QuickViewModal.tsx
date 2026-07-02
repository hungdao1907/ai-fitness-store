/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { X, Check, ShoppingBag, Info, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Product, CartItem } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [addedStatus, setAddedStatus] = useState(false);

  const sizes = product.id.startsWith("supp-")
    ? ["30 Servings", "60 Servings"]
    : product.id.startsWith("acc-")
    ? ["One Size"]
    : ["S", "M", "L", "XL"];

  const [selectedSize, setSelectedSize] = useState(() => {
    if (product.id.startsWith("supp-")) return "30 Servings";
    if (product.id.startsWith("acc-")) return "One Size";
    return "M";
  });

  // Localize content dynamically from t.products
  const trans = t.products[product.id as keyof typeof t.products];
  const localizedName = trans?.name || product.name;
  const localizedDescription = trans?.description || product.description;
  const localizedDetails = trans?.details || product.details;
  const localizedSpecs = trans?.specs || product.specs;

  const handleAddToCartClick = () => {
    // Pass along mapped product fields for complete consistency
    const finalizedProduct: Product = {
      ...product,
      name: localizedName,
      description: localizedDescription,
      details: localizedDetails,
      specs: localizedSpecs,
    };

    onAddToCart({
      product: finalizedProduct,
      size: selectedSize,
      quantity,
    });
    setAddedStatus(true);
    setTimeout(() => {
      setAddedStatus(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-10"
      />

      {/* Main Dialog Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-[#111111] border border-[#424656]/20 z-20 overflow-y-auto max-h-[90vh] md:max-h-[95vh] rounded-none flex flex-col md:flex-row shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-[#333535]/30 transition-colors z-30"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Image */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-6 md:p-12 relative min-h-[280px] md:min-h-auto border-b md:border-b-0 md:border-r border-[#424656]/15">
          <img
            src={product.image}
            alt={localizedName}
            className="max-h-[300px] md:max-h-[400px] object-contain"
          />
          {product.badge && (
            <span className="absolute top-6 left-6 bg-[#0066ff] text-white font-montserrat text-[9px] font-black tracking-widest px-2.5 py-1 uppercase">
              {product.badge === "BEST SELLER" && language === "vi" ? "BÁN CHẠY NHẤT" : product.badge}
            </span>
          )}
        </div>

        {/* Column 2: Details & Config */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between">
          <div>
            {/* Title & price */}
            <h3 className="font-montserrat text-xl md:text-2xl font-black text-white tracking-wide uppercase mb-1.5">
              {localizedName}
            </h3>
            <p className="font-mono text-[#b3c5ff] text-base font-extrabold tracking-widest mb-6">
              {product.price}
            </p>

            {/* Description */}
            <p className="font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed mb-6">
              {localizedDescription}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="block font-montserrat text-[10px] font-bold text-white tracking-widest uppercase mb-3">
                {language === "vi" ? "LỰA CHỌN KÍCH CỠ" : "CHOOSE SIZE"}
              </label>
              <div className="flex gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-11 flex items-center justify-center font-montserrat text-xs font-bold border transition-colors select-none cursor-pointer ${
                      selectedSize === sz
                        ? "bg-[#0066ff] text-white border-[#0066ff]"
                        : "bg-transparent text-white/80 border-[#424656]/50 hover:border-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Details */}
            <div className="mb-8">
              <label className="block font-montserrat text-[10px] font-bold text-white tracking-widest uppercase mb-3">
                {language === "vi" ? "ĐẶC ĐIỂM CHỦ CHỐT" : "KEY SPECIFICATIONS"}
              </label>
              <ul className="flex flex-col gap-2">
                {localizedDetails.map((bullet, bidx) => (
                  <li
                    key={bidx}
                    className="font-sans text-xs text-[#c2c6d8] leading-relaxed flex items-center gap-2"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#0066ff] shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Matrix Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-black/40 border border-[#424656]/15 mb-8">
              <div>
                <span className="block font-montserrat text-[8px] font-bold text-[#c2c6d8] tracking-widest uppercase">
                  {language === "vi" ? "CHẤT LIỆU" : "MATERIAL"}
                </span>
                <span className="font-sans text-[10px] text-white font-medium max-w-full block truncate">
                  {localizedSpecs.material}
                </span>
              </div>
              <div>
                <span className="block font-montserrat text-[8px] font-bold text-[#c2c6d8] tracking-widest uppercase">
                  {language === "vi" ? "DÁNG PHOM" : "FIT SPEC"}
                </span>
                <span className="font-sans text-[10px] text-white font-medium max-w-full block truncate">
                  {localizedSpecs.fit}
                </span>
              </div>
              <div>
                <span className="block font-montserrat text-[8px] font-bold text-[#c2c6d8] tracking-widest uppercase">
                  {language === "vi" ? "BẢO QUẢN" : "WASH CARE"}
                </span>
                <span className="font-sans text-[10px] text-white font-medium max-w-full block truncate">
                  {localizedSpecs.care}
                </span>
              </div>
            </div>
          </div>

          {/* Action row */}
          <div>
            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span className="font-montserrat text-[10px] font-bold text-white tracking-widest uppercase">
                {language === "vi" ? "SL:" : "QTY:"}
              </span>
              <div className="flex items-center bg-black border border-[#424656]/40">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold text-white w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Submission button */}
            {addedStatus ? (
              <div className="w-full bg-[#15803d] text-white py-4 font-montserrat text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                <Check className="w-4 h-4 animate-bounce" />
                {language === "vi" ? "ĐÃ NẠP THIẾT BỊ VÀO GIỎ HÀNG!" : "LOAD LOADED TO UNIT PAYLOAD!"}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddToCartClick}
                className="w-full bg-[#0066ff] hover:bg-[#0054d6] text-white py-4 font-montserrat text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                {language === "vi" ? "THÊM VÀO GIỎ THIẾT BỊ" : "ADD TO KIT PAYLOAD"}
              </button>
            )}

            <div className="flex items-center gap-1.5 mt-3 justify-center text-[9px] font-mono text-[#c2c6d8]/40 uppercase tracking-wider">
              <Info className="w-3 h-3 text-[#0066ff]" />
              {language === "vi" ? "GIAO THỨC CHUẨN THỬ NGHIỆM ĐƯỢC CHẤP THUẬN" : "STANDARD EXPERIMENT PROTOCOL APPLICABLE"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
