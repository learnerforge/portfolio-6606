import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cloud, Layers, GraduationCap, Lock } from 'lucide-react';

const CERT_ICONS = {
  aws: <Cloud size={20} className="text-emerald-600/80" />,
  oracle: <Layers size={20} className="text-emerald-600/80" />,
  nptel: <GraduationCap size={20} className="text-emerald-600/80" />,
  cisco: <Lock size={20} className="text-emerald-600/80" />
};

export default function CertificateCard({ cert, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="cert-card group relative bg-white/50 backdrop-blur-sm border border-[#0F4C3A]/8 rounded-xl p-6 hover:shadow-xl hover:shadow-[#0F4C3A]/5 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#0F4C3A]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {CERT_ICONS[cert.icon] || <ShieldCheck size={20} className="text-emerald-600/80" />}
        </div>

        <div>
          <h4 className="font-semibold text-sm text-[#2E2E2E] mb-1 group-hover:text-[#0F4C3A] transition-colors">
            {cert.name}
          </h4>
          <p className="font-mono text-xs text-[#2E2E2E]/50 uppercase tracking-wider">
            {cert.issuer}
          </p>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-4 h-4 bg-[#0F4C3A]/10 rotate-45 translate-x-2 -translate-y-2"></div>
      </div>
    </motion.div>
  );
}
