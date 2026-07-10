import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
const prisma = new PrismaClient();


dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Gemini client lazily to avoid crashing on start if the key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not defined or is placeholder. Using rule-based expert recommendation system.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Server-side AI gear recommendation endpoint
app.post("/api/recommendations", async (req, res) => {
  const { goal, discipline, experience, customMessage, language } = req.body;

  const resolvedDiscipline = discipline || "general";
  const resolvedGoal = goal || "enhance performance";
  const resolvedExperience = experience || "intermediate";
  const isVi = language === "vi";

  const ai = getGeminiClient();

  if (ai) {
    try {
      let systemPrompt = `You are "Henry Fit AI Specialist", an elite, professional-grade athletic performance consultant.
Your purpose is to advise the user on their gear setup based on their training parameters.
User's data:
- Discipline: ${resolvedDiscipline}
- Core Goal: ${resolvedGoal}
- Experience level: ${resolvedExperience}
- Custom query: ${customMessage || "None provided"}

We have these primary premium products:
1. "Oversized Gym Tee" ($35.00): 240GSM premium heavyweight cotton, ideal for upper body pump, heavy barbell work, high friction.
2. "Compression Shirt" ($45.00): Engineered moisture-wicking synthetic paneling, perfect for endurance, temperature stabilization, and vascular compression.
3. "Lifting Belt" ($85.00): 10mm professional stiff leather belt, perfect for powerlifting, squats, deadlifts, and peak structural lumbar support.

Provide an exceptionally striking, motivating, and detailed response in Markdown. Include:
1. A concise, hard-hitting athletic evaluation of their discipline/goal.
2. Structural gear advice, detailing EXACTLY why they need each item.
3. Formulate highly specific recommendations of whether they should buy the Oversized Tee, Compression Shirt, or Lifting Belt, and how to combine them.
Avoid promotional fluff; keep your language precise, technical, and motivating. Limit your response to 200 words.`;

      if (isVi) {
        systemPrompt += `\n\nCRITICAL: The user has selected VIETNAMESE ("vi") as their active preference. You MUST write your entire response, recommendations, evaluations, and titles in natural, professional Vietnamese. Use gym athletic terms naturally (e.g. squat, deadlift, powerlifting, compression shirt, 10mm, oversizied gym tee).`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
      });

      const adviceText = response.text || "No advice compiled.";
      res.json({ success: true, advice: adviceText });
      return;
    } catch (err: any) {
      console.error("Gemini API Error in recommendations:", err);
      // Fallback below
    }
  }

  // Local rule-based fallback response (bilingual)
  let advice = "";

  if (isVi) {
    advice = `### ĐÁNH GIÁ ATHLETE & KHUYẾN NGHỊ THIẾT BỊ CHUYÊN NGHIỆP
  
**Hồ sơ tập luyện:** ${resolvedDiscipline.toUpperCase()} | Mục tiêu: ${resolvedGoal.toUpperCase()} | Cấp độ: ${resolvedExperience.toUpperCase()}

Dựa vào các chỉ số rèn luyện của bạn, phòng thí nghiệm Henry Fit đề xuất cấu hình tối ưu sau:

1. **Khuyến nghị cấu hình chính:** `;

    if (resolvedDiscipline === "powerlifting") {
      advice += `**Đai Lưng Tập Tạ 10mm ($85.00)**
Bản đai da bò 2 lớp khâu kép siêu thắt phẳng này cung cấp áp lực nội bụng tối mật lực kéo lớn để bạn luôn vững chắc cột sống khi Squat hoặc Deadlift tạ nặng. Nó hoạt động như một thành quách trung tâm vững vàng bảo vệ thắt lưng tối đa.`;
    } else if (resolvedDiscipline === "bodybuilding") {
      advice += `**Áo Oversized Gym Tee ($35.00)**
Chế tác từ thun 100% Cotton 240GSM cao cấp, cho phép giải phóng độ vồng bắp vai cực đại khi bơm máu tập hiệu suất cao mà vẫn bền chắc dưới độ mài xiết của sắt tạ đòn gánh gác.`;
    } else {
      advice += `**Áo Thun Bó Compression Shirt ($45.00)**
Thiết kế ôm nén vùng cơ bả vai, dải sườn giúp giữ nhiệt tuần hoàn máu đồng đều và giải tỏa nhanh mồ hôi thông qua sợi dệt đàn hồi hiệu năng cao.`;
    }

    advice += `\n\n2. **Lời khuyên phối liên kết thể chất:**
- Đảm bảo chọn đúng kích cỡ thắt chặt vòng thun ôm để phát huy tối đa áp lực gia thắt.
- Hãy thở sâu nén bụng (Bracing) kĩ càng trước khi bắt đầu bài nâng nặng lực lớn.`;

    if (customMessage) {
      advice += `\n\n*Đối với chi tiết bổ sung "${customMessage}":* Chuyên gia khuyên bạn nên tập trung vào giai đoạn gồng hạ ly tâm chậm và dùng vải nén để giữ ấm khớp ổn định.`;
    }
  } else {
    advice = `### HENRY FIT ATHLETE INSIGHTS & EXPERT RECOMMENDATIONS
  
**Training Profile:** ${resolvedDiscipline.toUpperCase()} | Core Goal: ${resolvedGoal.toUpperCase()} | Level: ${resolvedExperience.toUpperCase()}

Based on your training requirements, our performance lab recommends the following kit configuration:

1. **Primary Recommendation:** `;

    if (resolvedDiscipline === "powerlifting") {
      advice += `**Lifting Belt ($85.00)**
This 10mm premium black double-stitched leather belt provides critical intra-abdominal pressure needed for heavy compound work (squats, pulls). It creates a solid wall for your core to brace against, lifting overall output safely.`;
    } else if (resolvedDiscipline === "bodybuilding") {
      advice += `**Oversized Gym Tee ($35.00)**
Built from 240GSM supreme cotton, this provides structural room for massive blood pumps while holding strong under physical load and barbell knurling. Pair it with high volume lifting regimes.`;
    } else {
      advice += `**Compression Shirt ($45.00)**
Designed to stay compressed under intense physical exertion. It provides immediate temperature regulation, moisture wicking, and micro-stabilization of key muscle groups, keeping you dry and warm during multi-directional athletic drills.`;
    }

    advice += `\n\n2. **Supporting Gear Advice:**
- Ensure you select proper sizing to optimize structural compression or breathability.
- Consistently brace your core during loading phases to maximize your gear's efficacy.`;

    if (customMessage) {
      advice += `\n\n*Regarding your detail "${customMessage}":* Our specialists suggest focusing on strict eccentric control and utilizing targeted compression fabrics to keep key joints insulated during high exertion.`;
    }
  }

  res.json({ success: true, advice });
});

// Server-side conversational AI chat endpoint forwarding to n8n
app.post("/api/chat", async (req, res) => {
  const { messages, language } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ success: false, error: "Messages array is required." });
    return;
  }

  // Extract the latest user message
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
  const chatInput = lastUserMessage ? lastUserMessage.content : "";

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/d4b76ec9-f9fc-475d-b835-b4d479d35849";

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "user001",
        chatInput: chatInput
      })
    });
    
    // Pass the exact JSON from n8n to React (handle empty body safely)
    const text = await response.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { text_response: text };
      }
    }
    res.json(data);
  } catch (err: any) {
    console.error("N8n Forwarding Error:", err);
    res.status(500).json({ success: false, error: "Failed to communicate with n8n." });
  }
});

// ==========================================
// AUTH ROUTES (Admin / Staff Login)
// ==========================================
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ success: false, error: "Username and password are required." });
    return;
  }
  try {
    const account = await prisma.account.findUnique({ where: { username } });
    if (!account || !(await bcrypt.compare(password, account.password))) {
      res.status(401).json({ success: false, error: "Invalid username or password." });
      return;
    }
    if (account.status !== 'Active') {
      res.status(403).json({ success: false, error: "Account is deactivated." });
      return;
    }
    res.json({ success: true, role: account.role, name: account.name, email: account.email });
  } catch (err: any) {
    console.error("Auth login error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

app.post("/api/auth/create-staff", async (req, res) => {
  const { username, password, name, email, role } = req.body;
  if (!username || !password || !name || !email) {
    res.status(400).json({ success: false, error: "All fields are required." });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const account = await prisma.account.create({
      data: {
        username,
        password: hashedPassword,
        role: role || 'Staff',
        name,
        email,
        status: 'Active'
      }
    });
    // Also create a Staff record for the admin panel
    await prisma.staff.create({
      data: {
        name,
        email,
        role: role || 'Staff',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200'
      }
    });
    res.json({ success: true, account: { id: account.id, username: account.username, role: account.role, name: account.name, email: account.email } });
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(409).json({ success: false, error: "Username or email already exists." });
      return;
    }
    console.error("Create staff error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

app.get("/api/auth/accounts", async (_req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      select: { id: true, username: true, role: true, name: true, email: true, status: true, createdAt: true }
    });
    res.json(accounts);
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Server error." });
  }
});

app.delete("/api/auth/accounts/:id", async (req, res) => {
  try {
    await prisma.account.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ==========================================
// MEMBER ROUTES (Registration + OTP)
// ==========================================
const smtpTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL || '',
    pass: process.env.SMTP_PASSWORD || ''
  }
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/api/member/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ success: false, error: "Name, email, and password are required." });
    return;
  }
  try {
    // Check if already exists
    const existing = await prisma.memberAccount.findUnique({ where: { email } });
    if (existing && existing.verified) {
      res.status(409).json({ success: false, error: "Email is already registered." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (existing) {
      // Update the unverified account
      await prisma.memberAccount.update({
        where: { email },
        data: { name, password: hashedPassword, phone, otp, otpExpiry }
      });
    } else {
      await prisma.memberAccount.create({
        data: { name, email, password: hashedPassword, phone, otp, otpExpiry }
      });
    }

    // Send OTP via email
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      await smtpTransporter.sendMail({
        from: `"Henry Fit Store" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Henry Fit - Mã xác thực OTP',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px">
            <h2 style="color:#0066ff;margin-bottom:16px">Henry Fit Store</h2>
            <p>Xin chào <strong>${name}</strong>,</p>
            <p>Mã xác thực (OTP) của bạn là:</p>
            <div style="font-size:32px;font-weight:bold;text-align:center;padding:16px;background:#0066ff;color:white;border-radius:8px;letter-spacing:8px;margin:16px 0">
              ${otp}
            </div>
            <p style="color:#666;font-size:14px">Mã này có hiệu lực trong 5 phút. Không chia sẻ mã này với bất kỳ ai.</p>
            <p style="color:#999;font-size:12px;margin-top:24px">— Henry Fit Team</p>
          </div>
        `
      });
    }

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err: any) {
    console.error("Member register error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

app.post("/api/member/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({ success: false, error: "Email and OTP are required." });
    return;
  }
  try {
    const member = await prisma.memberAccount.findUnique({ where: { email } });
    if (!member) {
      res.status(404).json({ success: false, error: "Account not found." });
      return;
    }
    if (member.verified) {
      res.json({ success: true, message: "Account is already verified." });
      return;
    }
    if (member.otp !== otp) {
      res.status(400).json({ success: false, error: "Invalid OTP code." });
      return;
    }
    if (member.otpExpiry && new Date() > member.otpExpiry) {
      res.status(400).json({ success: false, error: "OTP has expired. Please register again." });
      return;
    }

    // Mark as verified
    await prisma.memberAccount.update({
      where: { email },
      data: { verified: true, otp: null, otpExpiry: null }
    });

    // Auto-create Customer record for Admin dashboard sync
    const existingCustomer = await prisma.customer.findUnique({ where: { email } });
    if (!existingCustomer) {
      await prisma.customer.create({
        data: {
          name: member.name,
          email: member.email,
          totalSpend: 0,
          orderCount: 0,
          joinDate: new Date().toISOString().split('T')[0],
          status: 'Active'
        }
      });
    }

    res.json({ success: true, message: "Email verified successfully! Welcome to Henry Fit." });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

app.post("/api/member/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, error: "Email and password are required." });
    return;
  }
  try {
    const member = await prisma.memberAccount.findUnique({ where: { email } });
    if (!member || !(await bcrypt.compare(password, member.password))) {
      res.status(401).json({ success: false, error: "Invalid email or password." });
      return;
    }
    if (!member.verified) {
      res.status(403).json({ success: false, error: "Email not verified. Please verify your OTP first." });
      return;
    }
    res.json({ success: true, name: member.name, email: member.email });
  } catch (err: any) {
    console.error("Member login error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// --- STAFF ROUTES ---
app.get("/api/staff", async (req, res) => {
  try {
    const staff = await prisma.staff.findMany();
    res.json(staff);
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Server error." });
  }
});

app.put("/api/staff/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.staff.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Server error." });
  }
});

app.delete("/api/staff/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// Seeding logic
async function seedDatabase() {
  try {
    const productCount = await prisma.product.count();
    if (productCount === 0) {
      console.log('Seeding products...');
      await prisma.product.createMany({
        data: [
          {
            id: 'PROD-001',
            name: 'Thanh Đòn HENRY FIT ELITE',
            description: 'Thanh đòn tạ thép 20kg cao cấp với lớp mạ đen và khía nhám chống trượt tuyệt đỉnh.',
            category: 'Phụ kiện',
            price: 349,
            stock: 24,
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
            status: 'Active'
          },
          {
            id: 'PROD-002',
            name: 'Áo Thun Nén Tay Dài COMPRESSION',
            description: 'Chất liệu thun lạnh spandex siêu thoáng khí, thiết kế ôm sát cơ bắp giúp lưu thông máu.',
            category: 'Nam',
            price: 45,
            stock: 120,
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
            status: 'Active'
          },
          {
            id: 'PROD-003',
            name: 'Pre-workout KINETIC (Vị Dưa Hấu)',
            description: 'Công thức L-Citrulline, Beta-Alanine và Caffeine liều cao giúp bùng nổ sức mạnh.',
            category: 'Thực phẩm chức năng',
            price: 55,
            stock: 5,
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
            status: 'Low Stock'
          },
          {
            id: 'PROD-004',
            name: 'Cặp Tạ Tay Lục Giác 25KG',
            description: 'Lõi gang đúc nguyên khối bọc cao su chống ồn và giảm mài mòn sàn tập.',
            category: 'Phụ kiện',
            price: 180,
            stock: 12,
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
            status: 'Active'
          },
          {
            id: 'PROD-005',
            name: 'Tạ Ấm HENRY FIT 16KG',
            description: 'Tạ ấm gang nguyên khối màu đen nhám cổ điển với lớp phủ sơn tĩnh điện.',
            category: 'Phụ kiện',
            price: 85,
            stock: 18,
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
            status: 'Active'
          },
          {
            id: 'PROD-006',
            name: 'Dây Kéo Lưng Dành Cho PRO',
            description: 'Dây kéo lưng cotton cường độ cao có đệm lót, khâu kép, hoàn hảo cho bài deadlift.',
            category: 'Nam',
            price: 25,
            stock: 0,
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
            status: 'Out of Stock'
          },
          {
            id: 'PROD-007',
            name: 'GIÁO ÁN GIẢM MỠ 12 TUẦN',
            description: 'Giáo án điện tử trọn bộ kèm tính toán macro, theo dõi nhịp tim và bài tập tuỳ chỉnh.',
            category: 'Nữ',
            price: 150,
            stock: 500,
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
            status: 'Active'
          },
          {
            id: 'PROD-008',
            name: 'WHEY ISOLATE 2KG (Vị Sôcôla)',
            description: '25g whey protein isolate nguyên chất mỗi muỗng, chưa đến 1g chất béo và đường.',
            category: 'Thực phẩm chức năng',
            price: 79,
            stock: 45,
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
            status: 'Active'
          },
          {
            id: 'PROD-009',
            name: 'CREATINE MONOHYDRATE 500G',
            description: 'Creatine monohydrate tinh khiết 100% giúp tối đa hoá sức mạnh và giữ nước tế bào.',
            category: 'Thực phẩm chức năng',
            price: 39,
            stock: 3,
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
            status: 'Low Stock'
          }
        ]
      });
    }

    const categoryCount = await prisma.category.count();
    if (categoryCount === 0) {
      console.log('Seeding categories...');
      await prisma.category.createMany({
        data: [
          {
            id: 'CAT-001',
            name: 'Phụ kiện',
            description: 'Thiết bị tập tạ nặng, thanh đòn, tạ đĩa và dụng cụ hỗ trợ.',
            productCount: 3
          },
          {
            id: 'CAT-002',
            name: 'Nam',
            description: 'Quần áo tập luyện hiệu suất cao, đồ nén và dây kéo lưng.',
            productCount: 2
          },
          {
            id: 'CAT-003',
            name: 'Thực phẩm chức năng',
            description: 'Pre-workout, whey protein và các sản phẩm phục hồi cơ bắp.',
            productCount: 3
          },
          {
            id: 'CAT-004',
            name: 'Nữ',
            description: 'Giáo án tập luyện kỹ thuật số và chương trình huấn luyện trực tuyến.',
            productCount: 1
          }
        ]
      });
    }

    const customerCount = await prisma.customer.count();
    if (customerCount === 0) {
      console.log('Seeding customers...');
      await prisma.customer.createMany({
        data: [
          {
            id: 'CUST-001',
            name: 'Marcus Aurelius',
            email: 'marcus@stoicstrength.com',
            totalSpend: 1420,
            orderCount: 4,
            joinDate: '2025-01-15',
            status: 'Active'
          },
          {
            id: 'CUST-002',
            name: 'Athelstane Vance',
            email: 'vance@kinetic.io',
            totalSpend: 540,
            orderCount: 3,
            joinDate: '2025-03-22',
            status: 'Active'
          },
          {
            id: 'CUST-003',
            name: 'Seraphina Vance',
            email: 'seraphina@powerlifting.org',
            totalSpend: 890,
            orderCount: 5,
            joinDate: '2025-02-10',
            status: 'Active'
          },
          {
            id: 'CUST-004',
            name: 'Leonidas Kouris',
            email: 'spartan@thermo.gr',
            totalSpend: 249,
            orderCount: 1,
            joinDate: '2026-06-23',
            status: 'Active'
          },
          {
            id: 'CUST-005',
            name: 'Zane Henderson',
            email: 'zane@deadliftcrew.com',
            totalSpend: 110,
            orderCount: 2,
            joinDate: '2025-11-04',
            status: 'Active'
          }
        ]
      });
    }

    const promotionCount = await prisma.promotion.count();
    if (promotionCount === 0) {
      console.log('Seeding promotions...');
      await prisma.promotion.createMany({
        data: [
          {
            id: 'PROM-001',
            code: 'KINETIC10',
            discountType: 'Percentage',
            discountValue: 10,
            status: 'Active',
            useCount: 148,
            startDate: '2026-01-01',
            endDate: '2026-12-31'
          },
          {
            id: 'PROM-002',
            code: 'BARBELLPOWER',
            discountType: 'Flat',
            discountValue: 30,
            status: 'Active',
            useCount: 54,
            startDate: '2026-05-01',
            endDate: '2026-08-31'
          },
          {
            id: 'PROM-003',
            code: 'SUMMER25',
            discountType: 'Percentage',
            discountValue: 25,
            status: 'Expired',
            useCount: 312,
            startDate: '2025-06-01',
            endDate: '2025-08-31'
          }
        ]
      });
    }

    const staffCount = await prisma.staff.count();
    if (staffCount === 0) {
      console.log('Seeding staff...');
      await prisma.staff.createMany({
        data: [
          {
            id: 'STF-001',
            name: 'Henry Peterson',
            role: 'Admin',
            email: 'henry@henryfit.com',
            status: 'Active',
            avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'
          },
          {
            id: 'STF-002',
            name: 'Sarah Connor',
            role: 'Manager',
            email: 'sarah@henryfit.com',
            status: 'Active',
            avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200'
          },
          {
            id: 'STF-003',
            name: 'Alex Mercer',
            role: 'Trainer',
            email: 'alex@henryfit.com',
            status: 'Active',
            avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'
          }
        ]
      });
    }

    const orderCount = await prisma.order.count();
    if (orderCount === 0) {
      console.log('Seeding orders...');
      await prisma.order.create({
        data: {
          id: 'ORD-8941',
          customerName: 'Marcus Aurelius',
          customerEmail: 'marcus@stoicstrength.com',
          date: '2026-06-25',
          total: 394,
          status: 'Completed',
          paymentMethod: 'Credit Card',
          items: {
            create: [
              { productId: 'PROD-001', productName: 'HENRY FIT ELITE OLYMPIC BARBELL', quantity: 1, price: 349 },
              { productId: 'PROD-002', productName: 'COMPRESSION L/S TRAINING TEE', quantity: 1, price: 45 }
            ]
          }
        }
      });

      await prisma.order.create({
        data: {
          id: 'ORD-8940',
          customerName: 'Athelstane Vance',
          customerEmail: 'vance@kinetic.io',
          date: '2026-06-25',
          total: 110,
          status: 'Completed',
          paymentMethod: 'PayPal',
          items: {
            create: [
              { productId: 'PROD-003', productName: 'KINETIC PRE-WORKOUT (SOUR WATERMELON)', quantity: 2, price: 55 }
            ]
          }
        }
      });

      await prisma.order.create({
        data: {
          id: 'ORD-8939',
          customerName: 'Seraphina Vance',
          customerEmail: 'seraphina@powerlifting.org',
          date: '2026-06-24',
          total: 180,
          status: 'Pending',
          paymentMethod: 'Google Pay',
          items: {
            create: [
              { productId: 'PROD-004', productName: 'HEX DUMBBELL PAIR 25KG', quantity: 1, price: 180 }
            ]
          }
        }
      });

      await prisma.order.create({
        data: {
          id: 'ORD-8938',
          customerName: 'Leonidas Kouris',
          customerEmail: 'spartan@thermo.gr',
          date: '2026-06-23',
          total: 249,
          status: 'Completed',
          paymentMethod: 'Credit Card',
          items: {
            create: [
              { productId: 'PROD-005', productName: 'HENRY FIT CAST IRON KETTLEBELL 16KG', quantity: 1, price: 85 },
              { productId: 'PROD-007', productName: '12-WEEK SHRED COCHING PROGRAM', quantity: 1, price: 150 },
              { productId: 'PROD-002', productName: 'COMPRESSION L/S TRAINING TEE', quantity: 1, price: 45 }
            ]
          }
        }
      });

      await prisma.order.create({
        data: {
          id: 'ORD-8937',
          customerName: 'Zane Henderson',
          customerEmail: 'zane@deadliftcrew.com',
          date: '2026-06-22',
          total: 79,
          status: 'Cancelled',
          paymentMethod: 'Microsoft Pay',
          items: {
            create: [
              { productId: 'PROD-008', productName: 'WHEY ISOLATE 2KG (CHOCOLATE)', quantity: 1, price: 79 }
            ]
          }
        }
      });
    }

    console.log('Prisma database successfully loaded with initial Henry Fit assets.');

    // Seed default Admin account
    const adminCount = await prisma.account.count();
    if (adminCount === 0) {
      const hashedPw = await bcrypt.hash('HenryFit@2026', 10);
      await prisma.account.create({
        data: {
          username: 'admin',
          password: hashedPw,
          role: 'Admin',
          name: 'Henry Peterson',
          email: 'admin@henryfit.com',
          status: 'Active'
        }
      });
      console.log('Default admin account created (username: admin)');
    }

  } catch (error) {
    console.error('Error seeding Prisma database:', error);
  }
}

import { apiRouter } from './server/routes/api.js';
import { setupSwagger } from './server/swagger.js';

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api', apiRouter);
setupSwagger(app);

async function startServer() {
  await seedDatabase();
  // Vite dev server middleware integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "web", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Henry Fit Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
