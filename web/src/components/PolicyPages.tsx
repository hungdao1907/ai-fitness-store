/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, ShieldAlert, ArrowLeft, Truck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface PolicyPagesProps {
  pageType: "shipping" | "privacy" | "terms";
  onNavigate: (path: string) => void;
}

export default function PolicyPages({ pageType, onNavigate }: PolicyPagesProps) {
  const { language, t } = useLanguage();

  const renderContent = () => {
    switch (pageType) {
      case "shipping":
        return {
          title: language === "vi" ? "CHÍNH SÁCH VẬN CHUYỂN" : "SHIPPING & DELIVERY CODES",
          icon: <Truck className="w-10 h-10 text-[#0066ff]" />,
          text: (
            <div className="space-y-6 font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed">
              <section>
                <h3 className="font-montserrat text-white font-bold text-xs uppercase tracking-widest mb-2">
                  {language === "vi" ? "1. QUY TRÌNH KIỂM TRA CHẤT LƯỢNG TIÊN QUYẾT" : "1. PRE-DEPARTURE QUALITY CHECKS"}
                </h3>
                <p>
                  {language === "vi"
                    ? "Tất cả đai bọc tạ và áo dệt ép lực cao cấp sẽ trải qua quy trình ép khí lực kéo trước khi đóng gói kín chân không để bảo vệ chất gỗ, màu chỉ, dệt may nguyên trạng."
                    : "Prior to shipment, every high-tensile lifter belt and compression garment goes through comprehensive force calibration and vacuum-scaled airtight packing to preserve fabric integrity."}
                </p>
              </section>
              <section>
                <h3 className="font-montserrat text-white font-bold text-xs uppercase tracking-widest mb-2">
                  {language === "vi" ? "2. THỜI GIAN VẬN CHUYỂN DỰ KIẾN" : "2. TIMELINE ESTIMATE COEFFICIENTS"}
                </h3>
                <p>
                  {language === "vi"
                    ? "Đơn hàng nội địa tiêu chuẩn được vận chuyển nội bộ và giao trong 2-4 ngày làm việc. Các đơn vận chuyển quốc tế có thể dao động từ 7 đến 14 ngày tùy thuộc vào điểm kiểm soát hải quan."
                    : "Standard logistics will deliver domestic mainland parcels within 2-4 business days. Trans-border shipments typically arrive in 7-14 business days subject to customs authority clearances."}
                </p>
              </section>
              <section>
                <h3 className="font-montserrat text-white font-bold text-xs uppercase tracking-widest mb-2">
                  {language === "vi" ? "3. THEO DÕI LOGISTICS TRỰC TUYẾN" : "3. REAL-TIME TELEMETRY TRACKING"}
                </h3>
                <p>
                  {language === "vi"
                    ? "Mã vận đơn điện tử sẽ được gởi qua email của bạn ngay sau khi bưu kiện rời khỏi kho bãi Henry Fit Performance Lab để bạn có thể quản lý hành trình bưu kiện."
                    : "An electronic tracking number will be dispatched to your coordinates once the payload departs our logistics bay. Use our secure terminal to inspect location status."}
                </p>
              </section>
            </div>
          ),
        };

      case "privacy":
        return {
          title: language === "vi" ? "CHÍNH SÁCH BẢO MẬT" : "PRIVACY & INTEGRITY PROTOCOLS",
          icon: <FileText className="w-10 h-10 text-[#0066ff]" />,
          text: (
            <div className="space-y-6 font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed">
              <section>
                <h3 className="font-montserrat text-white font-bold text-xs uppercase tracking-widest mb-2">
                  {language === "vi" ? "1. THU THẬP VÀ MÃ HÓA THÔNG TIN" : "1. DATA HARVESTING & ENCRYPTION"}
                </h3>
                <p>
                  {language === "vi"
                    ? "Chúng tôi chỉ thu thập họ tên, email, và địa chỉ bưu cục một cách minh bạch nhằm cấu hình hóa đơn giao nhận và lịch sử nạp sản phẩm. Tuyệt đối không lưu giữ thông tin thẻ thanh toán của bạn."
                    : "We collect only minimal billing coordinates, emails and delivery locations specifically to calibrate secure checkout invoices. We encrypt and store nothing related to payment card methods."}
                </p>
              </section>
              <section>
                <h3 className="font-montserrat text-white font-bold text-xs uppercase tracking-widest mb-2">
                  {language === "vi" ? "2. VẬN HÀNH THÔNG TIN AI AN TOÀN" : "2. AI INTERACTION SAFETY DEPLOYMENTS"}
                </h3>
                <p>
                  {language === "vi"
                    ? "Toàn bộ hội thoại tư vấn lập luyện cùng cố vấn AI được thực hiện ẩn danh, xử lý trên luồng máy chủ bảo mật trung gian và không lưu trữ vĩnh viễn trên máy chủ bên thứ ba."
                    : "All AI gym advice queries are treated anonymously. Dialog logs are securely routed through server proxy parameters and are never distributed to advertiser databases."}
                </p>
              </section>
            </div>
          ),
        };

      case "terms":
      default:
        return {
          title: language === "vi" ? "ĐIỀU KHOẢN DỊCH VỤ" : "TERMS OF ATHLETIC SERVICE",
          icon: <ShieldAlert className="w-10 h-10 text-[#0066ff]" />,
          text: (
            <div className="space-y-6 font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed">
              <section>
                <h3 className="font-montserrat text-white font-bold text-xs uppercase tracking-widest mb-2">
                  {language === "vi" ? "1. QUY CÁCH SỬ DỤNG AN TOÀN SẢN PHẨM" : "1. PRODUCT APPLICATION & LIABILITY"}
                </h3>
                <p>
                  {language === "vi"
                    ? "Đai lưng Henry Fit 10mm được thiết kế chuyên biệt để gia cố an toàn trong nâng tạ nặng lực lớn. Khách hàng cam kết khởi động kĩ càng, và sử dụng đai tạ đúng kỹ thuật để hạn chế rủi ro chấn thương."
                    : "The 10mm Henry Fit support belt is engineered for massive load stabilization. Users agree to consult coaching support and observe correct structural form to reduce lumbar injury vulnerabilities."}
                </p>
              </section>
              <section>
                <h3 className="font-montserrat text-white font-bold text-xs uppercase tracking-widest mb-2">
                  {language === "vi" ? "2. CHÍNH SÁCH ĐỔI SỬA KÍCH CỠ" : "2. EXCHANGING SIZE PARAMETERS"}
                </h3>
                <p>
                  {language === "vi"
                    ? "Chúng tôi hỗ trợ đổi kích cỡ sản phẩm đai tạ hoặc quần áo tập nguyên nilon trong vòng 7 ngày kể từ khi nhận hàng để đảm bảo trải nghiệm bảo vệ tốt nhất."
                    : "Products with pristine tag attachments can be exchanged for size adjustment parameters inside a 7-day period. Ensure proper fitting criteria are met for total back protection."}
                </p>
              </section>
            </div>
          ),
        };
    }
  };

  const content = renderContent();

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-12 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Navigation back triggers */}
        <button
          onClick={() => onNavigate("/")}
          className="flex items-center gap-2 text-[#0066ff] hover:text-white transition-colors text-xs font-mono tracking-widest uppercase mb-12 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "vi" ? "QUAY LẠI TRANG CHỦ" : "BACK TO PORT"}
        </button>

        {/* Header Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-[#424656]/20 pb-6">
          {content.icon}
          <div>
            <h1 className="font-anton text-2xl md:text-5xl uppercase tracking-wider text-white">
              {content.title}
            </h1>
            <p className="font-mono text-[9px] text-[#0066ff] font-bold tracking-widest uppercase mt-1">
              HENRY FIT SECURITY LABS PROTOCOL
            </p>
          </div>
        </div>

        {/* Content detail layout */}
        <div className="bg-[#111111] border border-[#424656]/15 p-6 md:p-10">
          {content.text}
        </div>
      </div>
    </div>
  );
}
