import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

export default function AwardCard({ award, index }) {
  const { title, org, desc, date } = award;
  const numString = (index + 1).toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        rotateY: index % 2 === 0 ? 5 : -5,
        rotateX: -4,
        scale: 1.03,
        y: -10
      }}
      className="relative rounded-3xl p-8 md:p-10 border border-white/20 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl shadow-2xl shadow-black/30 group overflow-hidden transform-style-3d cursor-pointer"
    >
      {/* Editorial Oversized Number Background */}
      <div className="absolute -right-4 -bottom-6 font-display text-[10rem] md:text-[12rem] leading-none text-white/5 font-bold select-none pointer-events-none group-hover:text-white/10 transition-colors duration-500">
        {numString}
      </div>

      {/* Atmospheric Radial Glow */}
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500 pointer-events-none" />

      {/* Card Header: Trophy & Date Badge */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-black/20">
          <Trophy size={28} className="text-amber-200 filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]" />
        </div>

        {date && (
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-[#FFF8F2] shadow-sm backdrop-blur-md">
            {date}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2 text-amber-200/90 font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
          <Sparkles size={12} /> ACHIEVEMENT {numString}
        </div>

        <h3 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide group-hover:text-amber-100 transition-colors duration-300 leading-tight">
          {title}
        </h3>

        <h4 className="font-serif italic text-base text-[#FFF8F2]/80 font-medium">
          {org}
        </h4>

        <p className="font-editorial text-sm text-[#FFF8F2]/75 leading-relaxed pt-2">
          {desc}
        </p>
      </div>

      {/* Shimmer Border Light Accent */}
      <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-white/40 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
}
