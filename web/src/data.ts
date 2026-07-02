/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "oversized-tee",
    name: "Oversized Gym Tee",
    price: "$35.00",
    priceNum: 35.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaTHSngp1SBsDKMSjdQLD_MmJ7C4k5-ntEm2oqtNCgOgTINj-C_syKQZLjOEpliEfLpd8hU_4cnarVLsPW44oSRh490atqkzXK0d-yc_9puKHCm4EhzPfg8dOTQOUzbUJE0Sh95IjudbsCetn9PgPXYhpZ0b6O0-gtqk217xGfTPuvPkK6nV-wQCXWlO_x528YlZeuy0sisPCWoh_vHQ52lf_Pp5y80bjcpWuXCd8qFQUuxXFVXWHKvLmRuq8kpY11IHQrInBFNkkJ",
    badge: "BEST SELLER",
    description: "Designed with a high-performance relaxed aesthetic and structured drape. Crafted for elite high-impact physical training.",
    details: [
      "Premium heavyweight 240GSM combed cotton fabric",
      "Signature drop shoulder relaxed visual fit",
      "Reinforced rib-knit collar resists stretching",
      "Subtle technical tonal chest branding emblem"
    ],
    specs: {
      material: "100% Organic Heavyweight Cotton",
      fit: "Athletic Oversized Drop-Shoulder",
      care: "Machine wash cold inside-out, tumble dry low"
    }
  },
  {
    id: "compression-shirt",
    name: "Compression Shirt",
    price: "$45.00",
    priceNum: 45.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtOEdBP7GAMkIhe8LdU16rXrFQ24SbIJ_BOoIbXGbMrz__0siSJDiyUwnjm9Jbu_yeU1EyR0iOPqLxmHN-cEk2WAbqbG46aeympHSkwkZws4L_MFCKNSbvFmn54qwAXn4A2diy0RppRTVPWjGol1-MJ0DW2_MDku50zbTazEtLrW2_j-2_WcJ6VArwhLFBtgKNpKUK0o9odhjKEZQyI4jIFU-0S8sRiKAbjotJqw-zY5XSuaw_JZg6zvxGCjZAOyXUjHMX3-y-53KE",
    description: "Second-skin compression performance gear. Maximizes regional muscle heat retention and helps stabilize active muscle groups under high stress.",
    details: [
      "Technical four-way stretch synthetic elastane blend",
      "Advanced dry-core hydrophobic moisture dispersion",
      "Ergonomic flatlock performance sewing prevents chafing",
      "Targeted ventilated heat zone mesh paneling"
    ],
    specs: {
      material: "85% Performance Polyester / 15% High-recovery Elastane",
      fit: "Second-Skin Compression",
      care: "Gentle cold cycle wash, hang dry, do not iron"
    }
  },
  {
    id: "lifting-belt",
    name: "Lifting Belt",
    price: "$85.00",
    priceNum: 85.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOLflOSIUOeI_5yEne4LWxeT2Eyk1e6mW-Tuu7Dx1_xSXrgy5PfOml587KdZDX50Wff7B-eCqz0bzvwrDozWK-GtKYpS8PTTxHehIki2IeUTHQsJabrvUwZle4_iG17IPim3p6gfuVXmyD1FFeRtMRKRCucNA3AZzRzKdNdzgSOosZMD5GwwzRZ5_5qpOpGjAnBwBdT2xAwA97QHCFxP2HMXjtWEkpCfv78Zuy6zURCC7p7GtA_GmlMFnSGmQYU32FyWJ5Wh6KQf97",
    description: "Heavy-duty 10mm high-density powerlifting belt. Engineered to offer maximal intra-abdominal lumbar support during maximum weight squating or deadlifting.",
    details: [
      "Top-grade selected cowhide rigid core build",
      "10mm thickness for absolute spine stability",
      "Dual-pronged polished heavy steel buckle roller mechanism",
      "Tough waxed-nylon double reinforced borders"
    ],
    specs: {
      material: "100% High-density Genuine Split Leather",
      fit: "Rigid Powerloading Structural Core",
      care: "Do not wet, brush clean, treat leather if needed"
    }
  },
  {
    id: "men-heavyweight-tee",
    name: "Heavyweight Gym Tee",
    price: "$45.00",
    priceNum: 45.0,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    badge: "BEST SELLER",
    category: "OVERSIZED",
    description: "Engineered with a high-performance relaxed silhouette and substantial heavyweight structure. Built to withstand training friction.",
    details: [
      "Premium 240GSM heavyweight organic cotton weave",
      "Signature drop shoulder boxy look",
      "Reinforced seamless collar prevents stretching under load",
      "Slightly longer back-hem coverage"
    ],
    specs: {
      material: "100% Heavyweight Organic Cotton",
      fit: "Oversized Slouch Drop-Shoulder",
      care: "Cold delicate wash, hang to dry in shade"
    }
  },
  {
    id: "men-elite-recovery",
    name: "Elite Recovery L/S",
    price: "$65.00",
    priceNum: 65.0,
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=800",
    category: "COMPRESSION",
    description: "Second-skin compression gear engineered for temperature regulation and targeted muscle heat stabilization during intense loads.",
    details: [
      "Thermal compression fibers support vascular action",
      "Sweat-wicking synthetic yarn elements",
      "Abrasive-resistant flatlock stitching matrix",
      "Strategically mapped breathable underarm ports"
    ],
    specs: {
      material: "85% High-Memory Polyester / 15% Elastane Layering",
      fit: "Second-Skin Tactical Compression",
      care: "Machine wash cold inside-out, do not tumble dry"
    }
  },
  {
    id: "men-apex-shorts",
    name: "Apex 5\" Shorts",
    price: "$50.00",
    priceNum: 50.0,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800",
    category: "TRAINING",
    description: "Ultra-light breathable performance shorts engineered for raw kinetic mobility and speed drills.",
    details: [
      "Deep split lateral laser cutside hem",
      "Extremely breathable micro-pore outer fabric",
      "Adjustable custom fit low-profile drawcord adjustment",
      "Zip-secure rear tech-phone storage pocket"
    ],
    specs: {
      material: "90% Recycled Nylon / 10% Breathable Elastane",
      fit: "Athletic 5-Inch Running Inseam",
      care: "Cold wash, do not iron elastic bounds"
    }
  },
  {
    id: "men-raw-edge-hoodie",
    name: "Raw Edge Hoodie",
    price: "$55.00",
    priceNum: 55.0,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    category: "OVERSIZED",
    isSoldOut: true,
    description: "Raw-edge sleeveless gym hoodie engineered for shoulder range of motion and superior thermal control.",
    details: [
      "Sleeveless racer-back shoulder blade release design",
      "Fleece-lined insulating core structure",
      "Deep drawless multi-panel protective head hood",
      "Raw finished edge details for natural wear texture"
    ],
    specs: {
      material: "80% Organic Heavy Fleece / 20% Technical Polyester",
      fit: "Relaxed Sleeveless Boxy Profile",
      care: "Wash separately cold, lay flat to dry"
    }
  },
  {
    id: "supp-isolate-whey",
    name: "Isolate Whey Protein",
    price: "$49.99",
    priceNum: 49.99,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800&auto=format&fit=crop",
    badge: "BEST SELLER",
    category: "PROTEIN",
    description: "Pure cross-flow microfiltered whey isolate designed for elite muscle reconstruction and synthetic muscle protein acceleration.",
    details: [
      "25g ultra-pure whey protein isolate per serving",
      "Contains less than 1g of lactose and fat",
      "Rich in essential branched-chain amino acids (BCAAs)",
      "Instantized powder for perfect mixability and zero clumps"
    ],
    specs: {
      material: "100% Microfiltered Whey Isolate, BCAAs",
      fit: "Fast-Absorbing Muscle Protein",
      care: "Store in a cool dry place, keep out of sunlight"
    }
  },
  {
    id: "supp-surge-workout",
    name: "Surge Pre-Workout",
    price: "$39.99",
    priceNum: 39.99,
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800&auto=format&fit=crop",
    category: "PRE WORKOUT",
    description: "High-octane nitric oxide amplfier and cognitive focus trigger designed to hyper-saturate muscle cells and drive raw energy.",
    details: [
      "Clinical dose of pure L-Citrulline for maximal blood pump",
      "350mg energy-boosting caffeine anhydrous blend",
      "Beta-Alanine buffer delays tactical lactic acid buildup",
      "Zero crash artificial dyes or redundant fillers"
    ],
    specs: {
      material: "L-Citrulline, Beta-Alanine, Caffeine",
      fit: "Vasodilation & Energy Formula",
      care: "Consume 15-30 mins prior to training loads"
    }
  },
  {
    id: "supp-night-recovery",
    name: "Nighttime Recovery Complex",
    price: "$34.99",
    priceNum: 34.99,
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=800&auto=format&fit=crop",
    category: "RECOVERY",
    description: "Strategic deep-sleep amplifier and tissue restoration compound formulated to maximize cellular repair cycles overnight.",
    details: [
      "Chelated Magnesium Bisglycinate supports nervous system",
      "OptiZinc matrix facilitates high vascular hormone synthesis",
      "Calming botanical extracts regulate central stress",
      "Encourages restorative slow-wave sleep phases"
    ],
    specs: {
      material: "Magnesium Bisglycinate, Zinc, Botanicals",
      fit: "Deep Sleep & Hormonal Regulator",
      care: "Take 3 capsules 30-45 minutes before sleep"
    }
  },
  {
    id: "supp-mass-gainer",
    name: "Mass Gainer Blend",
    price: "$59.99",
    priceNum: 59.99,
    image: "https://images.unsplash.com/photo-1517858277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    badge: "NEW",
    category: "PROTEIN",
    description: "Massive caloric loading matrix engineered for hardgainers looking to stack massive size. Packed with elite clean complex carbs.",
    details: [
      "1200+ nutrient-dense clean calories per calculated shake",
      "55g multi-phase slow & fast digestion proteins",
      "Complex carbohydrates derived from organic oats and sweet potato",
      "Fortified with high-purity creatine monohydrate"
    ],
    specs: {
      material: "Complex Carbs, Whey Concentrate, Creatine",
      fit: "Anabolic Caloric Load Formula",
      care: "Consume post-workout or between main meal phases"
    }
  },
  {
    id: "acc-leather-belt",
    name: "Leather Lifting Belt",
    price: "$120.00",
    priceNum: 120.00,
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=800&auto=format&fit=crop",
    badge: "BEST SELLER",
    category: "BELTS",
    description: "Pro-grade 10mm lever leather belt crafted for absolute core stability and extreme intra-abdominal pressure during maximal loads.",
    details: [
      "10mm thickness premium full-grain steerhide leather",
      "Heavy duty black steel lever system for instant lock/release",
      "Stiff build offers maximal lower back and spinal protection",
      "Hand-finished edges with black lock stitching"
    ],
    specs: {
      material: "100% Genuine Steerhide Leather, Solid Steel Lever",
      fit: "10mm Ultra-Stiff Core Protection",
      care: "Wipe with leather cleaner, do not store in damp spaces"
    }
  },
  {
    id: "acc-heavy-wrist-wraps",
    name: "Heavy Duty Wrist Wraps",
    price: "$30.00",
    priceNum: 30.00,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    badge: "NEW",
    category: "WRAPS",
    description: "24-inch stiff competition wrist wraps designed to completely immobilize and secure wrists under extreme pressing loads.",
    details: [
      "Heavy-duty cotton and elastic weave for maximum stiffness",
      "Extra wide hook-and-loop velcro strap zone",
      "Flat thumb loop for quick and secure wrapping setup",
      "Provides elite structural support for bench press and overhead lifts"
    ],
    specs: {
      material: "70% Polyester, 30% Elastic, High-Strength Velcro",
      fit: "Customizable Tightness and Immobilization",
      care: "Hand wash cold, air dry only, avoid velcro exposure"
    }
  },
  {
    id: "acc-resistance-bands",
    name: "Resistance Band Set",
    price: "$35.00",
    priceNum: 35.00,
    image: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?q=80&w=800&auto=format&fit=crop",
    category: "BANDS",
    description: "Multi-layered 100% natural latex resistance loop band set engineered for dynamic warmups, mobility work, and progressive resistance.",
    details: [
      "Set of 4 progression levels: Light, Medium, Heavy, X-Heavy",
      "Continuous layered latex construction prevents snapping",
      "Comes with durable compact tactical carry pouch",
      "Excellent for physical therapy, joint mobilization, and assistance"
    ],
    specs: {
      material: "100% Eco-Friendly Natural Malaysian Latex",
      fit: "Progressive High-Tension Loops",
      care: "Store away from heat/direct sunlight, dust with chalk"
    }
  },
  {
    id: "acc-tactical-gym-bag",
    name: "Tactical Gym Bag",
    price: "$85.00",
    priceNum: 85.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    badge: "LIMITED EDITION",
    category: "BAGS",
    description: "45-liter military-grade tactical gym bag engineered with spacious layout, dedicated shoe compartments, and MOLLE modular webbing.",
    details: [
      "Ultra-durable 1000D water-resistant ripstop nylon build",
      "Spacious main compartment with mesh organizing dividers",
      "External ventilated wet/dry footwear capsule",
      "Velcro front patch panel with heavy duty paracord zippers"
    ],
    specs: {
      material: "1000D Ripstop Ballistic Nylon, YKK Zippers",
      fit: "45L High Capacity Gear Transport",
      care: "Wipe with damp cloth, hang to air dry"
    }
  },
  {
    id: "acc-lifting-straps",
    name: "Lifting Straps",
    price: "$25.00",
    priceNum: 25.00,
    image: "https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?q=80&w=800&auto=format&fit=crop",
    badge: "BEST SELLER",
    category: "STRAPS",
    description: "Premium heavy-duty lasso lifting straps designed with neoprene wrist padding to eliminate grip fatigue during heavy pulls.",
    details: [
      "Heavy duty heavy-weave cotton webbing for maximum grip texture",
      "Thick neoprene padding prevents cutting/bruising of wrists",
      "Extended 21.5-inch length allows full barbell knurl wrap",
      "Reinforced dual-stitching for extreme tensile reliability"
    ],
    specs: {
      material: "100% Heavy Duty Cotton Webbing, Neoprene Padding",
      fit: "Extendable Lasso Grip Assist",
      care: "Hand wash cold, air dry to avoid cotton shrinkage"
    }
  },
  {
    id: "acc-knee-sleeves",
    name: "Knee Sleeves",
    price: "$60.00",
    priceNum: 60.00,
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800&auto=format&fit=crop",
    badge: "BEST SELLER",
    category: "SLEEVES",
    description: "Competition-grade 7mm neoprene knee sleeves crafted for high-performance joint compression, warming, and rebound assist.",
    details: [
      "7mm high-grade SCR neoprene for maximal stiffness",
      "Ergonomic 3D panel molding ensures perfect anatomical tracking",
      "Reinforced flat-lock double stitching for seam durability",
      "IPF and USAPL competition specification legal"
    ],
    specs: {
      material: "7mm SCR Neoprene, Double Lock Nylon Seams",
      fit: "Anatomical Compression Support",
      care: "Hand wash with mild detergent, lay flat to air dry"
    }
  },
  {
    id: "acc-shaker-bottle",
    name: "Shaker Bottle",
    price: "$20.00",
    priceNum: 20.00,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800&auto=format&fit=crop",
    category: "SHAKERS",
    description: "High-capacity leak-proof stainless steel shaker bottle featuring double-walled vacuum insulation to keep formulas ice cold.",
    details: [
      "24oz heavy duty kitchen-grade 18/8 stainless steel",
      "Double-walled vacuum insulation keeps liquids cold for 24h",
      "Integrated heavy silent mixing mesh grid avoids clumping",
      "Leak-proof seal cap with secure flip lid"
    ],
    specs: {
      material: "18/8 Pro-Grade Stainless Steel, BPA-Free Lid",
      fit: "Insulated Heavy-Duty Mixer",
      care: "Hand wash stainless body, lid is top-rack dishwasher safe"
    }
  },
  {
    id: "acc-training-gloves",
    name: "Training Gloves",
    price: "$28.00",
    priceNum: 28.00,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    category: "GLOVES",
    description: "Breathable open-back training gloves featuring genuine leather palm protection and integrated wrap wrist support.",
    details: [
      "Padded genuine leather palm prevents calluses and slips",
      "Fully breathable mesh back-of-hand prevents sweat buildup",
      "Integrated elastic wrist wrap band for secondary wrist protection",
      "Easy-pull tabs on fingers for quick removal"
    ],
    specs: {
      material: "Genuine Goat Leather, Polyester Mesh, Elastic Wrap",
      fit: "Snug Open-Back Palm Grip Protection",
      care: "Wipe clean with damp cloth, do not machine wash"
    }
  },
  {
    id: "women-apex-tight",
    name: "Apex Compression Tight",
    price: "$120.00",
    priceNum: 120.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHrO4rC2x_61EesVWdXrKznm8GdxL1qFPN_Yu6RzeXOrte19VKBedo1HnATAciY5KUEfwTAotKkT5P_y22J96ILvJy0qvR2FJHlI3elj0fQ0ncpCkkgND00Y8GZCpf_gzfDKS3cGs8sg2iB588VUt55nlM8pIlayfVn-QHdPDdn_1Y8KjVQLiwfvUNHNLBnOpcywjtz6gY3mT8eB8DZshzGKkTVMp3aVj2z3k832oVW0wcEJW9JOnOao0G-M_2E6Plb7DY8IpgOdwG",
    badge: "HIGH INTENSITY",
    category: "LEGGINGS",
    description: "Engineered for deep squats and high impact physical training.",
    details: [
      "Advanced four-way compression knit fabric",
      "Anatomically targeted waist stability band",
      "Moisture-wicking active dry-core fibers",
      "Flatlock anti-chafing high-tension sewing"
    ],
    specs: {
      material: "82% Recycled Polyester / 18% High-Recovery Spandex",
      fit: "Ultra-Locked High-Waist Compression",
      care: "Machine wash cold, air dry to sustain elasticity"
    }
  },
  {
    id: "women-velocity-bra",
    name: "Velocity Bra",
    price: "$65.00",
    priceNum: 65.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIhBa3P5FWfZN8m3JkgbHeQqxFGDRee5_6gYfwCpxfyZF5BRiZBCq5OF2_AVxG_yLv7LrWhL5I7MHRQ1tsw2M1ZBuxhAzcTRVNrqLh9wrLd8wj_vcW5OxHUaKOYLMXv5HwzHB2BgaP4TlwE0R4ZnfLx6CPvARyNgbMW5DHyNBN5_wTrCeutHzStQlMufr2amwQu8MnizgcUWXLVmd6BbN2pXdV8bvk8uc3VJfVKu5eRDZn9km-I0_w1d6vuHXwJPHWSEq5__bK2WxV",
    category: "SPORTS BRAS",
    description: "Maximum support. Zero distraction under heavy physical loads.",
    details: [
      "High-impact support with structural stability panels",
      "Breathable mesh back paneling for ventilation",
      "Soft moisture-absorbing wide underband",
      "Ergonomic racerback strap design"
    ],
    specs: {
      material: "80% Breathable Nylon / 20% Flexible Elastane",
      fit: "High-Impact Locked Stabilizing Fit",
      care: "Gentle cold hand wash, lay flat to dry"
    }
  },
  {
    id: "women-stealth-set",
    name: "Stealth Recovery Set",
    price: "$185.00",
    priceNum: 185.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9UF2bp66T5fb73J6O5c8d6vVswULu7i6OpkUZE1kauzUX-zScQ6DXumac2y--aKrRfs5A3VOm8D5KVghDdhM6k-ctIDXS72HHIl-gGyWOSHjsKhpyi5fPG9gaS6m8wzKMqVLfmTJT1m8wtgtzOzYiMW8MEnjsAuk6zYlTAU4rbVtZGcu_0NbYeC54BkMPmLfrGm-IxrcKYq0V_sx-mpdBdHx6XWgFRAMS-xVfjcvZe3K_ljI2PMf4sBROp069I_jWvZIdl8CuJ3WX",
    badge: "NEW RELEASE",
    category: "SETS",
    description: "Post-workout thermal regulation matching elite set.",
    details: [
      "Infrared-reflecting mineral-infused knit yarn",
      "Optimizes micro-circulation and physical recovery",
      "Sleek dark-aesthetic hooded matching top and pants",
      "Premium soft double-weave luxury fabric"
    ],
    specs: {
      material: "75% Smart Polyester / 25% Active Cotton Weave",
      fit: "Relaxed Restoration Therapeutic Silhouette",
      care: "Wash separate inside out, tumble dry low"
    }
  },
  {
    id: "women-sculpt-leggings",
    name: "Sculpt Leggings",
    price: "$110.00",
    priceNum: 110.00,
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
    category: "LEGGINGS",
    description: "Ultra-sculpting visual knit fabric for full flexibility.",
    details: [
      "Seamless zonal knitting technology shapes muscle",
      "High density non-see-through knit structure",
      "Sweat-wicking and quick drying properties",
      "Subtle technical logo branding"
    ],
    specs: {
      material: "88% Nylon / 12% High-Tension Spandex",
      fit: "Sculpted High-Rise Tight Fit",
      care: "Machine wash cold inside out, do not bleach"
    }
  },
  {
    id: "women-performance-bra",
    name: "Performance Sports Bra",
    price: "$60.00",
    priceNum: 60.00,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    category: "SPORTS BRAS",
    description: "Durable medium-impact lift and stabilization.",
    details: [
      "Medium impact support ideal for power training",
      "Comfortable wide criss-cross shoulder straps",
      "Removable quick-drying cups for versatility",
      "Ultra-breathable micro-perforated lining"
    ],
    specs: {
      material: "84% Recycled Polyester / 16% Lycra Elastane",
      fit: "Medium-Impact Sculpting Comfort",
      care: "Machine wash cold with similar colors, line dry"
    }
  },
  {
    id: "women-training-jacket",
    name: "Training Jacket",
    price: "$140.00",
    priceNum: 140.00,
    image: "https://images.unsplash.com/photo-1508441111464-373b185e4c02?q=80&w=800&auto=format&fit=crop",
    category: "JACKETS",
    description: "Wind-resistant breathable utility shield.",
    details: [
      "Durable lightweight windproof dynamic material",
      "Hidden zip pockets for secure tactical storage",
      "Thumbholes in cuffs keep sleeves locked in place",
      "Adjustable toggle hood for extreme conditions"
    ],
    specs: {
      material: "100% Water-Resistant Ripstop Polyester",
      fit: "Athletic Tailored Utility Cover",
      care: "Machine wash cold, zip all closures before washing"
    }
  },
  {
    id: "women-recovery-shorts",
    name: "Recovery Shorts",
    price: "$55.00",
    priceNum: 55.00,
    image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=800&auto=format&fit=crop",
    category: "SHORTS",
    description: "Ultra-soft restorative lounge fit for off days.",
    details: [
      "Breathable heavyweight French Terry cotton",
      "Relaxed side slit hems for free stride range",
      "Super wide elastic waist with soft internal drawcord",
      "Plush texture accelerates mental relaxation state"
    ],
    specs: {
      material: "100% Combed French Terry Cotton",
      fit: "Soft Slouch Restorative Cut",
      care: "Cold wash separate, low heat iron if needed"
    }
  },
  {
    id: "women-essential-tank",
    name: "Essential Tank Top",
    price: "$40.00",
    priceNum: 40.00,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    category: "TANKS",
    description: "Lightweight combed cotton ventilation.",
    details: [
      "Ultra-breathable open side muscle tank style",
      "Draped lightweight cotton jersey blend",
      "Reinforced rib collar and armholes for durability",
      "Soft low-friction active performance touch"
    ],
    specs: {
      material: "60% Organic Combed Cotton / 40% Modal Blend",
      fit: "Relaxed Lightweight Ventilation Fit",
      care: "Tumble dry low or air dry, wash cold"
    }
  },
  {
    id: "new-aero-knit-tee",
    name: "Aero-Knit Compression Tee",
    price: "$85.00",
    priceNum: 85.00,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
    badge: "JUST DROPPED",
    category: "APPAREL",
    description: "Engineered for absolute thermal regulation and high-impact ventilation.",
    details: [
      "Advanced Aero-Knit body temperature management",
      "Dynamic zonal mapping for sweat-prone areas",
      "High-tensile durable stretch performance fibers",
      "Seamless anti-chafing knit construction"
    ],
    specs: {
      material: "90% Nylon / 10% Spandex Blend",
      fit: "Targeted Compression Fit",
      care: "Machine wash cold inside out, air dry"
    }
  },
  {
    id: "new-velocity-pro-x",
    name: "Velocity Pro X",
    price: "$190.00",
    priceNum: 190.00,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
    badge: "JUST DROPPED",
    category: "FOOTWEAR",
    description: "Aerodynamic high-rebound responsive footwear engineered for speed.",
    details: [
      "Nitrogen-infused ultra-responsive foam midsole",
      "Dynamic carbon fiber propulsion plate technology",
      "Sleek reinforced breathable mono-mesh upper",
      "High-traction multi-surface rubber outsole"
    ],
    specs: {
      material: "Sleek Mono-Mesh / Carbon Fiber Plate",
      fit: "Secured Racing Lock Fit",
      care: "Wipe down with damp cloth, do not machine wash"
    }
  },
  {
    id: "new-hydration-vessel",
    name: "Hydration Vessel",
    price: "$45.00",
    priceNum: 45.00,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop",
    category: "EQUIPMENT",
    description: "Insulated double-wall stainless steel performance hydration cylinder.",
    details: [
      "TempShield double-wall vacuum insulation technology",
      "Keeps fluids cold up to 24 hours / hot up to 12 hours",
      "Tactical matte powder-coat outer grip skin",
      "Leakproof heavy-duty wide-mouth cap handle"
    ],
    specs: {
      material: "18/8 Professional-Grade Stainless Steel",
      fit: "950ml Elite High Capacity",
      care: "Hand wash only, BPA-free and toxin-free"
    }
  },
  {
    id: "new-elite-wraps",
    name: "Elite Wraps",
    price: "$30.00",
    priceNum: 30.00,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    category: "EQUIPMENT",
    description: "Professional-grade high-tension compression support wraps.",
    details: [
      "Stiff heavy-duty elasticized fabric blend",
      "Secure hook-and-loop closure adjustment loop",
      "Reinforced flat thumb-loop for easy application",
      "Provides unmatched joint immobilization support"
    ],
    specs: {
      material: "70% Nylon / 30% Elastic Blend",
      fit: "Adjustable Lock Bracing",
      care: "Hand wash cold, air dry to preserve stiffness"
    }
  },
  {
    id: "new-tactical-pack",
    name: "Tactical Pack",
    price: "$120.00",
    priceNum: 120.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    badge: "RESTOCKED",
    category: "EQUIPMENT",
    description: "Heavy-duty tactical military grade utility backpack.",
    details: [
      "Heavy-duty water-resistant high-density ballistic weave",
      "MOLLE exterior modular strap attachments system",
      "Spacious multi-compartment interior laptop sleeve",
      "Padded mesh ventilated shoulder support straps"
    ],
    specs: {
      material: "1000D Ballistic Nylon",
      fit: "45 Liters Heavy Capacity",
      care: "Wipe with wet cloth, air dry naturally"
    }
  },
  {
    id: "best-apex-tee",
    name: "Apex Pro Compression Tee",
    price: "$85.00",
    priceNum: 85.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtOEdBP7GAMkIhe8LdU16rXrFQ24SbIJ_BOoIbXGbMrz__0siSJDiyUwnjm9Jbu_yeU1EyR0iOPqLxmHN-cEk2WAbqbG46aeympHSkwkZws4L_MFCKNSbvFmn54qwAXn4A2diy0RppRTVPWjGol1-MJ0DW2_MDku50zbTazEtLrW2_j-2_WcJ6VArwhLFBtgKNpKUK0o9odhjKEZQyI4jIFU-0S8sRiKAbjotJqw-zY5XSuaw_JZg6zvxGCjZAOyXUjHMX3-y-53KE",
    badge: "BEST SELLER",
    category: "APPAREL",
    description: "Engineered for maximum airflow and muscle support during high-intensity output.",
    details: [
      "Advanced ultra-lightweight dry-core compression weave",
      "Ergonomic flatlock stitch lines mapped to active muscle groups",
      "Dynamic airflow panels across high-heat zones",
      "High-elastic shape retention under extreme stretch loads"
    ],
    specs: {
      material: "88% Polyester / 12% Spandex High-Performance Blend",
      fit: "Extreme Targeted Compression",
      care: "Machine wash cold inside-out, hang dry to preserve tension"
    }
  },
  {
    id: "best-titan-kettlebell",
    name: "Titan Cast Iron Kettlebell",
    price: "$120.00",
    priceNum: 120.00,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOLflOSIUOeI_5yEne4LWxeT2Eyk1e6mW-Tuu7Dx1_xSXrgy5PfOml587KdZDX50Wff7B-eCqz0bzvwrDozWK-GtKYpS8PTTxHehIki2IeUTHQsJabrvUwZle4_iG17IPim3p6gfuVXmyD1FFeRtMRKRCucNA3AZzRzKdNdzgSOosZMD5GwwzRZ5_5qpOpGjAnBwBdT2xAwA97QHCFxP2HMXjtWEkpCfv78Zuy6zURCC7p7GtA_GmlMFnSGmQYU32FyWJ5Wh6KQf97",
    category: "EQUIPMENT",
    description: "Indestructible matte-finish iron. Calibrated for precise functional movement.",
    details: [
      "Single-piece solid cast iron casting with zero welded joints",
      "Textured matte-powder finish ensures chalk adherence & zero slip",
      "Calibrated to strict competition weight tolerances (+/- 1%)",
      "Flat machined base prevents wobble and ensures rock-solid floor stability"
    ],
    specs: {
      material: "100% Solid Premium Grade Cast Iron",
      fit: "Calibrated Weight Distribution & Ergo-Handle Grip",
      care: "Wipe with clean dry cloth after heavy use to prevent moisture buildup"
    }
  },
  {
    id: "best-velocity-trainers",
    name: "Velocity X-Pro Trainers",
    price: "$185.00",
    priceNum: 185.00,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
    badge: "LOW STOCK",
    category: "FOOTWEAR",
    description: "Carbon-plated propulsion technology for aggressive speed work and tactical sprints.",
    details: [
      "Rigid lightweight carbon fiber propulsion plate inside midsole",
      "Nitrogen-injected dynamic energy-return foam cushioning layer",
      "Ripstop ballistic mesh upper with high-friction overlay panels",
      "Multi-directional high-contact rubber lugs for supreme athletic traction"
    ],
    specs: {
      material: "Ballistic Ripstop Nylon / Carbon Plate Core / Nitrogen Foam",
      fit: "Secure Multi-Layer Athletic Lockdown",
      care: "Wipe clean with a damp cloth, do not submerge or machine wash"
    }
  },
  {
    id: "best-elite-isolate",
    name: "Elite Isolate Matrix",
    price: "$65.00",
    priceNum: 65.00,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800&auto=format&fit=crop",
    category: "NUTRITION",
    description: "Rapid-absorbing pure whey isolate. Formulated for immediate post-training recovery.",
    details: [
      "26g of pure cold-filtered whey protein isolate per serving",
      "Loaded with 6.2g of high-potency BCAAs & 4.8g Glutamine",
      "Engineered for instant mixing and rapid gastro-absorption",
      "Zero added sugars, gluten-free, and minimal lactose"
    ],
    specs: {
      material: "Cold-Filtered Whey Isolate, High-Performance Amino Acid Profile",
      fit: "Ultra-Rapid Bio-Absorption",
      care: "Store in a cool, dry place. Reseal tightly after daily use"
    }
  }
];
