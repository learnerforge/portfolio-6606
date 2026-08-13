import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Sparkles, Flame, BrainCircuit } from 'lucide-react';

export default function ProjectCard({ project, index, isReversed, onOpenCaseStudy }) {
  const { id, title, number, tags, description, longDescription, screenshots, github, isFlagship } = project;
  const numString = number || (index + 1).toString().padStart(2, '0');
  const hasValidGithub = github && typeof github === 'string' && (github.startsWith('https://') || github.startsWith('http://'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center w-full mb-32 group ${
        isFlagship ? 'p-8 md:p-12 rounded-3xl emerald-glassmorphism border-2 border-[#0F4C3A]/30 shadow-2xl relative' : ''
      }`}
    >
      {/* Flagship Badge for Project #1 */}
      {isFlagship && (
        <div className="absolute -top-4 left-8 md:left-12 bg-[#0F4C3A] text-white font-mono text-[10px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1.5">
          <Flame size={14} className="text-amber-300" /> FLAGSHIP PROJECT 01
        </div>
      )}

      {/* Left Column: Project Info */}
      <div className="w-full lg:w-5/12 flex flex-col relative z-10">
        <div className="project-number text-[8rem] md:text-[12rem] leading-none text-[#0F4C3A]/10 font-display absolute -top-16 md:-top-24 -left-8 md:-left-12 -z-10 select-none pointer-events-none font-bold">
          {numString}
        </div>

        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#0F4C3A] mb-2 font-bold flex items-center gap-2">
          <Sparkles size={14} /> PROJECT {numString}
        </span>

        <h3
          onClick={() => onOpenCaseStudy && onOpenCaseStudy(project)}
          className="font-serif italic text-4xl md:text-5xl text-[#2E2E2E] mb-6 cursor-pointer hover:text-[#0F4C3A] transition-colors leading-tight"
        >
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags?.map((tag, i) => (
            <span key={i} className="px-3.5 py-1 rounded-full border border-[#0F4C3A]/20 bg-white/70 font-mono text-[10px] uppercase tracking-wider text-[#1B7A5C] font-semibold">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[#2E2E2E]/85 text-lg font-light leading-relaxed mb-6 font-editorial">
          {description}
        </p>

        {longDescription && (
          <p className="text-[#2E2E2E]/65 text-sm leading-relaxed mb-8 font-editorial">
            {longDescription}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 mt-auto">
          <button
            onClick={() => onOpenCaseStudy && onOpenCaseStudy(project)}
            className="px-6 py-3.5 rounded-full bg-[#0F4C3A] text-[#FFF8F2] hover:bg-[#1B7A5C] transition-all duration-300 font-mono text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#0F4C3A]/20 hover:scale-105 font-bold"
          >
            <span>VIEW FULL PROJECT →</span>
          </button>

          {hasValidGithub ? (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#2E2E2E]/70 hover:text-[#0F4C3A] transition-colors group/btn font-semibold"
            >
              <span className="border-b border-transparent group-hover/btn:border-[#0F4C3A] transition-colors pb-0.5">GitHub Repository</span>
              <Github size={15} className="group-hover/btn:scale-110 transition-transform" />
            </a>
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#2E2E2E]/40 italic">
              Repository Coming Soon
            </span>
          )}
        </div>
      </div>

      {/* Right Column: 3D Glassmorphism Browser Preview */}
      <div
        onClick={() => onOpenCaseStudy && onOpenCaseStudy(project)}
        className="w-full lg:w-7/12 card-3d perspective-1000 cursor-pointer"
      >
        <motion.div
          whileHover={{ rotateY: isReversed ? -4 : 4, rotateX: 3, scale: 1.03, y: -8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl overflow-hidden emerald-glassmorphism transform-style-3d relative group/card p-2"
        >
          {/* Browser Chrome Header */}
          <div className="h-9 w-full bg-[#0F4C3A]/10 border-b border-[#0F4C3A]/15 flex items-center px-4 gap-2 backdrop-blur-md justify-between rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0F4C3A]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#1B7A5C]/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0F4C3A]/20"></div>
            </div>
            <div className="px-4 py-0.5 rounded-md bg-white/80 border border-[#0F4C3A]/10 text-[9px] font-mono text-[#2E2E2E]/60 tracking-wider truncate max-w-[240px]">
              https://ganeshbakkera.dev/projects/{id}
            </div>
            <ExternalLink size={13} className="text-[#0F4C3A]/60" />
          </div>

          {/* Dedicated Screenshot Frame */}
          <div className="relative aspect-[16/10] bg-[#FFF8F2]/60 p-2 flex flex-col justify-between overflow-hidden rounded-b-xl">
            {screenshots?.[0]?.url ? (
              <img
                src={screenshots[0].url}
                alt={`${title} project dashboard interface`}
                className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-700 ease-out group-hover/card:scale-105"
              />
            ) : (
              <div className="w-full h-full border-2 border-dashed border-[#0F4C3A]/25 rounded-xl flex flex-col items-center justify-center bg-white/70 group-hover/card:bg-white/90 transition-colors p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#0F4C3A]/10 flex items-center justify-center text-[#0F4C3A] mb-3 group-hover/card:scale-110 transition-transform">
                  <BrainCircuit size={28} />
                </div>
                <h4 className="font-display text-xl uppercase text-[#0F4C3A] mb-1">{title}</h4>
                <p className="font-mono text-xs text-[#2E2E2E]/60 uppercase tracking-widest mb-4">
                  Interactive Product Showcase
                </p>
                <span className="px-4 py-2 rounded-full bg-[#0F4C3A] text-white font-mono text-[10px] uppercase tracking-widest font-semibold shadow-md">
                  VIEW FULL PROJECT →
                </span>
              </div>
            )}

            {/* Glass Overlay & Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#0F4C3A]/5 to-white/20 pointer-events-none rounded-lg" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
