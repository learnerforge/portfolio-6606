import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const SECTIONS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'education', label: 'EDUCATION' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'expertise', label: 'AI/ML' },
  { id: 'achievements', label: 'ACHIEVEMENTS' },
  { id: 'certifications', label: 'CERTIFICATIONS' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navigation({ monogram }) {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Top Nav — appears on scroll */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: scrolled ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      >
        <div className="editorial-glass border-b border-[#0F4C3A]/10 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <span className="font-display text-lg text-[#0F4C3A] uppercase tracking-wider">{monogram}</span>
            <div className="flex items-center gap-8">
              {SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id)}
                  className={`nav-link font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    activeSection === id
                      ? 'text-[#0F4C3A] font-bold'
                      : 'text-[#2E2E2E]/50 hover:text-[#0F4C3A]'
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-5 right-5 z-50 md:hidden p-3 rounded-full shadow-lg transition-all duration-300 ${
          scrolled
            ? 'editorial-glass text-[#0F4C3A]'
            : 'bg-white/10 backdrop-blur-md text-[#FFF8F2] border border-white/20'
        }`}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-screen w-72 z-50 bg-[#0F4C3A] paper-texture-deep flex flex-col justify-center px-10 md:hidden"
            >
              <div className="flex flex-col gap-6">
                {SECTIONS.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => handleClick(e, id)}
                    className={`font-mono text-sm uppercase tracking-[0.2em] transition-all duration-300 ${
                      activeSection === id
                        ? 'text-[#FFF8F2] font-bold'
                        : 'text-[#FFF8F2]/50 hover:text-[#FFF8F2]'
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
