export const portfolio = {
  profile: {
    name: 'Ganesh Bakkera',
    first: 'Ganesh',
    last: 'Bakkera',
    monogram: 'GB',
    roles: ['AI / ML Engineer', 'Full Stack Developer', 'LLM & NLP Builder'],
    tagline: 'From specification to deployment — AI products and full-stack systems, built end-to-end.',
    location: 'Hyderabad, Telangana, India',
    email: 'bakkeraganesh@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ganesh-bakkera-898a0331b',
    linkedinHandle: 'ganesh-bakkera-898a0331b',
    github: 'https://github.com/learnerforge',
    githubHandle: 'learnerforge',
    avatar: './images/profile/ganesh-avatar.svg'
  },

  about: {
    paragraphs: [
      'I am Ganesh Bakkera, a B.Tech student in Computer Science & Engineering (Artificial Intelligence & Machine Learning) at Mahatma Gandhi Institute of Technology, Hyderabad.',
      'I design, build, and ship complete solutions — not demos. From pure-CSS art to production AI SaaS, I take ideas from specification to deployment with clean architecture, documentation, and observability.'
    ],
    focus: [
      'Artificial Intelligence', 'Machine Learning', 'LLM Integration', 'NLP',
      'Agentic Workflows', 'Full Stack Systems', 'System Design', 'Production ML'
    ],
    stats: [
      { value: '10+', label: 'Repositories shipped' },
      { value: '6', label: 'Production-grade projects' },
      { value: '1', label: 'Flagship AI product' },
      { value: '30s', label: 'Repo quality audits' }
    ]
  },

  experience: [
    {
      company: 'BrightPitch',
      role: 'Research Intern',
      period: 'Oct 2024 — Present',
      type: 'Remote',
      current: true
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
      problem: 'Learning paths are static lists — learners struggle to see how topics connect or get AI guidance tailored to each skill.',
      solution: 'Built an async FastAPI + PostgreSQL backend that ingests roadmap.sh graphs, and a React + Zustand frontend that renders interactive node graphs enriched with generated explanations, quizzes, and weekly plans.',
      features: [
        '87 roadmaps and 9,444 topics imported',
        'Interactive node-graph visualization (ReactFlow)',
        'AI explanations, quizzes & project suggestions',
        'Weekly AI study plans',
        'JWT + OAuth auth with rate limiting',
        'Async I/O with staged caching',
        'Containerised via Docker'
      ],
      stack: 'FastAPI · PostgreSQL 16 · SQLAlchemy (async) · React 18 · Zustand · ReactFlow · Docker',
      github: 'https://github.com/learnerforge/Roadmaps-generator'
    },
    {
      id: 'ai-github-repo-analyzer',
      num: '02',
      title: 'Repo Quality Analyzer',
      subtitle: '9-dimension GitHub audits in 30s',
      tags: ['FastAPI', 'httpx', 'spaCy', 'TextRank', 'Q-Learning', 'NLP'],
      description: 'Paste any GitHub URL and receive a 9-dimension quality analysis in under 30 seconds — deterministic offline NLP with a self-improving reinforcement-learning tuner.',
      longDescription: 'Combines classic NLP, security tooling, and reinforcement learning into an explainable engineering audit system — a balance of correctness, speed, and transparency. Secret scanning, license and dependency checks included.',
      problem: 'Manually reviewing a repository for code quality, security, and maintainability is slow and inconsistent across 9 dimensions.',
      solution: 'Built a FastAPI service using deterministic offline NLP (spaCy, TextRank, TF-IDF) that scores repositories on 9 quality dimensions in under 30 seconds, with a Q-learning tuner that improves scoring from user feedback.',
      features: [
        '9-dimension quality analysis in under 30s',
        'Deterministic offline NLP — no black-box AI',
        'Secret scanning & license checks',
        'Dependency analysis',
        'Self-improving Q-learning tuner',
        'MIT-licensed'
      ],
      stack: 'FastAPI · httpx · spaCy · TextRank · TF-IDF · Q-Learning',
      github: 'https://github.com/learnerforge/AI-GitHub-Repository-Analyzer'
    },
    {
      id: 'remote-mouse',
      num: '03',
      title: 'Remote Mouse',
      subtitle: 'Your phone becomes a wireless mouse',
      tags: ['Flask', 'Socket.IO', 'PyAutoGUI', 'pynput', 'Cloudflare Tunnel'],
      description: 'Turns your phone into a wireless mouse and media remote. Zero phone-side install — the laptop runs a Python server and the phone simply opens a URL.',
      longDescription: 'A study in systems integration: hardware-level input simulation, real-time web transport, and secure remote access composed into a single reliable tool. Updated daily with CI security audits.',
      problem: 'Need a mouse and media remote on the go — but installing drivers or apps on every device is friction.',
      solution: 'A laptop-only Python server (Flask + Socket.IO + PyAutoGUI) exposes a zero-install phone client over a Cloudflare tunnel, delivering touchpad and media control over the web.',
      features: [
        '0-install phone client',
        'DPI presets 400–3200',
        'Two-finger scroll & media controls',
        'Low-latency event loop',
        'Cloudflare tunnel remote access',
        'SMTP URL delivery',
        'CI security audits'
      ],
      stack: 'Flask · Socket.IO · PyAutoGUI · pynput · Cloudflare Tunnel',
      github: 'https://github.com/learnerforge/Remote_Mouse'
    },
    {
      id: 'nexasite',
      num: '04',
      title: 'NexaSite',
      subtitle: 'Production landing-page template',
      tags: ['React 19', 'Vite', 'Tailwind CSS v4', 'AOS'],
      description: 'A professional, responsive business landing-page template with a 3-mode theme system and polished scroll interactions — production-ready for freelancers and startups.',
      longDescription: 'A frontend engineering showcase: component architecture, design-system theming, and accessibility done right. Lightweight build with smooth scroll animations and an accessible, validated contact form.',
      problem: 'Businesses need a polished, responsive landing page fast — without rebuilding the same patterns every time.',
      solution: 'Built a production-ready React + Vite + Tailwind template with a 3-mode theme system (dark / blue / dust) and accessible, validated contact forms.',
      features: [
        '3-mode theming (dark / blue / dust)',
        'Fully responsive layout',
        'Smooth scroll animations',
        'Accessible, validated contact form',
        'Lightweight build'
      ],
      stack: 'React 19 · Vite · Tailwind CSS v4 · AOS',
      github: 'https://github.com/learnerforge/NexaSite'
    },
    {
      id: 'js-components',
      num: '05',
      title: 'JS Components',
      subtitle: 'Open-source 3D component library',
      tags: ['JavaScript', 'GLSL', 'WebGL', 'Three.js', '3D Web'],
      description: 'A production-grade, open-source 3D component library for the web — 29 hand-built components including animated heroes, GLSL shaders, particle systems, scroll-driven scenes, and model viewers.',
      longDescription: 'Each component ships with a live demo, full source code, and one-click download — a showcase of creative frontend engineering and WebGL performance.',
      problem: 'Building high-performance 3D web experiences from scratch is slow, and scattered snippets rarely work together.',
      solution: 'Engineered 29 production-grade, reusable 3D components with live demos and source — animated heroes, shaders, particles, and interactive UI that compose together.',
      features: [
        '29 hand-built 3D components',
        'GLSL shaders & particle systems',
        'Scroll-driven scenes',
        'Model viewers & interactive UI',
        'Live demos + one-click download',
        'MIT-licensed'
      ],
      stack: 'JavaScript · GLSL · WebGL · Three.js',
      github: 'https://github.com/learnerforge/JS_Components'
    },
    {
      id: 'push-to-github',
      num: '06',
      title: 'push-to-github',
      subtitle: 'Automatic Git repo manager',
      tags: ['Python', 'Git', 'CLI', 'Automation'],
      description: 'The safe, automatic Git repository manager for your local machine — discovers, scans, synchronizes, commits, pushes, verifies, and monitors all your repositories with safety gates.',
      longDescription: 'A complete HTML activity report after every run makes it easy to audit exactly what was synced and when — automation you can trust.',
      problem: 'Keeping every local repo committed and pushed is repetitive and error-prone.',
      solution: 'Built a CLI that auto-discovers Git repositories, applies safety gates, syncs commits, verifies pushes, and emits an HTML activity report after every run.',
      features: [
        'Automatic repo discovery & scan',
        'Safety gates before every push',
        'Commit, push & verify pipelines',
        'Full HTML activity report per run',
        'Cross-repo monitoring'
      ],
      stack: 'Python · Git · CLI Automation',
      github: 'https://github.com/learnerforge/push-to-github'
    }
  ],

  expertise: [
    { domain: 'LLM Integration', level: 'Advanced', detail: 'Gemini 2.0, GPT-4o-mini fallback, prompt engineering, structured output', icon: 'bot' },
    { domain: 'NLP', level: 'Advanced', detail: 'TextRank, TF-IDF, spaCy, extractive summarization, entity extraction', icon: 'message' },
    { domain: 'Machine Learning', level: 'Intermediate', detail: 'scikit-learn, Random Forest, Decision Trees, model evaluation', icon: 'brain' },
    { domain: 'Reinforcement Learning', level: 'Intermediate', detail: 'Q-learning tuners applied to real scoring systems', icon: 'chip' },
    { domain: 'Agentic Workflows', level: 'Exploring', detail: 'Agent memory, tool-use, agent-skill ecosystems, CopilotKit', icon: 'sparkles' }
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
    { name: 'HackerRank', url: 'https://www.hackerrank.com/' },
    { name: 'CodeChef', url: 'https://www.codechef.com/' }
  ],

  skills: {
    languages: ['Python', 'JavaScript', 'HTML', 'CSS', 'Markdown'],
    frontend: ['Vue', 'React', 'Vite', 'Tailwind CSS', 'Redux', 'Figma'],
    backend: ['FastAPI', 'Flask', 'Django', 'PostgreSQL', 'SQLite', 'Redis'],
    devops: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'Cloudflare', 'Nginx'],
    ai: ['LLM Integration', 'Prompt Engineering', 'NLP', 'spaCy', 'scikit-learn', 'TextRank', 'TF-IDF', 'Q-Learning']
  }
}
