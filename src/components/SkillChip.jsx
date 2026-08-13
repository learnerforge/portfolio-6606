import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Terminal, Cpu, Database, Server, Layers, Globe,
  Sparkles, Brain, Bot, MessageSquare, GitBranch,
  Github, Webhook, Binary, Boxes, FileCode, Container, Cloud
} from 'lucide-react';

const SKILL_ICONS = {
  "Python": <FileCode size={18} className="text-[#1B7A5C] group-hover:text-white" />,
  "JavaScript": <FileCode size={18} className="text-amber-600 group-hover:text-white" />,
  "HTML": <Globe size={18} className="text-orange-600 group-hover:text-white" />,
  "CSS": <Layers size={18} className="text-blue-500 group-hover:text-white" />,
  "Markdown": <FileCode size={18} className="text-neutral-600 group-hover:text-white" />,
  "React": <Code2 size={18} className="text-cyan-600 group-hover:text-white" />,
  "Vite": <Sparkles size={18} className="text-purple-600 group-hover:text-white" />,
  "Tailwind CSS": <Layers size={18} className="text-teal-600 group-hover:text-white" />,
  "Redux": <Layers size={18} className="text-purple-600 group-hover:text-white" />,
  "Figma": <Layers size={18} className="text-pink-600 group-hover:text-white" />,
  "FastAPI": <ZapIcon className="text-emerald-700 group-hover:text-white" />,
  "Flask": <Server size={18} className="text-neutral-700 group-hover:text-white" />,
  "Django": <Server size={18} className="text-emerald-700 group-hover:text-white" />,
  "PostgreSQL": <Database size={18} className="text-sky-700 group-hover:text-white" />,
  "SQLite": <Database size={18} className="text-sky-700 group-hover:text-white" />,
  "Redis": <Database size={18} className="text-red-600 group-hover:text-white" />,
  "Docker": <Container size={18} className="text-sky-600 group-hover:text-white" />,
  "Git": <GitBranch size={18} className="text-orange-700 group-hover:text-white" />,
  "GitHub": <Github size={18} className="text-neutral-800 group-hover:text-white" />,
  "GitHub Actions": <ZapIcon className="text-sky-700 group-hover:text-white" />,
  "Linux": <Terminal size={18} className="text-neutral-700 group-hover:text-white" />,
  "Cloudflare": <Cloud size={18} className="text-orange-600 group-hover:text-white" />,
  "Nginx": <Server size={18} className="text-emerald-700 group-hover:text-white" />,
  "LLM Integration": <Bot size={18} className="text-blue-600 group-hover:text-white" />,
  "Prompt Engineering": <Terminal size={18} className="text-emerald-600 group-hover:text-white" />,
  "NLP": <MessageSquare size={18} className="text-teal-700 group-hover:text-white" />,
  "spaCy": <Brain size={18} className="text-blue-600 group-hover:text-white" />,
  "scikit-learn": <Brain size={18} className="text-blue-600 group-hover:text-white" />,
  "Machine Learning": <Brain size={18} className="text-[#0F4C3A] group-hover:text-white" />,
  "TextRank": <MessageSquare size={18} className="text-rose-700 group-hover:text-white" />,
  "TF-IDF": <Binary size={18} className="text-indigo-600 group-hover:text-white" />,
  "Q-Learning": <Cpu size={18} className="text-purple-700 group-hover:text-white" />,
  "System Design": <Boxes size={18} className="text-[#0F4C3A] group-hover:text-white" />
};

function ZapIcon({ className }) {
  return <Code2 size={18} className={className} />;
}

export default function SkillChip({ skill, index }) {
  const skillName = typeof skill === 'string' ? skill : skill?.name || '';
  const icon = SKILL_ICONS[skillName] || <Code2 size={18} className="text-[#0F4C3A] group-hover:text-white" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.02,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="inline-block"
    >
      <div className="group skill-chip px-5 py-3.5 rounded-2xl border border-[#0F4C3A]/15 bg-white/70 backdrop-blur-md flex flex-col items-center gap-2 hover:scale-105 hover:bg-[#0F4C3A] hover:text-white hover:border-[#0F4C3A] hover:shadow-xl hover:shadow-[#0F4C3A]/20 cursor-pointer transition-all duration-300 min-w-[100px]">
        <div className="p-1.5 rounded-xl bg-[#FFF8F2] border border-[#0F4C3A]/10 group-hover:bg-white/20 group-hover:border-transparent transition-colors">
          {icon}
        </div>
        <span className="font-mono text-[11px] font-semibold text-[#2E2E2E]/90 group-hover:text-white uppercase tracking-wider text-center">
          {skillName}
        </span>
      </div>
    </motion.div>
  );
}
