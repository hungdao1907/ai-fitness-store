/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowLeft, Award, Flame, Rocket, Target } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const { language, t } = useLanguage();

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-12 pb-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Navigation row back */}
        <button
          onClick={() => onNavigate("/")}
          className="flex items-center gap-2 text-[#0066ff] hover:text-white transition-colors text-xs font-mono tracking-widest uppercase mb-12 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "vi" ? "QUAY LẠI TRANG CHỦ" : "BACK TO PORT"}
        </button>

        {/* Master heading banner */}
        <div id="about-title" className="mb-16 border-b border-[#424656]/20 pb-8">
          <h1 className="font-anton text-4xl md:text-7xl tracking-wider uppercase text-white mb-4">
            {language === "vi" ? "VỀ CHÚNG TÔI" : "ABOUT THE PERFORMANCE LABS"}
          </h1>
          <p className="font-mono text-xs md:text-sm text-[#0066ff] uppercase tracking-widest font-black">
            {language === "vi" ? "DẬP KHUÔN CHO THẾ HỆ THỂ THAO TỐI TÂN" : "ENGINEERING ATHLETIC SUPERIORITY CODES"}
          </p>
        </div>

        {/* Story details layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="font-montserrat text-lg font-bold uppercase text-white tracking-wider">
              {language === "vi" ? "SỨ MỆNH HIỆU HIỆU NĂNG CAO" : "OUR HIGH-VELOCITY MISSION"}
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed font-light">
              {language === "vi"
                ? "Thành lập vào năm 2024 bởi đội ngũ huấn luyện viên cao cấp và kỹ sư dệt may, Henry Fit được phát triển như một phòng thí nghiệm hiệu năng thể thao. Chúng tôi từ chối thỏa hiệp, lựa chọn tỉ mỉ các chất liệu dệt thắt lưng, tối ưu độ nén ép cơ, và công thức dinh dưỡng cao cấp nhất dành cho vận động viên chuyên nghiệp."
                : "Established in 2024 by elite trainers and warpweft textile engineers, Henry Fit operates as an athletic performance laboratory. We reject generic templates, opting instead to optimize high-tensile lumbar accessories, muscle-compression weaves, and purest microfiltered recovery supplements."}
            </p>
            <p className="font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed font-light">
              {language === "vi"
                ? "Mỗi tác phẩm phát hành từ phòng nghiên cứu của chung tôi đều trải qua quá trình hiệu chuẩn tải trọng cao gắt gao nhằm triệt tiêu chấn thương tối đa, gia cố bảo bối thể lực và tiếp lửa cho hành trình chinh phục giới hạn bản thân."
                : "Every piece released undergoes high-load mechanical calibration to optimize spinal integrity, minimize strain coefficients, and assist the relentless pursuit of human potential maximums."}
            </p>
          </div>

          <div className="bg-[#111111] p-8 border border-[#424656]/20 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#0066ff]/10 text-[#0066ff]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-montserrat text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                  {language === "vi" ? "HIỆU SUẤT KHÔNG THỎA HIỆP" : "UNCOMPROMISING SPEED"}
                </h4>
                <p className="font-sans text-xs text-[#c2c6d8] leading-relaxed">
                  {language === "vi"
                    ? "Chúng tôi tin rằng sự khác biệt giữa đỉnh vinh quang và thất bại được định đoạt bởi sự chuẩn xác trong từng sợi vải dệt cốt lõi."
                    : "The margins of safety are decided by active fiber integrity underneath elite athletic motion."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#0066ff]/10 text-[#0066ff]">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-montserrat text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                  {language === "vi" ? "HIỆU CHỈNH CHUẨN KỸ THUẬT" : "LABORATORY CALIBRATED"}
                </h4>
                <p className="font-sans text-xs text-[#c2c6d8] leading-relaxed">
                  {language === "vi"
                    ? "Tất cả sản phẩm đai tạ da thật đều được đo lực kéo đa điểm tối thiểu 3000 giờ để chống bong nứt."
                    : "All full-grain support models undergo massive destructive load limits for over 3000 test hours."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#0066ff]/10 text-[#0066ff]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-montserrat text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                  {language === "vi" ? "HỆ SINH THÁI TỔNG THỂ" : "TOTAL BILINGUAL COOP"}
                </h4>
                <p className="font-sans text-xs text-[#c2c6d8] leading-relaxed">
                  {language === "vi"
                    ? "Cố vấn AI và hệ thống vận hành đa ngôn ngữ đồng hành xuyên suốt để tùy biến trải nghiệm cá nhân."
                    : "Bilingual translation models paired with dynamic AI advice ensure flawless customized fitment recommendations globally."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core numbers showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-black border border-[#424656]/15 text-center">
          <div>
            <h3 className="font-anton text-3xl md:text-5xl text-[#0066ff]">2024</h3>
            <span className="block font-mono text-[9px] text-[#c2c6d8] tracking-widest uppercase mt-2">
              {language === "vi" ? "THÀNH LẬP" : "ESTABLISHED"}
            </span>
          </div>
          <div>
            <h3 className="font-anton text-3xl md:text-5xl text-[#0066ff]">100%</h3>
            <span className="block font-mono text-[9px] text-[#c2c6d8] tracking-widest uppercase mt-2">
              {language === "vi" ? "ĐẢM BẢO CHẤT LƯỢNG" : "COMPRESSED QUALITY"}
            </span>
          </div>
          <div>
            <h3 className="font-anton text-3xl md:text-5xl text-[#0066ff]">10K+</h3>
            <span className="block font-mono text-[9px] text-[#c2c6d8] tracking-widest uppercase mt-2">
              {language === "vi" ? "VẬN ĐỘNG VIÊN KIỂM ĐỊNH" : "ATHLETE ENDORSED"}
            </span>
          </div>
          <div>
            <h3 className="font-anton text-3xl md:text-5xl text-[#0066ff]">10mm</h3>
            <span className="block font-mono text-[9px] text-[#c2c6d8] tracking-widest uppercase mt-2">
              {language === "vi" ? "TIÊU CHUẨN ĐAI HOÀNG GIA" : "PRO SPINE STANDARD"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
