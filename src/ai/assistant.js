import { portfolio } from '../data/portfolio.js'

/**
 * Assistant — a lightweight, deterministic intent engine that answers
 * recruiter / visitor questions from the portfolio data and can optionally
 * control the website (navigate to a section, open mail, open links).
 *
 * Returns { text, action } where action is one of:
 *   { type: 'goto',   id }         scroll to a section
 *   { type: 'mailto' }             open the contact email
 *   { type: 'link', url }          open an external link
 *   null                           plain text answer
 */

const p = portfolio.profile

export const SUGGESTIONS = [
  'What does Ganesh specialize in?',
  'Show your projects',
  'Current role and experience',
  'How can I reach you?'
]

const SECTIONS = [
  { id: 'about', labels: ['about', 'introduction', 'introduce', 'who is ganesh', 'about you', 'yourself'] },
  { id: 'experience', labels: ['experience', 'internship', 'work history', 'career', 'job', 'professional', 'work'] },
  { id: 'education', labels: ['education', 'college', 'university', 'degree', 'academics', 'studies'] },
  { id: 'projects', labels: ['projects', 'project', 'builds', 'products', 'work samples', 'portfolio'] },
  { id: 'skills', labels: ['skills', 'skill set', 'tech stack', 'technologies', 'tools', 'languages', 'stack'] },
  { id: 'expertise', labels: ['expertise', 'specialties', 'specialise', 'specialize', 'strengths', 'domains'] },
  { id: 'achievements', labels: ['achievements', 'awards', 'accomplishments', 'milestones'] },
  { id: 'certifications', labels: ['certifications', 'certified', 'certification', 'aws', 'cisco', 'nptel', 'oracle'] },
  { id: 'contact', labels: ['contact', 'email', 'reach', 'get in touch', 'talk to', 'connect', 'recruit', 'interview'] }
]

const NAV_VERBS = /\b(show|go|take me|navigate|open|see|jump|scroll to|view|move)\b/

const norm = (s) => ' ' + s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ') + ' '

function hasAny(text, words) {
  return words.some((w) => text.includes(` ${w} `))
}

function findSection(text) {
  for (const s of SECTIONS) {
    if (s.labels.some((l) => text.includes(` ${l} `))) return s
  }
  return null
}

function projectKeywords(q) {
  const map = [
    { id: 'pathforge-ai', words: ['pathforge', 'roadmap', 'learning path', 'roadmaps'] },
    { id: 'ai-github-repo-analyzer', words: ['repo quality', 'analyzer', 'quality analys', 'github audit', 'audit'] },
    { id: 'remote-mouse', words: ['remote mouse', 'wireless mouse', 'mouse', 'media remote', 'phone'] },
    { id: 'nexasite', words: ['nexasite', 'landing page', 'template', 'landing-page'] },
    { id: 'js-components', words: ['js components', '3d component', 'component library', 'glsl', 'shader'] },
    { id: 'push-to-github', words: ['push to github', 'repo manager', 'git manager', 'push-to-github'] }
  ]
  return map.find((m) => m.words.some((w) => q.includes(` ${w} `)))
}

export function ask(rawQuery) {
  const q = norm(rawQuery)
  const nav = findSection(q)

  // 1. explicit navigation ("show me X", "go to X")
  if (nav && NAV_VERBS.test(q)) {
    const noun = nav.id === 'contact' ? 'contact details' : `${nav.id} section`
    return { text: `Taking you to the ${noun}.`, action: { type: 'goto', id: nav.id } }
  }

  // 2. greetings
  if (/\b(hi|hello|hey|namaste|good morning|good evening|good afternoon)\b/.test(q)) {
    return {
      text: "Hi! I'm Ganesh's portfolio assistant. I can answer questions about his experience, skills, projects and education — and I can take you straight to any section. Try \"show me projects\" or \"what does he specialize in?\"",
      action: null
    }
  }

  // 3. help / capabilities
  if (/\b(help|what can you do|how do you work|what can i ask|commands)\b/.test(q)) {
    return {
      text: 'You can ask me things like:\n· "What does Ganesh specialize in?"\n· "Tell me about his current role"\n· "Show your projects"\n· "Where can I reach you?"\nI can also navigate the site for you, open his GitHub/LinkedIn, or start an email.',
      action: null
    }
  }

  // 4. contact / hire intent
  if (/\b(hire|recruit|recruitment|interview|hiring)\b/.test(q)) {
    return {
      text: `Ganesh is open to ${portfolio.openTo.slice(0, 2).join(', ')}. The quickest way to reach him is email: ${p.email} — or use "Go to contact" to jump to the section.`,
      action: { type: 'mailto' }
    }
  }
  if (/\b(email|contact|reach|mail|message)\b/.test(q)) {
    return {
      text: `You can reach Ganesh directly at ${p.email}. I've opened a draft for you.`,
      action: { type: 'mailto' }
    }
  }

  // 5. thanks / small talk
  if (/\b(thanks|thank you|thx|awesome|great|cool)\b/.test(q)) {
    return { text: "Happy to help! Anything else about Ganesh's experience, projects or skills?", action: null }
  }

  // 6. current work / what he's doing right now
  if (/\b(currently working|working on|current work|what is he doing|right now|current project)\b/.test(q)) {
    const e = portfolio.experience[0]
    const line = e
      ? `${e.role} @ ${e.company}${e.period ? ` (${e.period})` : ''}${e.summary ? ` — ${e.summary}` : '.'}`
      : 'Ganesh is currently building full-stack AI products end to end.'
    return {
      text: `${line}\n\nFlagship: ${portfolio.projects[0].title} — ${portfolio.projects[0].subtitle}.`,
      action: null
    }
  }

  // 7. specific project
  const projHit = projectKeywords(q)
  if (projHit) {
    const pr = portfolio.projects.find((x) => x.id === projHit.id)
    return {
      text: `${pr.title} — ${pr.subtitle}.\n\n${pr.description}\n\nStack: ${pr.stack}`,
      action: pr.github ? { type: 'link', url: pr.github } : null
    }
  }

  // 8. flagship / best project
  if (/\b(flagship|best project|top project|highlight|favourite|favorite|main project)\b/.test(q)) {
    const pr = portfolio.projects[0]
    return {
      text: `${pr.title} is Ganesh's flagship: ${pr.subtitle}.\n\n${pr.longDescription}`,
      action: { type: 'link', url: pr.github }
    }
  }

  // 9. profile / who is he
  if (/\b(what do you do|what does he do|current role|profile|summary|overview|who is ganesh|about him|about ganesh|tell me about him)\b/.test(q)) {
    return {
      text: `${p.name} is ${p.roles.join(', ')} — based in ${p.location}.\n\n${p.tagline}\n\nHe's studying B.Tech in CS (AI & ML) at MGIT and has shipped 10+ repositories including ${portfolio.projects[0].title}, his flagship AI product. Ask about his projects, skills or experience.`,
      action: null
    }
  }

  // 9. role list / open-to
  if (/\b(roles|job titles?|designations?|positions?)\b/.test(q)) {
    return { text: `Ganesh works as ${p.roles.join(', ')}.\n\nOpen to: ${portfolio.openTo.join(' · ')}`, action: null }
  }

  // 10. experience
  if (nav && nav.id === 'experience') {
    const e = portfolio.experience
    if (e.length === 0) return { text: 'No experience entries yet.', action: null }
    const text = e.map((x) => {
      const head = `${x.role} @ ${x.company}${x.period ? ` (${x.period})` : ''}`
      const body = x.summary ? `\n${x.summary}` : ''
      const points = x.points && x.points.length ? `\n${x.points.map((pt) => `· ${pt}`).join('\n')}` : ''
      return `${head}${body}${points}`
    }).join('\n\n')
    return { text, action: null }
  }

  // 11. education
  if (/\b(degree|college|university|btech|b\.tech|education|academics|graduate|studying)\b/.test(q)) {
    const e = portfolio.education[0]
    return {
      text: `${e.degree} ${e.program}\n${e.institution}, ${e.location} (${e.period})\n\nKey coursework: ${e.coursework.join(', ')}`,
      action: null
    }
  }

  // 12. skills
  if (/\b(skills?|tech stack|stack|technologies|tools|language)\b/.test(q)) {
    const s = portfolio.skills
    return {
      text: [
        `Languages: ${s.languages.join(', ')}`,
        `Frontend: ${s.frontend.join(', ')}`,
        `Backend: ${s.backend.join(', ')}`,
        `DevOps: ${s.devops.join(', ')}`,
        `AI/ML: ${s.ai.join(', ')}`
      ].join('\n'),
      action: null
    }
  }

  // 13. expertise / specialisation
  if (/\b(speciali[sz]e|specialise|expertise|strengths?|domains?|good at|knows? about|skills in)\b/.test(q)) {
    return {
      text: portfolio.expertise
        .map((x) => `${x.domain} — ${x.level}${x.detail ? ` (${x.detail})` : ''}`)
        .join('\n'),
      action: null
    }
  }

  // 14. github
  if (/\b(github|repos?|repositories?)\b/.test(q)) {
    return {
      text: `GitHub: ${p.githubHandle} — ${portfolio.about.stats[0].value} repositories shipped, ${portfolio.projects.length} production-grade projects.`,
      action: { type: 'link', url: p.github }
    }
  }

  // 15. linkedin
  if (/\b(linkedin)\b/.test(q)) {
    return {
      text: `LinkedIn: ${p.linkedinHandle}`,
      action: { type: 'link', url: p.linkedin }
    }
  }

  // 16. coding profiles
  if (/\b(leetcode|geeksforgeeks|hackerrank|codechef|competitive|coding profile)\b/.test(q)) {
    const list = portfolio.codingProfiles.map((c) => c.name).join(', ')
    return {
      text: `Competitive / coding profiles: ${list}. I can open them for you.`,
      action: { type: 'link', url: portfolio.codingProfiles[0].url }
    }
  }

  // 17. achievements
  if (/\b(achievements|awards?|accomplishments?|milestones?|wins?)\b/.test(q)) {
    return {
      text: portfolio.achievements.map((a) => `· ${a.title} (${a.tag}) — ${a.desc}`).join('\n'),
      action: null
    }
  }

  // 18. certifications
  if (/\b(certif|certified|aws|cisco|nptel|oracle)\b/.test(q)) {
    return {
      text: portfolio.certifications.map((c) => `· ${c.name} — ${c.issuer}`).join('\n'),
      action: null
    }
  }

  // 19. section-only reference (short mention without a nav verb)
  if (nav) {
    return {
      text: `That's covered in the ${nav.id} section. Want me to take you there? Say "show ${nav.id}".`,
      action: null
    }
  }

  // 20. fallback
  return {
    text: 'I can tell you about Ganesh\'s experience, skills, projects, education, certifications, achievements — or navigate the site for you. Try "show projects" or "what does he specialize in?".',
    action: null
  }
}
