export const portfolioData = {
  personalInfo: {
    firstName: "GANESH",
    lastName: "BAKKERA",
    monogram: "GB",
    title: "AI & ML Engineer · Full Stack Developer",
    subtitles: ["AI / ML Engineer", "Full Stack Developer", "LLM & NLP Builder"],
    intro: "Software engineer focused on AI/ML products and full-stack systems. I design, build, and ship complete solutions — from pure-CSS art to production AI SaaS — taking ideas from specification to deployment with clean architecture, documentation, and observability.",
    location: "Hyderabad, Telangana, India",
    email: "bakkeraganesh@gmail.com",
    linkedin: "https://www.linkedin.com/in/ganesh-bakkera-898a0331b",
    linkedinHandle: "linkedin.com/in/ganesh-bakkera-898a0331b",
    github: "https://github.com/learnerforge",
    githubHandle: "github.com/learnerforge",
    avatarUrl: "./images/profile/ganesh-profile.png",
    contactPortraitUrl: "./images/profile/ganesh-profile.png"
  },

  aboutMe: {
    description: "I am Ganesh Bakkera, a B.Tech student in Computer Science & Engineering (Artificial Intelligence & Machine Learning) at Mahatma Gandhi Institute of Technology, Hyderabad. I build AI/ML products and full-stack systems end-to-end — LLM-powered roadmaps, real-time device-control tools, and explainable NLP audit engines. I care about production-grade engineering: async backends, security, observability, and clean developer experience.",
    interests: [
      "Artificial Intelligence",
      "Machine Learning",
      "LLM Integration",
      "NLP",
      "Agentic Workflows",
      "Full Stack Development",
      "System Design",
      "Production ML"
    ]
  },

  education: [
    {
      period: "2024 – 2028",
      institution: "Mahatma Gandhi Institute of Technology (MGIT)",
      degree: "Bachelor of Technology",
      major: "Computer Science & Engineering (Artificial Intelligence & Machine Learning)",
      location: "Hyderabad, Telangana",
      details: "Pursuing computer science foundations alongside specialized streams in machine learning, deep learning, and AI systems.",
      cgpa: null,
      coursework: [
        "Data Structures & Algorithms",
        "Artificial Intelligence",
        "Machine Learning",
        "Database Management Systems",
        "Operating Systems",
        "Computer Networks",
        "Software Engineering",
        "Computer Organization",
        "Web Development"
      ]
    }
  ],

  internships: [
    {
      company: "BrightPitch",
      role: "Research Intern",
      period: "Oct 2024 – Present · Remote",
      summary: "Researching AI agent ecosystems, agent memory, and agentic workflows while building full-stack AI tooling and applying ML/NLP models to real research problems.",
      achievements: [
        "Researched AI agents, agent memory, and agentic workflows",
        "Built full-stack AI tooling with ML/NLP models applied to real problems",
        "Practiced production engineering — APIs, testing, and documentation"
      ],
      tags: ["Python", "LLMs", "NLP", "FastAPI", "Research"]
    }
  ],

  projects: [
    {
      id: "pathforge-ai",
      number: "01",
      title: "PathForge AI",
      period: "Flagship Full-Stack AI Product",
      association: "Flagship · github.com/learnerforge/Roadmaps-generator",
      isFlagship: true,
      tags: ["FastAPI", "PostgreSQL 16", "SQLAlchemy", "React 18", "Zustand", "JWT + OAuth", "Docker"],
      description: "AI-guided roadmap generator that imports 87 real roadmaps from roadmap.sh, renders every topic as an interactive node graph, and enriches it with AI explanations, quizzes, and weekly study plans.",
      longDescription: "A flagship demonstration of end-to-end product engineering: data ingestion, async backend architecture, interactive visualization, and AI-assisted pedagogy — all behind authenticated, containerized infrastructure. 9,444 topics imported with staged caching for smooth ReactFlow rendering.",
      problem: "Learning paths are static lists — learners struggle to see how topics connect or get AI-guidance tailored to each skill.",
      solution: "Built an async FastAPI + PostgreSQL backend that ingests roadmap.sh graphs, and a React + Zustand frontend that renders interactive node graphs enriched with generated explanations, quizzes, and weekly plans.",
      features: [
        "87 roadmaps and 9,444 topics imported",
        "Interactive node-graph visualisation (ReactFlow)",
        "AI explanations, quizzes & project suggestions",
        "Weekly AI study plans",
        "JWT + OAuth auth with rate limiting",
        "Async I/O with staged caching",
        "Containerised via Docker"
      ],
      aiTech: "FastAPI, PostgreSQL 16, SQLAlchemy (async), React 18, Zustand, ReactFlow, JWT + OAuth, Docker",
      github: "https://github.com/learnerforge/Roadmaps-generator",
      liveDemo: null,
      screenshots: []
    },
    {
      id: "ai-github-repo-analyzer",
      number: "02",
      title: "AI-GitHub-Repository-Analyzer",
      period: "Open Source · MIT Licensed",
      association: "github.com/learnerforge/AI-GitHub-Repository-Analyzer",
      tags: ["FastAPI", "httpx", "spaCy", "TextRank", "Q-Learning", "NLP"],
      description: "Paste any GitHub URL and receive a 9-dimension quality analysis in under 30 seconds — deterministic offline NLP with a self-improving reinforcement-learning tuner.",
      longDescription: "Combines classic NLP, security tooling, and reinforcement learning into an explainable engineering audit system — a balance of correctness, speed, and transparency. Secret scanning, license and dependency checks included.",
      problem: "Manually reviewing a repository for code quality, security, and maintainability is slow and inconsistent across 9 dimensions.",
      solution: "Built a FastAPI service using deterministic offline NLP (spaCy, TextRank, TF-IDF) that scores repositories on 9 quality dimensions in under 30 seconds, with a Q-learning tuner that improves scoring from user feedback.",
      features: [
        "9-dimension quality analysis in under 30s",
        "Deterministic offline NLP — no black-box AI",
        "Secret scanning & license checks",
        "Dependency analysis",
        "Self-improving Q-learning tuner",
        "MIT-licensed"
      ],
      aiTech: "FastAPI, httpx, spaCy, TextRank, TF-IDF, Q-Learning, NLP",
      github: "https://github.com/learnerforge/AI-GitHub-Repository-Analyzer",
      liveDemo: null,
      screenshots: []
    },
    {
      id: "remote-mouse",
      number: "03",
      title: "Remote Mouse",
      period: "Daily-Shipped Real-World Tool",
      association: "github.com/learnerforge/Remote_Mouse",
      tags: ["Flask", "Socket.IO", "PyAutoGUI", "pynput", "Cloudflare Tunnel"],
      description: "Turns your phone into a wireless mouse and media remote. Zero phone-side install — the laptop runs a Python server and the phone simply opens a URL.",
      longDescription: "A study in systems integration: hardware-level input simulation, real-time web transport, and secure remote access composed into a single reliable tool. Updated daily with CI security audits.",
      problem: "Need a mouse/media remote on the go — but installing drivers or apps on every device is friction.",
      solution: "A laptop-only Python server (Flask + Socket.IO + PyAutoGUI) exposes a zero-install phone client over a Cloudflare tunnel, delivering touchpad and media control over the web.",
      features: [
        "0-install phone client",
        "DPI presets 400–3200",
        "Two-finger scroll & media controls",
        "Low-latency event loop",
        "Cloudflare tunnel remote access",
        "SMTP URL delivery",
        "CI security audits"
      ],
      aiTech: "Flask, Socket.IO, PyAutoGUI, pynput, Cloudflare Tunnel",
      github: "https://github.com/learnerforge/Remote_Mouse",
      liveDemo: null,
      screenshots: []
    },
    {
      id: "nexasite",
      number: "04",
      title: "NexaSite",
      period: "Production Landing-Page Template",
      association: "github.com/learnerforge/NexaSite",
      tags: ["React 19", "Vite", "Tailwind CSS v4", "AOS"],
      description: "A professional, responsive business landing-page template with a 3-mode theme system and polished scroll interactions — production-ready for freelancers and startups.",
      longDescription: "A frontend engineering showcase: component architecture, design-system theming, and accessibility done right. Lightweight build with smooth scroll animations and an accessible, validated contact form.",
      problem: "Businesses need a polished, responsive landing page fast — without rebuilding the same patterns every time.",
      solution: "Built a production-ready React + Vite + Tailwind template with a 3-mode theme system (dark / blue / dust) and accessible, validated contact forms.",
      features: [
        "3-mode theming (dark / blue / dust)",
        "Fully responsive layout",
        "Smooth scroll animations",
        "Accessible, validated contact form",
        "Lightweight build"
      ],
      aiTech: "React 19, Vite, Tailwind CSS v4, AOS",
      github: "https://github.com/learnerforge/NexaSite",
      liveDemo: null,
      screenshots: []
    },
    {
      id: "js-components",
      number: "05",
      title: "JS Components",
      period: "Open Source · 3D Component Library",
      association: "github.com/learnerforge/JS_Components",
      tags: ["JavaScript", "GLSL", "WebGL", "Three.js", "3D Web"],
      description: "A production-grade, open-source 3D component library for the web — 29 hand-built components including animated heroes, GLSL shaders, particle systems, scroll-driven scenes, and model viewers.",
      longDescription: "Each component ships with a live demo, full source code, and one-click download — a showcase of creative frontend engineering and WebGL performance.",
      problem: "Building high-performance 3D web experiences from scratch is slow, and scattered snippets rarely work together.",
      solution: "Engineered 29 production-grade, reusable 3D components with live demos and source — animated heroes, shaders, particles, and interactive UI that compose together.",
      features: [
        "29 hand-built 3D components",
        "GLSL shaders & particle systems",
        "Scroll-driven scenes",
        "Model viewers & interactive UI",
        "Live demos + one-click download",
        "MIT-licensed"
      ],
      aiTech: "JavaScript, GLSL, WebGL, Three.js",
      github: "https://github.com/learnerforge/JS_Components",
      liveDemo: null,
      screenshots: []
    },
    {
      id: "push-to-github",
      number: "06",
      title: "push-to-github",
      period: "Dev Tooling · Automation",
      association: "github.com/learnerforge/push-to-github",
      tags: ["Python", "Git", "CLI", "Automation"],
      description: "The safe, automatic Git repository manager for your local machine — discovers, scans, synchronizes, commits, pushes, verifies, and monitors all your repositories with safety gates.",
      longDescription: "A complete HTML activity report after every run makes it easy to audit exactly what was synced and when — automation you can trust.",
      problem: "Keeping every local repo committed and pushed is repetitive and error-prone.",
      solution: "Built a CLI that auto-discovers Git repositories, applies safety gates, syncs commits, verifies pushes, and emits an HTML activity report after every run.",
      features: [
        "Automatic repo discovery & scan",
        "Safety gates before every push",
        "Commit, push & verify pipelines",
        "Full HTML activity report per run",
        "Cross-repo monitoring"
      ],
      aiTech: "Python, Git, CLI Automation",
      github: "https://github.com/learnerforge/push-to-github",
      liveDemo: null,
      screenshots: []
    }
  ],

  skillsDetailed: [
    "Python", "JavaScript", "HTML", "CSS", "Markdown",
    "React", "Vite", "Tailwind CSS", "Redux", "Figma",
    "FastAPI", "Flask", "Django",
    "PostgreSQL", "SQLite", "Redis",
    "Docker", "Git", "GitHub Actions", "Linux", "Cloudflare", "Nginx",
    "LLM Integration", "Prompt Engineering", "NLP", "spaCy",
    "scikit-learn", "TextRank", "TF-IDF", "Q-Learning"
  ],

  skillsSummary: [
    "Python", "JavaScript", "HTML", "CSS", "React",
    "Vite", "Tailwind CSS", "Redux", "FastAPI", "Flask",
    "Django", "PostgreSQL", "SQLite", "Redis", "Docker",
    "Git", "GitHub Actions", "Linux", "Cloudflare", "Nginx",
    "LLM Integration", "Prompt Engineering", "NLP", "spaCy",
    "scikit-learn", "Machine Learning", "TextRank", "TF-IDF", "Q-Learning", "System Design"
  ],

  aiExpertise: [
    { domain: "LLM Integration", level: "Advanced", details: "Gemini 2.0, GPT-4o-mini fallback, prompt engineering, structured output" },
    { domain: "NLP", level: "Advanced", details: "TextRank, TF-IDF, spaCy, extractive summarization, entity extraction" },
    { domain: "Machine Learning", level: "Intermediate", details: "scikit-learn, Random Forest, Decision Trees, model evaluation" },
    { domain: "Reinforcement Learning", level: "Intermediate", details: "Q-learning tuners applied to real scoring systems" },
    { domain: "Agentic Workflows", level: "Exploring", details: "Agent memory, tool-use, agent-skill ecosystems, CopilotKit" }
  ],

  achievements: [
    {
      title: "FLAGSHIP PRODUCT",
      org: "PathForge AI",
      desc: "Built PathForge AI end-to-end — 87 roadmaps and 9,444 topics shipped with AI explanations, quizzes, and weekly study plans.",
      date: "2026"
    },
    {
      title: "CONSISTENT SHIPPING",
      org: "Remote Mouse",
      desc: "Remote_Mouse updated daily with CI security audits — a real-world device-control tool in daily use.",
      date: "2026"
    },
    {
      title: "OPEN SOURCE",
      org: "AI-GitHub-Repository-Analyzer",
      desc: "MIT-licensed repository analysis engine combining NLP, security tooling, and reinforcement learning.",
      date: "2026"
    },
    {
      title: "DEEP RESEARCH",
      org: "BrightPitch · Research Intern",
      desc: "Active exploration of AI agents, agent memory, agentic workflows, and CopilotKit.",
      date: "2024 – Present"
    }
  ],

  certifications: [
    { name: "AWS Cloud Foundations", issuer: "AWS", icon: "aws" },
    { name: "Cloud Infrastructure", issuer: "Oracle", icon: "oracle" },
    { name: "Programming & Data Science", issuer: "NPTEL", icon: "nptel" },
    { name: "Cybersecurity Essentials", issuer: "Cisco", icon: "cisco" }
  ],

  codingProfiles: [
    { name: "LeetCode", url: "https://leetcode.com/" },
    { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/" },
    { name: "HackerRank", url: "https://www.hackerrank.com/" },
    { name: "CodeChef", url: "https://www.codechef.com/" }
  ]
};
