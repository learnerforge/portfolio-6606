export const portfolio = {
  os: {
    name: 'GANESH OS',
    version: 'v4.0.0',
    user: 'ganesh',
    hostname: 'portfolio'
  },

  profile: {
    name: 'Ganesh Bakkera',
    first: 'Ganesh',
    last: 'Bakkera',
    monogram: 'GB',
    roles: ['AI / ML Engineer', 'Full Stack Developer', 'LLM & NLP Builder'],
    core: 'AI / ML Engineer',
    tagline: 'From specification to deployment — AI products and full-stack systems, built end-to-end.',
    location: 'Hyderabad, Telangana, India',
    email: 'bakkeraganesh@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ganesh-bakkera-898a0331b',
    linkedinHandle: 'ganesh-bakkera-898a0331b',
    github: 'https://github.com/learnerforge',
    githubHandle: 'learnerforge',
    avatar: '/images/profile/ganesh-avatar.svg'
  },

  about: {
    paragraphs: [
      'I am Ganesh Bakkera, a Computer Science & Engineering student (AI & Machine Learning) at Mahatma Gandhi Institute of Technology, Hyderabad.',
      'I design, build, and ship complete solutions — not demos. From pure-CSS art to production AI SaaS, I take ideas from specification to deployment with clean architecture, documentation, and observability.'
    ],
    focus: [
      'Artificial Intelligence', 'Machine Learning', 'LLM Integration', 'NLP',
      'Agentic Workflows', 'Full Stack Systems', 'System Design', 'Production ML'
    ],
    stats: [
      { value: 10, suffix: '+', label: 'Repositories shipped' },
      { value: 6, suffix: '', label: 'Production-grade projects' },
      { value: 1, suffix: '', label: 'Flagship AI product' },
      { value: 30, suffix: 's', label: 'Repo quality audits' }
    ]
  },

  skills: {
    languages: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML / CSS', 'Bash'],
    frontend: ['React', 'Vite', 'Tailwind CSS', 'Motion', 'GSAP', 'Three.js / WebGL'],
    backend: ['FastAPI', 'Flask', 'Node.js', 'PostgreSQL', 'SQLAlchemy', 'REST / WebSockets'],
    devops: ['Docker', 'CI/CD', 'Git & GitHub', 'Vercel', 'Cloudflare Tunnel', 'Linux'],
    ai: ['LLMs & Prompt Engineering', 'NLP (spaCy, TextRank)', 'scikit-learn', 'Agentic Workflows', 'CopilotKit', 'Gemini / OpenAI APIs']
  },

  experience: [
    {
      company: 'BrightPitch',
      role: 'Research Intern',
      period: 'Oct 2024 — Present',
      type: 'Remote',
      current: true,
      points: [
        'Exploring AI agents, agent memory, and agentic workflows with CopilotKit',
        'Building tool-use and agent-skill ecosystems for real products'
      ]
    }
  ],

  openTo: ['AI / ML internships', 'Research collaborations', 'Hackathon teams', 'Open-source contributions'],

  education: [
    {
      degree: 'B.Tech',
      program: 'Computer Science & Engineering (Artificial Intelligence & Machine Learning)',
      institution: 'Mahatma Gandhi Institute of Technology (MGIT)',
      location: 'Hyderabad, Telangana',
      period: '2024 — 2028',
      coursework: [
        'Data Structures & Algorithms', 'Artificial Intelligence', 'Machine Learning',
        'Database Management Systems', 'Operating Systems', 'Computer Networks',
        'Software Engineering', 'Computer Organization', 'Web Development'
      ]
    }
  ],

  projects: [
    {
      id: 'pathforge-ai',
      num: '01',
      title: 'PathForge AI',
      subtitle: 'AI-guided roadmap generator',
      flagship: true,
      tags: ['FastAPI', 'PostgreSQL 16', 'SQLAlchemy', 'React 18', 'Zustand', 'JWT + OAuth', 'Docker'],
      description: 'Imports 87 real roadmaps from roadmap.sh, renders every topic as an interactive node graph, and enriches it with AI explanations, quizzes, and weekly study plans.',
      longDescription: 'A flagship demonstration of end-to-end product engineering: data ingestion, async backend architecture, interactive visualization, and AI-assisted pedagogy — all behind authenticated, containerized infrastructure. 9,444 topics imported with staged caching for smooth ReactFlow rendering.',
      stack: 'FastAPI · PostgreSQL 16 · SQLAlchemy (async) · React 18 · Zustand · ReactFlow · Docker',
      github: 'https://github.com/learnerforge/Roadmaps-generator',
      gradient: 'from-indigo-500 via-violet-500 to-fuchsia-500',
      highlight: ['87 roadmaps', '9,444 topics', 'Async FastAPI', 'Dockerized']
    },
    {
      id: 'ai-github-repo-analyzer',
      num: '02',
      title: 'Repo Quality Analyzer',
      subtitle: '9-dimension GitHub audits in 30s',
      tags: ['FastAPI', 'httpx', 'spaCy', 'TextRank', 'Q-Learning', 'NLP'],
      description: 'Paste any GitHub URL and receive a 9-dimension quality analysis in under 30 seconds — deterministic offline NLP with a self-improving reinforcement-learning tuner.',
      stack: 'FastAPI · httpx · spaCy · TextRank · TF-IDF · Q-Learning',
      github: 'https://github.com/learnerforge/AI-GitHub-Repository-Analyzer',
      gradient: 'from-sky-500 via-indigo-500 to-violet-500',
      highlight: ['30s audits', 'Q-Learning tuner', 'Offline NLP']
    },
    {
      id: 'remote-mouse',
      num: '03',
      title: 'Remote Mouse',
      subtitle: 'Your phone becomes a wireless mouse',
      tags: ['Flask', 'Socket.IO', 'PyAutoGUI', 'pynput', 'Cloudflare Tunnel'],
      description: 'Turns your phone into a wireless mouse and media remote. Zero phone-side install — the laptop runs a Python server and the phone simply opens a URL.',
      stack: 'Flask · Socket.IO · PyAutoGUI · pynput · Cloudflare Tunnel',
      github: 'https://github.com/learnerforge/Remote_Mouse',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      highlight: ['0-install client', 'Media remote', 'Daily CI audits']
    },
    {
      id: 'nexasite',
      num: '04',
      title: 'NexaSite',
      subtitle: 'Production landing-page template',
      tags: ['React 19', 'Vite', 'Tailwind CSS v4', 'AOS'],
      description: 'A professional, responsive business landing-page template with a 3-mode theme system and polished scroll interactions — production-ready for freelancers and startups.',
      stack: 'React 19 · Vite · Tailwind CSS v4 · AOS',
      github: 'https://github.com/learnerforge/NexaSite',
      gradient: 'from-amber-400 via-orange-500 to-rose-500',
      highlight: ['3-mode theming', 'A11y validated forms', 'Responsive']
    },
    {
      id: 'js-components',
      num: '05',
      title: 'JS Components',
      subtitle: 'Open-source 3D component library',
      tags: ['JavaScript', 'GLSL', 'WebGL', 'Three.js', '3D Web'],
      description: 'A production-grade, open-source 3D component library for the web — 29 hand-built components including animated heroes, GLSL shaders, particle systems, scroll-driven scenes, and model viewers.',
      stack: 'JavaScript · GLSL · WebGL · Three.js',
      github: 'https://github.com/learnerforge/JS_Components',
      gradient: 'from-fuchsia-500 via-purple-500 to-indigo-500',
      highlight: ['29 components', 'GLSL shaders', 'MIT licensed']
    },
    {
      id: 'push-to-github',
      num: '06',
      title: 'push-to-github',
      subtitle: 'Automatic Git repo manager',
      tags: ['Python', 'Git', 'CLI', 'Automation'],
      description: 'The safe, automatic Git repository manager for your local machine — discovers, scans, synchronizes, commits, pushes, verifies, and monitors all your repositories with safety gates.',
      stack: 'Python · Git · CLI Automation',
      github: 'https://github.com/learnerforge/push-to-github',
      gradient: 'from-slate-500 via-gray-500 to-zinc-600',
      highlight: ['Safety gates', 'HTML activity report', 'Cross-repo monitor']
    }
  ],

  expertise: [
    { domain: 'LLM Integration', level: 'Advanced', detail: 'Gemini 2.0, GPT-4o-mini fallback, prompt engineering, structured output' },
    { domain: 'NLP', level: 'Advanced', detail: 'TextRank, TF-IDF, spaCy, extractive summarization, entity extraction' },
    { domain: 'Machine Learning', level: 'Intermediate', detail: 'scikit-learn, Random Forest, Decision Trees, model evaluation' },
    { domain: 'Reinforcement Learning', level: 'Intermediate', detail: 'Q-learning tuners applied to real scoring systems' },
    { domain: 'Agentic Workflows', level: 'Exploring', detail: 'Agent memory, tool-use, agent-skill ecosystems, CopilotKit' }
  ],

  achievements: [
    {
      title: 'Flagship Product',
      org: 'PathForge AI',
      desc: 'Built PathForge AI end-to-end — 87 roadmaps and 9,444 topics shipped with AI explanations, quizzes, and weekly study plans.',
      tag: '2026'
    },
    {
      title: 'Consistent Shipping',
      org: 'Remote Mouse',
      desc: 'Remote_Mouse updated daily with CI security audits — a real-world device-control tool in daily use.',
      tag: '2026'
    },
    {
      title: 'Open Source',
      org: 'Repo Quality Analyzer',
      desc: 'MIT-licensed repository analysis engine combining NLP, security tooling, and reinforcement learning.',
      tag: '2026'
    },
    {
      title: 'Deep Research',
      org: 'BrightPitch',
      desc: 'Active exploration of AI agents, agent memory, agentic workflows, and CopilotKit.',
      tag: '2024 — Present'
    }
  ],

  certifications: [
    { name: 'AWS Cloud Foundations', issuer: 'AWS' },
    { name: 'Cloud Infrastructure', issuer: 'Oracle' },
    { name: 'Programming & Data Science', issuer: 'NPTEL' },
    { name: 'Cybersecurity Essentials', issuer: 'Cisco' }
  ],

  codingProfiles: [
    { name: 'LeetCode', url: 'https://leetcode.com/u/thinker_246606/' },
    { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/profile/bakkerarbgl' },
    { name: 'CodeChef', url: 'https://www.codechef.com/users/ganesh_122006' },
    { name: 'HackerRank', url: 'https://www.hackerrank.com/profile/bakkeraganesh' },
    { name: 'Reddit', url: 'https://www.reddit.com/user/ganesh_2006_/' },
    { name: 'X', url: 'https://x.com/ganesh_047' }
  ],

  personality: {
    thingsIBuild: [
      'AI products end-to-end', 'LLM integrations', 'Agentic systems',
      'Full-stack web apps', 'Repo tooling & automation', 'Creative web UI'
    ],
    currentlyLearning: [
      'Agent memory', 'CopilotKit', 'Reinforcement Learning', '3D web graphics'
    ],
    terminal: [
      { cmd: 'whoami', out: 'ganesh — AI/ML engineer & full-stack builder' },
      { cmd: 'ls ./now', out: 'working on  →  agent memory + tool-use ecosystems' },
      { cmd: 'cat ./goal.toml', out: 'ship one production-grade product per semester' },
      { cmd: 'status --energy', out: '92% · grinding, learning, shipping' }
    ]
  }
}

export const staticRepos = [
  {
    name: 'Roadmaps-generator',
    description: 'PathForge AI — AI-guided roadmap generator with 87 roadmaps and 9,444 interactive topics.',
    language: 'Python',
    html_url: 'https://github.com/learnerforge/Roadmaps-generator'
  },
  {
    name: 'AI-GitHub-Repository-Analyzer',
    description: '9-dimension GitHub quality audits in under 30 seconds, with an RL tuner.',
    language: 'Python',
    html_url: 'https://github.com/learnerforge/AI-GitHub-Repository-Analyzer'
  },
  {
    name: 'Remote_Mouse',
    description: 'Turn your phone into a wireless mouse and media remote — zero install.',
    language: 'Python',
    html_url: 'https://github.com/learnerforge/Remote_Mouse'
  },
  {
    name: 'NexaSite',
    description: 'Production landing-page template with a 3-mode theme system.',
    language: 'React',
    html_url: 'https://github.com/learnerforge/NexaSite'
  },
  {
    name: 'JS_Components',
    description: '29 hand-built 3D web components — heroes, GLSL shaders, particle scenes.',
    language: 'JavaScript',
    html_url: 'https://github.com/learnerforge/JS_Components'
  },
  {
    name: 'push-to-github',
    description: 'Automatic, safe Git repository manager with verification and safety gates.',
    language: 'Python',
    html_url: 'https://github.com/learnerforge/push-to-github'
  }
]