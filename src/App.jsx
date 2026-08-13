import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Linkedin, Github, ArrowRight,
  CheckCircle2, ExternalLink,
  Calendar, MapPin, GraduationCap, Code2, X,
  Brain, Bot, Cpu, MessageSquare,
  ArrowLeft, Rocket, Wrench
} from 'lucide-react';
import { portfolioData } from './data/portfolioData';
import Navigation from './components/Navigation';
import SectionHeader from './components/SectionHeader';
import ProjectCard from './components/ProjectCard';
import CertificateCard from './components/CertificateCard';
import AwardCard from './components/AwardCard';
import SkillChip from './components/SkillChip';

export default function App() {
  const {
    personalInfo, aboutMe, education, internships,
    projects, aiExpertise, achievements, certifications, codingProfiles, skillsSummary
  } = portfolioData;

  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="bg-[#FFF8F2] text-[#2E2E2E] overflow-x-hidden selection:bg-[#0F4C3A] selection:text-white relative">

      {/* Top Editorial Navigation */}
      <Navigation monogram={personalInfo.monogram} />

      {/* ============ COVER HERO SECTION ============ */}
      <section
        id="slide-1"
        className="w-screen h-screen relative bg-[#0F4C3A] paper-texture-deep overflow-hidden flex flex-col justify-between"
      >
        {/* Top Metadata Labels */}
        <div className="w-full px-8 md:px-12 pt-8 md:pt-10 flex justify-between items-center z-20 select-none">
          <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#FFF8F2]/75 font-bold">
            {personalInfo.firstName} {personalInfo.lastName}
          </div>
          <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#FFF8F2]/75 font-bold">
            SLIDE 01 // COVER
          </div>
        </div>

        {/* Central Editorial Typography & Clean Cut-out Portrait */}
        <div className="relative w-full h-full flex-1 flex items-center justify-between px-8 md:px-12">
          {/* Cursive Accent "Build" */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="absolute left-8 md:left-12 font-cursive text-[#FFF8F2]/90 rotate-[-5deg] z-10 select-none pointer-events-none"
            style={{
              bottom: 'calc(32% + 2vw)',
              fontSize: 'clamp(4rem, 10vw, 11rem)',
            }}
          >
            Build
          </motion.span>

          {/* Large PORTFOLIO Display Text */}
          <motion.h1
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-8 md:left-12 font-display text-[#FFF8F2]/95 uppercase tracking-tight leading-[0.85] z-[5] select-none pointer-events-none"
            style={{
              bottom: '20%',
              fontSize: 'clamp(3.5rem, 13vw, 12.5rem)',
            }}
          >
            PORTFOLIO
          </motion.h1>

          {/* Profile Portrait Anchored Right */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-[3%] md:right-[5%] bottom-0 z-10 pointer-events-none flex items-end"
            style={{ height: '86%' }}
          >
            <div className="h-full filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)] flex items-end">
              <img
                src={personalInfo.avatarUrl}
                alt="Ganesh Bakkera portrait cutout"
                className="h-[72%] w-auto object-contain rounded-t-[2rem] select-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer Metadata Labels with Thin Horizontal Line */}
        <div className="w-full px-8 md:px-12 pb-8 md:pb-10 flex justify-between items-center z-20 select-none border-t border-white/15 pt-4">
          <div className="font-serif italic text-xs md:text-sm text-[#FFF8F2]/80 font-bold">
            {personalInfo.firstName} {personalInfo.lastName}
          </div>
          <div className="font-serif italic text-xs md:text-sm text-[#FFF8F2]/80 text-right">
            AI / ML Engineer | Full Stack Developer
          </div>
        </div>
      </section>


      {/* ============ ABOUT SECTION ============ */}
      <section id="about" className="min-h-screen bg-[#FFF8F2] paper-texture py-24 md:py-32 px-8 md:px-16 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="ABOUT" cursiveText="Hello" slideNumber="02" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left: Portrait */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4"
            >
              <div className="w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white img-zoom card-3d">
                <img
                  src={personalInfo.avatarUrl}
                  alt="Ganesh Bakkera"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Right: Bio & Key Focus Areas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-8 space-y-8"
            >
              <div className="space-y-1">
                <span className="font-cursive text-5xl text-[#1B7A5C]">Ganesh</span>
                <h3 className="font-display text-4xl md:text-5xl text-[#0F4C3A] uppercase tracking-wide">BAKKERA</h3>
              </div>

              <div className="border-l-4 border-[#0F4C3A] pl-6">
                <p className="font-editorial text-lg md:text-xl text-[#2E2E2E]/85 leading-relaxed">
                  {aboutMe.description}
                </p>
              </div>

              <div className="border-t border-[#0F4C3A]/15 pt-8">
                <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[#0F4C3A] mb-6 font-bold">Key Focus Areas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {aboutMe.interests.map((interest, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.06 }}
                      className="p-4 rounded-2xl emerald-glassmorphism flex items-center gap-2.5 text-xs font-semibold text-[#2E2E2E]/90 shadow-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0F4C3A] shrink-0" />
                      {interest}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ============ EXPERIENCE SECTION ============ */}
      <section id="experience" className="min-h-screen bg-[#FFF8F2] paper-texture py-24 md:py-32 px-8 md:px-16 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="EXPERIENCE" cursiveText="Professional Timeline" slideNumber="03" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {internships.map((intern, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="emerald-glassmorphism rounded-3xl p-8 md:p-10 card-3d group flex flex-col justify-between relative overflow-hidden"
              >
                {/* Current Internship Badge */}
                {intern.period.includes("Present") && (
                  <div className="absolute top-0 right-0 bg-[#0F4C3A] text-white font-mono text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl font-bold shadow-md">
                    CURRENT INTERNSHIP
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-4 pr-12">
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl text-[#0F4C3A] uppercase tracking-wide group-hover:text-[#1B7A5C] transition-colors">{intern.company}</h3>
                      <p className="font-serif italic text-base text-[#2E2E2E]/70 mt-1">{intern.role}</p>
                    </div>
                  </div>

                  <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] font-mono text-[10px] uppercase font-bold tracking-wider mb-4 border border-[#0F4C3A]/15">
                    {intern.period}
                  </div>

                  <p className="text-sm text-[#2E2E2E]/80 font-editorial leading-relaxed mb-6">{intern.summary}</p>

                  <div className="space-y-3 mb-6">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0F4C3A] font-bold">Key Deliverables</h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {intern.achievements.map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-[#2E2E2E]/85 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C3A] shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-5 border-t border-[#0F4C3A]/15">
                  {intern.tags.map((tag, i) => (
                    <span key={i} className="px-3.5 py-1 rounded-full border border-[#0F4C3A]/20 bg-white/70 font-mono text-[10px] text-[#1B7A5C] uppercase tracking-wider font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Open-to-work card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="rounded-3xl p-8 md:p-10 bg-[#0F4C3A] paper-texture-deep text-white relative overflow-hidden flex flex-col justify-center card-3d group"
            >
              <div className="absolute -right-6 -top-6 font-display text-[10rem] leading-none text-white/5 font-bold select-none pointer-events-none">
                ↑
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
                  <Rocket size={26} className="text-amber-200" />
                </div>
                <h3 className="font-display text-3xl uppercase tracking-wide">Currently Open To</h3>
                <p className="font-serif italic text-base text-[#FFF8F2]/80">
                  AI/ML internships · research collaborations · hackathon teams · open-source contributions
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white bg-white/15 border border-white/25 px-5 py-2.5 rounded-full hover:bg-white/25 transition-colors font-bold"
                >
                  LET'S CONNECT <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ============ EDUCATION SECTION ============ */}
      <section id="education" className="min-h-screen bg-[#FFF8F2] paper-texture py-24 md:py-32 px-8 md:px-16 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="EDUCATION" cursiveText="Academic" slideNumber="04" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="emerald-glassmorphism rounded-3xl p-8 md:p-12 card-3d"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#0F4C3A]/15">
              <div className="space-y-2">
                <h3 className="font-display text-3xl md:text-4xl text-[#0F4C3A] uppercase">
                  {education[0].institution}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-[#2E2E2E]/70 font-medium">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-[#0F4C3A]" />
                    {education[0].location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-[#0F4C3A]" />
                    {education[0].period}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#0F4C3A] text-white px-6 py-4 rounded-2xl shadow-xl shadow-[#0F4C3A]/20">
                <GraduationCap size={28} className="text-[#FFF8F2]" />
                <div>
                  <span className="font-mono text-[10px] text-[#FFF8F2]/70 uppercase tracking-[0.2em] block font-bold">Degree</span>
                  <span className="font-display text-2xl text-white">B.Tech</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8">
              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[#0F4C3A] font-bold">Degree & Specialization</h4>
                <p className="font-serif italic text-xl text-[#2E2E2E] font-semibold">{education[0].degree}</p>
                <p className="text-base text-[#2E2E2E]/80 font-medium">{education[0].major}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[#0F4C3A] font-bold">Core Coursework</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {education[0].coursework.map((course, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm font-medium text-[#2E2E2E]/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C3A] shrink-0" />
                      {course}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ============ PROJECTS SECTION ============ */}
      <section id="projects" className="py-24 md:py-32 px-8 md:px-16 overflow-hidden">
        {/* Projects Editorial Banner */}
        <div className="bg-[#0F4C3A] paper-texture-deep -mx-8 md:-mx-16 px-8 md:px-16 py-20 md:py-28 mb-24 rounded-3xl shadow-2xl">
          <div className="max-w-6xl mx-auto relative">
            <span className="font-cursive text-5xl text-[#FFF8F2]/80 absolute -top-10 left-0 rotate-[-5deg]">Featured</span>
            <motion.h2
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[15vw] md:text-[12vw] lg:text-[170px] leading-none text-white uppercase tracking-tight select-none"
            >
              PROJECTS
            </motion.h2>
            <p className="font-serif italic text-white/80 text-lg md:text-xl mt-4">
              AI Products, Full-Stack Systems & Open-Source Engineering
            </p>
          </div>
        </div>

        {/* Project Editorial Cards */}
        <div className="max-w-6xl mx-auto">
          {projects.map((proj, idx) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              index={idx}
              isReversed={idx % 2 !== 0}
              onOpenCaseStudy={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      </section>


      {/* ============ AI/ML EXPERTISE SECTION ============ */}
      <section id="expertise" className="min-h-screen bg-[#FFF8F2] paper-texture py-24 md:py-32 px-8 md:px-16 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="AI/ML EXPERTISE" cursiveText="Domains" slideNumber="06" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiExpertise.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="emerald-glassmorphism rounded-2xl p-6 md:p-8 card-3d group flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0F4C3A]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0F4C3A] transition-colors duration-300">
                    {idx === 0 && <Bot size={20} className="text-[#0F4C3A] group-hover:text-white transition-colors" />}
                    {idx === 1 && <MessageSquare size={20} className="text-[#0F4C3A] group-hover:text-white transition-colors" />}
                    {idx === 2 && <Brain size={20} className="text-[#0F4C3A] group-hover:text-white transition-colors" />}
                    {idx === 3 && <Cpu size={20} className="text-[#0F4C3A] group-hover:text-white transition-colors" />}
                    {idx === 4 && <Wrench size={20} className="text-[#0F4C3A] group-hover:text-white transition-colors" />}
                  </div>
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                    item.level === 'Advanced'
                      ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]'
                      : item.level === 'Intermediate'
                        ? 'bg-[#1B7A5C]/10 text-[#1B7A5C] border-[#1B7A5C]/30'
                        : 'bg-white text-[#2E2E2E]/60 border-[#2E2E2E]/20'
                  }`}>
                    {item.level}
                  </span>
                </div>
                <h3 className="font-display text-lg md:text-xl text-[#2E2E2E] uppercase group-hover:text-[#0F4C3A] transition-colors">
                  {item.domain}
                </h3>
                <p className="text-xs md:text-sm text-[#2E2E2E]/75 leading-relaxed font-editorial">
                  {item.details}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ============ ACHIEVEMENTS SECTION ============ */}
      <section id="achievements" className="py-24 md:py-32 px-8 md:px-16 overflow-hidden bg-[#0F4C3A] paper-texture-deep">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="ACHIEVEMENTS" cursiveText="Honors & Momentum" slideNumber="07" lightMode />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((award, idx) => (
              <AwardCard key={idx} award={award} index={idx} />
            ))}
          </div>
        </div>
      </section>


      {/* ============ CERTIFICATIONS SECTION ============ */}
      <section id="certifications" className="py-24 md:py-32 px-8 md:px-16 overflow-hidden bg-[#FFF8F2] paper-texture">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="CERTIFICATIONS" cursiveText="Verified Credentials" slideNumber="08" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert, cIdx) => (
              <CertificateCard key={cIdx} cert={cert} index={cIdx} />
            ))}
          </div>

          {/* Coding Profiles */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <Code2 size={18} className="text-[#0F4C3A]" />
              <h3 className="font-display text-2xl md:text-3xl text-[#0F4C3A] uppercase">Coding Profiles</h3>
              <div className="section-divider flex-1" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {codingProfiles.map((profile, idx) => (
                <motion.a
                  key={idx}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group p-6 rounded-2xl emerald-glassmorphism card-3d flex flex-col items-center gap-3 hover:scale-105 transition-transform"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#0F4C3A]/10 flex items-center justify-center group-hover:bg-[#0F4C3A] transition-colors">
                    <Code2 size={20} className="text-[#0F4C3A] group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#2E2E2E]/90 uppercase tracking-wider">
                    {profile.name}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-[#0F4C3A] opacity-0 group-hover:opacity-100 transition-opacity">
                    VISIT <ExternalLink size={11} />
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ============ TECHNICAL SKILLS SECTION ============ */}
      <section id="skills" className="py-24 md:py-32 px-8 md:px-16 overflow-hidden bg-[#FFF8F2] paper-texture">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="TECHNICAL SKILLS" cursiveText="Proficiencies & Stack" slideNumber="09" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {skillsSummary.map((skill, idx) => (
              <SkillChip key={idx} skill={skill} index={idx} />
            ))}
          </motion.div>
        </div>
      </section>


      {/* ============ CONTACT SECTION ============ */}
      <section id="contact" className="py-24 md:py-32 px-8 md:px-16 overflow-hidden bg-[#0F4C3A] paper-texture-deep">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="REACH OUT" cursiveText="Let's Connect" slideNumber="10" lightMode />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left: Contact Portrait Card */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.03, rotateY: 3 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 emerald-glassmorphism p-2 relative group"
              >
                <img
                  src={personalInfo.contactPortraitUrl}
                  alt="Ganesh Bakkera portrait"
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-md transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C3A]/70 via-transparent to-transparent opacity-80 rounded-2xl pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-[#FFF8F2] z-10">
                  <h4 className="font-display text-2xl uppercase tracking-wide">Ganesh Bakkera</h4>
                  <p className="font-serif italic text-xs text-[#FFF8F2]/80 mt-1">AI/ML Research Intern · Full Stack Developer</p>
                </div>
              </motion.div>
            </div>

            {/* Right: Contact Action Cards */}
            <div className="lg:col-span-7 space-y-8">
              <p className="font-editorial text-xl md:text-2xl text-[#FFF8F2]/90 leading-relaxed">
                I am open to AI/ML engineering roles, full-stack development opportunities, research collaborations, and high-impact technical work. Feel free to connect!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Email */}
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/25 transition-all group shadow-xl hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#0F4C3A] text-[#FFF8F2] transition-colors">
                    <Mail size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FFF8F2]/60 block font-bold">Email</span>
                    <span className="text-[#FFF8F2] text-xs font-semibold truncate block">{personalInfo.email}</span>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/25 transition-all group shadow-xl hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#0F4C3A] text-[#FFF8F2] transition-colors">
                    <Linkedin size={22} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FFF8F2]/60 block font-bold">LinkedIn</span>
                    <span className="text-[#FFF8F2] text-xs font-semibold">linkedin.com/in/ganesh-bakkera-898a0331b</span>
                  </div>
                </a>

                {/* GitHub */}
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/25 transition-all group shadow-xl hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#0F4C3A] text-[#FFF8F2] transition-colors">
                    <Github size={22} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FFF8F2]/60 block font-bold">GitHub</span>
                    <span className="text-[#FFF8F2] text-xs font-semibold">github.com/learnerforge</span>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 border border-white/15 transition-all group shadow-xl cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#0F4C3A] text-[#FFF8F2] transition-colors">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FFF8F2]/60 block font-bold">Location</span>
                    <span className="text-[#FFF8F2] text-xs font-semibold">Hyderabad, Telangana, India</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ============ FOOTER ============ */}
      <footer className="bg-[#0F4C3A] border-t border-white/15 py-8 px-8 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[#FFF8F2]/60 text-xs font-mono">
          <p className="font-bold">GANESH BAKKERA</p>
          <p>AI / ML Engineer | Full Stack Developer</p>
          <p>© {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </footer>


      {/* ============ INTERACTIVE PROJECT DETAIL MODAL ============ */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFF8F2] paper-texture rounded-3xl border border-[#0F4C3A]/20 p-8 md:p-12 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto my-auto"
            >
              {/* Close / Back Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 px-4 py-2 rounded-full bg-[#0F4C3A]/10 hover:bg-[#0F4C3A] text-[#0F4C3A] hover:text-white transition-colors flex items-center gap-2 font-mono text-xs font-bold"
              >
                <X size={16} /> BACK TO PROJECTS
              </button>

              <div className="space-y-8 pt-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#0F4C3A] font-bold">
                      FULL PROJECT DETAILS // {selectedProject.number || "01"}
                    </span>
                    {selectedProject.association && (
                      <span className="px-3 py-0.5 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] font-mono text-[10px] uppercase font-semibold">
                        {selectedProject.association}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-3xl md:text-5xl text-[#0F4C3A] uppercase mb-4 leading-tight">
                    {selectedProject.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tags?.map((t, i) => (
                      <span key={i} className="px-3.5 py-1 rounded-full border border-[#0F4C3A]/20 bg-white font-mono text-[10px] uppercase font-bold text-[#1B7A5C]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Short Overview */}
                <div className="p-6 rounded-2xl bg-white border border-[#0F4C3A]/10">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#0F4C3A] font-bold mb-2">
                    Project Overview
                  </h4>
                  <p className="font-editorial text-base text-[#2E2E2E]/85 leading-relaxed">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>
                </div>

                {/* Problem & Solution Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedProject.problem && (
                    <div className="p-6 rounded-2xl bg-white border border-[#0F4C3A]/10 shadow-sm">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-[#0F4C3A] font-bold mb-2">
                        The Motivation & Problem
                      </h4>
                      <p className="font-editorial text-sm text-[#2E2E2E]/80 leading-relaxed">
                        {selectedProject.problem}
                      </p>
                    </div>
                  )}

                  {selectedProject.solution && (
                    <div className="p-6 rounded-2xl bg-[#0F4C3A] text-white shadow-sm">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-[#FFF8F2]/80 font-bold mb-2">
                        The Solution & Architecture
                      </h4>
                      <p className="font-editorial text-sm text-white/90 leading-relaxed">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>

                {/* Key Features */}
                {selectedProject.features && (
                  <div className="space-y-3 pt-2">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-[#0F4C3A] font-bold">
                      Key Features & System Capabilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.features.map((feat, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-white border border-[#0F4C3A]/10 flex items-start gap-2.5 text-xs text-[#2E2E2E]/90 font-medium">
                          <CheckCircle2 size={16} className="text-[#0F4C3A] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI / Tech Stack Details */}
                {selectedProject.aiTech && (
                  <div className="p-4 rounded-xl bg-[#0F4C3A]/8 border border-[#0F4C3A]/15 font-mono text-xs text-[#0F4C3A]">
                    <span className="font-bold uppercase tracking-wider block mb-1">Tech Stack & AI Architecture:</span>
                    {selectedProject.aiTech}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#0F4C3A]/15">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-3 rounded-full border border-[#0F4C3A]/30 text-[#0F4C3A] hover:bg-[#0F4C3A]/10 font-mono text-[#0F4C3A] text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                  >
                    <ArrowLeft size={15} /> BACK TO PROJECTS
                  </button>

                  {selectedProject.github && typeof selectedProject.github === 'string' && (selectedProject.github.startsWith('https://') || selectedProject.github.startsWith('http://')) ? (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-[#0F4C3A] text-white hover:bg-[#1B7A5C] font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-lg"
                    >
                      <Github size={16} /> View GitHub Repository
                    </a>
                  ) : (
                    <span className="px-6 py-3 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] font-mono text-xs uppercase tracking-widest font-bold italic">
                      Repository Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
