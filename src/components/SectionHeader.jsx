import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({ title, cursiveText, slideNumber, lightMode }) {
  const textColor = lightMode ? 'text-[#FFF8F2]' : 'text-[#2E2E2E]';
  const accentColor = lightMode ? 'text-[#FFF8F2]/80' : 'text-[#0F4C3A]';
  const numberColor = lightMode ? 'text-[#FFF8F2]/40' : 'text-[#2E2E2E]/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-16 md:mb-24 w-full"
    >
      <div className="flex justify-between items-start w-full relative z-10">
        <div className="relative">
          {cursiveText && (
            <motion.div
              initial={{ opacity: 0, rotate: -5, x: -20 }}
              whileInView={{ opacity: 1, rotate: -10, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`font-cursive text-4xl md:text-5xl lg:text-6xl ${accentColor} absolute -top-8 md:-top-12 -left-4 md:-left-8 -rotate-12 z-20 pointer-events-none opacity-80`}
            >
              {cursiveText}
            </motion.div>
          )}
          <h2 className={`font-display text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none ${textColor} relative z-10`}>
            {title}
          </h2>
        </div>

        {slideNumber && (
          <div className={`font-mono text-sm tracking-widest mt-4 ${numberColor}`}>
            [{slideNumber}]
          </div>
        )}
      </div>
    </motion.div>
  );
}
