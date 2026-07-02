/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

const chatbotLogoSvg = "/chatbot_logo.svg";

interface FloatingChatbotProps {
  onClick: () => void;
  isOpen?: boolean;
}

export default function FloatingChatbot({ onClick, isOpen }: FloatingChatbotProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <motion.button
      id="floating-chatbot"
      onClick={handleClick}
      aria-label="Access Henry Fit AI Specialist"
      // Bounce animation every few seconds
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 4.5, // Subtle delay between bounces
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
      className="fixed bottom-6 right-6 w-[70px] h-[70px] rounded-full z-50 cursor-pointer flex items-center justify-center bg-[#000000] shadow-[0_0_20px_rgba(0,102,255,0.6)] border border-[#0066ff]/40 focus:outline-none transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(0,102,255,0.95)]"
    >
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center p-0 bg-black">
        <img
          src={chatbotLogoSvg}
          alt="Henry Fit Fitness chatbot logo - Dumbbell speech emblem"
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>
    </motion.button>
  );
}
