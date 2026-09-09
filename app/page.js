import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Credentials from '@/components/Credentials'
import Personality from '@/components/Personality'
import Contact from '@/components/Contact'

export default function Page() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Education />
      <Experience />
      <Projects />
      <Credentials />
      <Personality />
      <Contact />
    </main>
  )
}